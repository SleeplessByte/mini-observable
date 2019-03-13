import {Observable as ObservableT} from './index'
import Observable from './observable'

/**
 * Creates an Observable (`Observable<T>`) from a list of items in an Array or Array Like (`Array<T>`).
 *
 * @param {T[]} items the source items
 * @returns {ObservableT<T>} the observable that emmits the items
 */
export default function of<T>(...items: T[]): ObservableT<T> {
  return new Observable(({next, complete}) => {
    for (const item of items) { next(item) }
    complete()
  })
}
