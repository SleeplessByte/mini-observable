import { Observable as ObservableT, Subscription } from './index'
import Observable from './observable'

type transformFn<T, U> = (value: T) => U

/**
 * Creates an observable that maps each value from the source via a function.
 *
 * {@link map} takes a source `Observable<T>` and calls `transform(T)` for every emitted value. The returned
 * `Observable<U>` will emit the returned values from `transform<T>`. If transform is not callable, and is instead `U`
 * then the raw value is simply used instead.
 *
 * @example <caption>Marble diagram of mapping an obversable</caption>
 *
 * // transform t: x => x * 2
 * // source s:  |--1--2--3--4--|
 * // map(t, s): |--2--4--6--8--|
 *
 * @param {ObservableT<T>} source the source observable
 * @param {U | transformFn<T, U>} transform the function to transform items
 *
 * @returns {ObservableT<U>} Transformed observable
 */
export default function map<T, U>(
  source: ObservableT<T>,
  transform: U | transformFn<T, U>
): ObservableT<U> {
  return new Observable(
    ({ complete, error, next }): Subscription => {
      return source.subscribe({
        complete,
        error,
        next: (value): void =>
          next(
            typeof transform === 'function'
              ? (transform as transformFn<T, U>)(value)
              : transform
          )
      })
    }
  )
}
