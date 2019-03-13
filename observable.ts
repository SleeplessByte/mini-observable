/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  ObserverNext,
  ObserverStart,
  SloppyObserver,
  SubscriberFunction,
  Subscription,
  SubscriptionObserver
} from './index'

/**
 * Observable provides an interface for an event system which can emit multiple values,
 * is lazily evaluated and can be unsubscribed from. The laws of observable
 * are:
 *
 * - Observable is not async, but can be easily used in an async way
 * - Observable puts composability above all else (see utils below)
 * - Observable is not evaluated until someone subscribes
 *  - Observable is no longer evaluated after someone unsubscribes
 *
 * @example <caption>Event listener as observable, emitting events</caption>
 *
 *   mouseClicks = new Observable(({next} => {
 *     window.addEventListener('click', next)
 *     return () => { window.removeEventListener('click', next) }
 *   })
 *
 *   let unsubscribe = mouseClicks.subscribe(({ preventDefault }) => preventDefault())
 */
export default class Observable<T> {
  public subscribe: (observer: SloppyObserver<T>) => Subscription

  public constructor(subscribe: SubscriberFunction<T>) {
    // subscribe wraps the <subscriberCallback> which only accepts proper
    // <subscription> objects, and instead provides a subscribe function which
    // accepts <sloppySubscription>, allowing for omitting properties in a
    // subscriber object, without causing failures in the subscriberCallback
    this.subscribe = (
      sloppyObserver,
      error?: (errorValue: Error) => void,
      complete?: (value: T) => void
    ) => {
      let start: ObserverStart | undefined
      let next: ObserverNext<T> | undefined
      if (typeof sloppyObserver === 'function') {
        next = sloppyObserver
      } else {
        start = sloppyObserver.start
        next = sloppyObserver.next
        error = sloppyObserver.error
        complete = sloppyObserver.complete
      }
      let cleanup: () => void
      let closed = false
      const wrapClosed = (fn?: (v?: T) => void): (() => void) => (v?: T) =>
        closed || (fn && fn(v))
      const unsubscribe = wrapClosed(() => {
        closed = true
        cleanup && cleanup()
      })
      const wrapUnsubscribe = (fn?: (v?: any) => void): (() => void) => (
        v?: any
      ) => {
        unsubscribe()
        typeof fn === 'function' && fn(v)
      }
      error = wrapClosed(wrapUnsubscribe(error))
      const wrapTry = (fn: (v: T) => void): (() => void) => (v?: T) => {
        try {
          fn(v!)
        } catch (e) {
          typeof error === 'function' && error(e)
        }
      }
      complete = wrapClosed(wrapTry(wrapUnsubscribe(complete)))
      next = wrapClosed(wrapTry(next!))

      const subscription: Subscription = {
        get closed() {
          return closed
        },
        unsubscribe
      }
      start && start(subscription)
      if (closed) {
        return subscription
      }
      wrapTry(() => {
        const observer: SubscriptionObserver<T> = {
          closed,
          complete: complete!,
          error: error!,
          next: next!
        }
        const wSub = subscribe(observer) as Subscription
        cleanup = wSub as any
        if (wSub && typeof wSub.unsubscribe === 'function') {
          cleanup = wSub.unsubscribe
        }
      })()
      return subscription
    }
  }
}
