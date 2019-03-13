import { expect } from 'chai'
import { describe, it } from 'mocha'
import of from '../of'
import skip from '../skip'

describe('skip', () => {
  it('skips the first N events', done => {
    const numbers: number[] = []
    skip(of(1, 2, 3, 4, 5, 6, 7), 3).subscribe({
      error: done,
      next(n) {
        numbers.push(n)
      },
      complete() {
        expect(numbers).to.deep.equal(
          [4, 5, 6, 7],
          'skip did not work correctly'
        )
        done()
      }
    })
  })
})
