import { Observable as ObservableT } from './index'
import Observable from './observable'

/**
 * Creates an observable that only emits values as long as {@link toggler}'s last output is `true`
 *
 * {@link toggle} takes a source `Observable<T>` and a toggler `Observable<boolean>`. The output `Observable<T>`
 * will only ever emit `T`s while `Observable<boolean>`'s last emitted value was `true`. If `Observable<boolean>` last
 * emitted `false` then any `T`s up until the next (`Observable<T>`) `true` will be discarded. In other words, toggler
 * `Observable<boolean>` controls whether or not output `Observable<T>` emits values or not. If source
 * `Observable<T>` {@link complete()}s then toggler `Observable<boolean>` will be {@link unsubscribe()}d, however
 * {@link complete()} from toggler `Observable<boolean>` is ignored. Calling {@link unsubscribe()} on output
 * `Observable<T>` will call {@link unsubscribe()} on both source and toggler.
 *
 * @example <caption>Marble diagram</caption>
 *
 * // source s:     |--1--2--3--4--5--6--7--8--|
 * // source t:     |-----T-----F-----T--F-----|
 * // toggle(s, t): |-----2--3--4-----6--7-----|
 *
 * @param {ObservableT<T>} source observable that acts as source emits
 * @param {ObservableT<boolean>} toggler observable that controls the emits of the returned observable
 * @returns {ObservableT<T>} the observable that only emits when toggler's last emit is `true`
 */
export default function toggle<T>(
  source: ObservableT<T>,
  toggler: ObservableT<boolean>
): ObservableT<T> {
  return new Observable(
    ({ complete, error, next }): (() => void) => {
      let doNext = false
      const togglerSubscription = toggler.subscribe({
        next: (bool): boolean => (doNext = bool)
      })
      const sourceSubscription = source.subscribe({
        complete,
        error,
        next: (value): false | void => doNext && next(value)
      })
      return (): void => {
        togglerSubscription.unsubscribe()
        sourceSubscription.unsubscribe()
      }
    }
  )
}
