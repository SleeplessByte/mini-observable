import { expect } from 'chai'
import { describe, it } from 'mocha'
import of from '../of'
import startWith from '../startWith'

describe('startWith', () => {
  it('pushes value into start of stream', done => {
    const numbers: number[] = []
    startWith(of(2, 3, 4), 1).subscribe({
      error: done,
      next(n) {
        numbers.push(n)
      },
      complete() {
        expect(numbers).to.deep.equal(
          [1, 2, 3, 4],
          'startWith did not work correctly'
        )
        done()
      }
    })
  })
})
