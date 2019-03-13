import { expect } from 'chai'
import { describe, it } from 'mocha'
import merge from '../merge'
import of from '../of'

describe('merge', () => {
  it('merges multiple observables', done => {
    const numbers: number[] = []
    merge(of(1, 2, 3), of(4, 5, 6), of(7, 8, 9)).subscribe({
      error: done,
      next(n) {
        numbers.push(n)
      },
      complete() {
        expect(numbers).to.deep.equal(
          [1, 2, 3, 4, 5, 6, 7, 8, 9],
          'merge did not work correctly'
        )
        done()
      }
    })
  })
})
