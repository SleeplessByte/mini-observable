import { Observable as ObservableT } from './index'
import Observable from './observable'

/**
 * Creates an observable that emits when the promise resolves
 *
 * {@link fromPromise} takes a `Promise<T>` and will emit `T` when `Promise<T>` resolves. If `Promise<T>` rejects, then
 * `Observable<T>` will {@link error()}. {@link complete()} is called after `Promise<T>` resolves and `Observable<T>`
 * emits - as such `Observable<T>` will only ever emit one value.
 *
 * @param {Promise<T>} promise the source promise
 * @returns {ObservableT<T>} the observable that emits when the promise resolves
 */
export default function fromPromise<T>(promise: Promise<T>): ObservableT<T> {
  return new Observable(({next, error, complete}) => {
    promise.then(next, error).then(complete)
  })
}

