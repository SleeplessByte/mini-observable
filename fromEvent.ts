/* globals AddEventListenerOptions, Event, CustomEvent */
import { Observable as ObservableT } from './index'
import Observable from './observable'

interface HTMLElementLike {
  addEventListener(
    name: string,
    next: (...args: any[]) => any,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener(
    name: string,
    next: (...args: any[]) => any,
    options?: boolean | AddEventListenerOptions
  ): void
}

/**
 * Return an Observable that starts listening on subscrib and stops listening on unsubscribe.
 *
 * {@link fromEvent} takes a name, element and optional options object. The output `Observable<Event|CustomEvent>` will
 * call `element.addEventListener(name, next, options)` - thereby emitting any events from the listener, to the
 * Observable. When unsubscribed, `Observable<Event|CustomEvent>` will cleanup the event listener.
 *
 * @param {HTMLElementLike} element the html element to subscribe on
 * @param {string} name the event name (e.g. click, change, keydown)
 * @param {boolean|AddEventListenerOptions} options the options to pass to the listener
 *
 * @returns {ObservableT<Event|CustomEvent>} the observable
 */
export default function fromEvent(
  element: HTMLElementLike,
  name: string,
  options?: boolean | AddEventListenerOptions
): ObservableT<Event | CustomEvent> {
  return new Observable(
    ({ next }): (() => void) => {
      element.addEventListener(name, next, options)
      return (): void => element.removeEventListener(name, next, options)
    }
  )
}
