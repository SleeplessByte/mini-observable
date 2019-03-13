import { Observable as ObservableT } from './index'
import Observable from './observable'

/**
 * Create an observable that skips values if they're the same as the previous one.
 *
 * {@link skipRepeats} takes source `Observable<T>` and returns an output `Observable<T>` which will ignore repeat
 * emissions from the source. Any values emitted multiple times from the source `Observable<T>` will be discarded after
 * the first emission.
 *
 * @note In some libraries this is called `distinctUntilChanged`.
 *
 * @example <caption>Marble diagram</caption>
 *
 * // source s:       |--1--1--2--3--4--4--4--4--5-|
 * // skipRepeats(s): |--1-----2--3--4-----------5-|
 *
 * @param {ObservableT<T>} source source observable
 * @returns {ObservableT<T>} the new observable that skips repeated values
 */
export default function skipRepeats<T>(source: ObservableT<T>): ObservableT<T> {
  return new Observable(({ complete, error, next }) => {
    let lastValue = {}
    return source.subscribe({
      complete,
      error,
      next: value => lastValue !== value && next((lastValue = value))
    })
  })
}
