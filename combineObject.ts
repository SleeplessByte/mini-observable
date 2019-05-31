import { Observable as ObservableT } from './index'
import Observable from './observable'

interface Sources<T> {
  [name: string]: ObservableT<T>
}
type InferT<S extends Sources<W>, W> = S extends {
  [name: string]: ObservableT<infer T>
}
  ? T
  : never

/**
 * Combine an object of observables into a single observable which outputs an object.
 *
 * {@link combineObject} takes an Object of Observables and returns an Observable of objects; the keys of which match
 * the key of the sources object, and the values match the values emitted by the Observable values in the sources
 * object. The returned Observable may emit stale values, if - for example - one of the sources completes, then
 * subsequent objects will include the last value of that Observable. The output Observable will only {@link complete()}
 * when all sources {@link complete()}. Unsubscribing from the output Observable will unsubscribe from all sources.
 *
 * @example <caption>Marble diagram combining two sources</caption>
 *
 * // sources o.a:      |-1----------------2----------3--------------------------|
 * // sources o.b:      |-------1---------------------2-------------------3------|
 * // combineObject(o): |---{a:1,b:1}--{a:2,b:1}--{a:3,b:1}{a:3,b:2}--{a:3,b:3}--|
 *
 * @param {{ [name: string]: ObservableT<T> }} sources
 * @returns {ObservableT<Record<keyof S, T>>} the combined observable
 */
export default function combineObject<S extends Sources<T>, T>(
  sources: S
): ObservableT<Record<keyof typeof sources, InferT<S, T>>> {
  return new Observable(
    ({ error, next, complete }): void => {
      const total = Object.keys(sources).length
      const started: Partial<Record<keyof S, true>> = {}
      let completed = 0
      const values: Partial<Record<keyof S, T>> = {}
      for (const name in sources) {
        if (sources.hasOwnProperty(name)) {
          sources[name].subscribe({
            error,
            complete(): void {
              completed += 1
              completed === total && complete()
            },
            next(value): void {
              started[name] = true
              values[name] = value
              Object.keys(started).length === total &&
                next(values as Record<keyof S, InferT<S, T>>)
            }
          })
        }
      }
    }
  )
}
