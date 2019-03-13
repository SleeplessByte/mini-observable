import { Observable as ObservableT } from './index'
import Observable from './observable'

/**
 * Creates an observable whos emits are debounced.
 *
 * {@link debounce} takes a `duration` of milliseconds, and an `Observable<T>`. Any values the source `Observable<T>`
 * emits will not be emitted on the output `Observable<T>` until the duration has passed. If the source `Observable<T>`
 * emits multiple values during one `duration`, then older values are discarded - in other words the output
 * `Observable<T>` will only emit at-most-once per duration, with the latest value from the source `Observable<T>`.
 *
 * @example <caption>Marble diagram for a debounce of 200 ms</caption>
 *
 * // source:        |--1-2-3-----4-5------6-------7----|
 * // debounce(200): |---------3-------5-----6-------7--|
 *
 * @param {ObservableT<T>} source source observable that will be debounced
 * @param {number} duration number of milliseconds it should be debounced
 * @returns {ObservableT<T>} observable that debounces source emits by duration ms
 */
export default function debounce<T>(
  source: ObservableT<T>,
  duration: number
): ObservableT<T> {
  return new Observable(({ complete, error, next }) => {
    let timer: number
    source.subscribe({
      error,
      complete: () => setTimeout(complete, duration),
      next: value => {
        clearTimeout(timer)
        timer = (setTimeout(next, duration, value) as unknown) as number
      }
    })
  })
}
