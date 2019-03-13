import {Observable as ObservableT} from './index'
import Observable from './observable'

/**
 * Filter an observable based on a predicate
 *
 * {@link filter} will execute `predicate<T>` for every value emitted from `Observable<T>`. If `predicate<T>` returns
 * `false`, then the output `Observable<T>` won't emit that `T`. If `predicate<T>` returns `true` then the ouput
 * `Observable<T>` will emit that `T`.
 *
 * @example <caption>Marble diagram with a filter</caption>
 *
 * // predicate p: x => x % 2 == 0
 * // source s:     |--1--2--3--4--5--6--|
 * // filter(p, s): |-----2-----4-----6--|
 *
 * @param {ObservableT<T>} source source observable that will be filtered
 * @param {(item: T) => boolean} predicate the filter predicate
 * @returns {ObservableT<T>} filtered source observable by predicate
 */
export default function filter<T>(source: ObservableT<T>, predicate: (item: T) => boolean): ObservableT<T> {
  return new Observable(({complete, error, next}) =>
    source.subscribe({
      complete, error,
      next: (value) => predicate(value) && next(value),
    })
  )
}

