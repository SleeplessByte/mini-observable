import {expect} from 'chai'
import {describe, it} from 'mocha'
import fromPromise from '../frompromise'

describe('fromPromise', () => {

  it('fromPromise success', done => {
    const numbers: number[] = []
    fromPromise(Promise.resolve(1)).subscribe({
      error: done,
      next(n) { numbers.push(n) },
      complete() {
        expect(numbers).to.deep.equal([1], 'fromPromise did not work properly')
        done()
      },
    })
  })

  it('fromPromise failure', done => {
    const error = new Error('oops')
    fromPromise(Promise.reject(error)).subscribe({
      error(givenError) {
        expect(givenError).to.equal(error, 'error did not come back correctly')
        done()
      },
      next() { throw new Error('next got called for some reason') },
      complete() { throw new Error('complete got called for some reason') },
    })
  })

})
