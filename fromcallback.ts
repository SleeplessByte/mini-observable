import {Observable as ObservableT} from './index'
import Observable from './observable'

type Callback<T> = (...args: any) => T

type CallableFunction0<R> = (callback: Callback<R>) => any
type CallableFunction1<A, R> = (a: A, callback: Callback<R>) => any
type CallableFunction2<A, B, R> = (a: A, b: B, callback: Callback<R>) => any
type CallableFunction3<A, B, C, R> = (a: A, b: B, c: C, callback: Callback<R>) => any
type CallableFunction4<A, B, C, D, R> = (a: A, b: B, c: C, d: D, callback: Callback<R>) => any
type CallableFunctionT<T, R> = (...args: Array<T | Callback<R>>) => any

/**
 * Create function (which expects a callback) to a function that returns an observable.
 *
 * {@link fromCallback} translates a callback taking function, and returns a function which no longer takes that
 * callback - instead returning an Observable that, when subscribed to, will call the original function with the given
 * arguments and emit next events any time the callback is called.
 *
 * @example Example using a function with a callback
 *
 *    function readFile(name: string, callback: (contents: Buffer) => void) { }
 *    const newReadFile = fromCallback(readFile)
 *    // => newReadFile(name: string) => Observable<Buffer>.
 *
 * @param {TFunction extends (...args: any[]) => any} func the original callback
 * @returns {ObservableT<T>} observable that calls the callback upon subscription
 */
export default function fromCallback<R>(func: CallableFunction0<R>): () => ObservableT<R>;
export default function fromCallback<A, R>(func: CallableFunction1<A, R>): (a: A) => ObservableT<R>;
export default function fromCallback<A, B, R>(func: CallableFunction2<A, B, R>): (a: A, b: B) => ObservableT<R>;
export default function fromCallback<A, B, C, R>(func: CallableFunction3<A, B, C, R>): (a: A, b: B, c: C) => ObservableT<R>;
export default function fromCallback<A, B, C, D, R>(func: CallableFunction4<A, B, C, D, R>): (a: A, b: B, c: C, d: D) => ObservableT<R>;
export default function fromCallback<T, R>(func: CallableFunctionT<T, R>): (...arg: T[]) => ObservableT<R> {
  return (...args) => new Observable(({ next }) => func(...args.concat(next as any)))
}
