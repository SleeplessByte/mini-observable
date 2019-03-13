import { Observable as ObservableT } from './index'
import Observable from './observable'

/**
 * Creates an observable that combines two observables via a transform function
 *
 * {@link combine} takes two Observables (`Observable<T>` and `Observable<U>`) and when it has received values from both
 * Observables will call `transform(T, U)`. {@link combine} itself returns an Observable (`Observable<V>`) which emits
 * `next(V)` for every return value of the called `transform(T, U)`. `transform` can be called with stale values, if -
 * for example - `sourceB` emits after `sourceA` completes, then transform will be called with the last value from
 * `sourceA`. The output `Observable<V>` will only {@link complete()} when both sources {@link complete()}.
 * Unsubscribing from `Observable<V>` will unsubscribe from all sources.
 *
 * @example <caption>Marble diagram with synchronous sources</caption>
 *
 * // transform t: (a, b) => a + b
 * // source a:          |--1--2--1--2--|
 * // source b:          |--1--1--2--2--|
 * // combine(t, a, b):  |--2--3--3--4--|
 *
 * @example <caption>Marble diagram with asynchronous sources</caption>
 *
 * // transform t: (a, b) => a + b
 * // source a:          |--1-----2-----3--|
 * // source b:          |--1--2--3--4--5--|
 * // combine(t, a, b):  |--2--3--5--6--8--|
 *
 * @param {ObservableT<T>} sourceA the first source
 * @param {ObservableT<U>} sourceB the second source
 * @param {((a: T, b: U) => V)} transform function to map from the two sources to the new value
 *
 * @returns {ObservableT<V>} the observable that has the combined values
 */
export default function combine<T, U, V>(
  sourceA: ObservableT<T>,
  sourceB: ObservableT<U>,
  transform: (a: T, b: U) => V
): ObservableT<V> {
  return new Observable(({ error, next, complete }) => {
    let sourceAComplete = false
    let sourceBComplete = false
    let sourceAStarted: boolean
    let sourceBStarted: boolean
    let sourceAValue: T
    let sourceBValue: U
    sourceA.subscribe({
      error,
      complete() {
        sourceAComplete = true
        sourceBComplete && complete()
      },
      next(value) {
        sourceAValue = value
        sourceAStarted = true
        sourceBStarted && next(transform(sourceAValue, sourceBValue))
      }
    })
    sourceB.subscribe({
      error,
      complete() {
        sourceBComplete = true
        sourceAComplete && complete()
      },
      next(value) {
        sourceBValue = value
        sourceBStarted = true
        sourceAStarted && next(transform(sourceAValue, sourceBValue))
      }
    })
  })
}
