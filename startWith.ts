import { Observable as ObservableT, Subscription } from './index'
import Observable from './observable'

// source:          |-----1--2--3--4--5--6--|
// startWith(s, 1): |--1--1--2--3--4--5--6--|

/**
 * Creates an observable from the source prepended with a single value
 *
 * {@link startWith} takes an initial value `T` and a source `Observable<U>` and returns an ouput `Observable<T|U>`,
 * which immediately emits `T`, subsequently emitting any `U`s coming from `Observable<U>`.
 *
 * @example <caption>Marble diagram prepending the value 9</caption>
 *
 * // source:          |-----1--2--3--4--5--6--|
 * // startWith(s, 9): |--9--1--2--3--4--5--6--|
 *
 * @param {ObservableT<U>} source source observable
 * @param {T} start the value to prepend
 *
 * @returns {ObservableT<T|U>} the observabe that outputs start and then subscribes to source
 */
export default function startWith<T>(
  source: ObservableT<T>,
  start: T
): ObservableT<T>
export default function startWith<T, U>(
  source: ObservableT<U>,
  start: T
): ObservableT<T | U> {
  return new Observable(
    ({ error, next, complete }): Subscription => {
      next(start)
      return source.subscribe({ error, next, complete })
    }
  )
}
