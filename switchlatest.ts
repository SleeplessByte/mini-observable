import {Observable as ObservableT, Subscription} from './index'
import Observable from './observable'

/**
 * Creates an observable that works like {@link flatMap} but unsubscribes from previous {@link transform} outputs.
 *
 * {@link switchLatest} takes a source `Observable<T>` and calls `transform(T)` for each emitted value. Like
 * {@link flatMap}, {@link switchLatest} will immediately subscribe to any `Observable<U>` coming from `transform(T)`,
 * but in addition to this, will {@link unsubscribe()} from any prior `Observable<U>`s - so that there is only ever one
 * `Observable<U>` subscribed at any one time.
 *
 * @note In some libraries this is called `switchMap`.
 *
 * @example <caption>Marble diagram of various sources</caption>
 *
 * // transform t: x => Observable.of(x+1, x+1, x+1))
 * // source:       |--1-----2--3--4--------|
 * // source t(1):  |--2--2--2--------------| // transform returns a new one
 * // source t(2):  |--------3--3--3--------| // transform returns a new one, t(1) observable has been closed
 * // source t(3):  |-----------4--4--4-----| // transform returns a new one, t(2) observable has been closed
 * // source t(4):  |--------------5--5--5--| // transform returns a new one, t(3) observable has been closed
 * // switchLatest: |--2--2--3--4--5--5--5--| // output observable
 *
 * @param {ObservableT<T>} source the source observable
 * @param {(item: T) => ObservableT<U>} transform function that returns an observable based on an item
 *
 * @returns {ObservableT<U>} new observable that emits items coming from the latest transformed observable
 */
export default function switchLatest<T, U>(source: ObservableT<T>, transform: (item: T) => ObservableT<U>): ObservableT<U> {
  let remaining = 0
  return new Observable(({error, next, complete}) => {
    let oldSubscription: Subscription | null = null
    const {unsubscribe} = source.subscribe({
      error,
      next: value => {
        remaining += 1
        if (oldSubscription) {
          remaining -= 1
          oldSubscription.unsubscribe()
        }
        oldSubscription = transform(value).subscribe({
          error, next,
          complete: () => {
            remaining -= 1
            if (remaining === 0) {
              complete()
              unsubscribe && unsubscribe()
            }
          }
        })
      },
    })
  })
}

