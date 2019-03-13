import {Observable as ObservableT} from './index'
import Observable from './observable'

/**
 * Creates an observable that merges the emits of many sources
 *
 * {@link merge} takes an arbitrary amount of source `Observable<T>s` and emits any value from any of those sources in
 * the returned Observable<*>. The output Observable<*> will only complete() when all sources complete(). Calling unsubscribe() on the output Observable<*> will call unsubscribe() on all source Observable<*>s.
 *
 * @example <caption>Marble diagram merging two sources</caption>
 *
 * // source a:    |--1-----2-----3-----4-----|
 * // source b:    |--9-----8--------7-----6--|
 * // merge(a, b): |--1-9---2-8---3--7--4--6--|
 *
 * @param {Array<ObservableT<T>>} sources the source observables
 * @returns {ObservableT<T>} the observable that merges all the emits of all the sources
 */
export default function merge<A, B>(a: ObservableT<A>, b: ObservableT<B>): ObservableT<A | B>;
export default function merge<A, B, C>(a: ObservableT<A>, b: ObservableT<B>, c: ObservableT<C>): ObservableT<A | B | C>;
export default function merge<A, B, C, D>(a: ObservableT<A>, b: ObservableT<B>, c: ObservableT<C>, d: ObservableT<D>): ObservableT<A | B | C | D>;
export default function merge<T>(...sources: Array<ObservableT<T>>): ObservableT<T> {
  return new Observable(({error, next, complete}) => {
    let remaining = sources.length
    const subscriptions = sources.map(source =>
      source.subscribe({
        error, next,
        complete: () => (remaining -= 1) === 0 && complete()
      })
    )
    return () => {
      for (const {unsubscribe} of subscriptions) { unsubscribe() }
    }
  })
}

