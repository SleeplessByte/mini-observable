import { Observable as ObservableT } from './index'
import Observable from './observable'

/**
 * Create an observable that skips the first {@link count} values.
 *
 * {@link skip} takes a count, and a source `Observable<T>`. The returned `Observable<T>` will only emit `T`s after
 * the source `Observable<T>` has emitted count times. Any values the source `Observable<T>` emits before count is
 * reached will be discarded.
 *
 * @example <caption>Marble diagram skipping 3 values</caption>
 *
 * // source s:   |--1--2--3--4--5--6--7--|
 * // skip(s, 3): |-----------4--5--6--7--|
 *
 * @param {ObservableT<T>} source the source observable
 * @param {number} count positive count to skip
 *
 * @returns {ObservableT<T>} the new observable that skips the first count values
 */
export default function skip<T>(
  source: ObservableT<T>,
  count: number
): ObservableT<T> {
  return new Observable(({ complete, error, next }) => {
    return source.subscribe({
      complete,
      error,
      next: value => {
        if (count === 0) {
          return next(value)
        }
        count -= 1
      }
    })
  })
}
