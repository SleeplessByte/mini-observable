import { Observable as ObservableT, Subscription } from './index'
import Observable from './observable'

// transform t: x => Observable.of(x+1, x+2))
// source s:      |-1-------2-------3-------7-----|
// source t(1):   |-2--3--|
// source t(2):           |-3--4--|
// source t(3):                   |-4--5--|
// source t(7):                           |-8--9--|
// flatMap(t, s): |-2--3----3--4----4--5----8--9--|

/**
 * Creates an observable that emits values from the observables given by transform. The source observable emits to
 * transform.
 *
 * {@link flatMap} takes a source `Observable<T>` and passes each value emitted to `transform(T)`. The output
 * `Observable<U>` of `transform(T)` is then immediately subscribed to and any values are emitted on the output
 * `Observable<U>`. Sources from `transform(T)` may overlap. The output `Observable<U>` will only {@link complete()}
 *  when all sources from `transform(T)` also {@link complete()}. Unsubscribing from the output Observable will
 * unsubscribe from all sources, including `Observable<T>` - and `transform(T)` will no longer be called.
 *
 * @param {ObservableT<T>} source source observable that emits to transform
 * @param {(item: T) => ObservableT<U>} transform function that generates observables based on emits from source
 * @returns {ObservableT<U>} the observable that emits everything from the transform return value observables
 */
export default function flatMap<T, U>(
  source: ObservableT<T>,
  transform: (item: T) => ObservableT<U>
): ObservableT<U> {
  let observables = 0
  const subscriptions: Subscription[] = []
  return new Observable(
    ({ error, next, complete }): (() => void) => {
      subscriptions.push(
        source.subscribe({
          error,
          next: (value): void => {
            observables += 1
            subscriptions.push(
              transform(value).subscribe({
                error,
                next,
                complete: (): false | void =>
                  (observables -= 1) === 0 && complete()
              })
            )
          }
        })
      )
      return (): void =>
        subscriptions.forEach(({ unsubscribe }): void => unsubscribe())
    }
  )
}
