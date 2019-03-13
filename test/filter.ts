import {expect} from 'chai'
import {describe, it} from 'mocha'
import filter from '../filter'
import of from '../of'

describe('filter', () => {

  it('only calls next() for every observable.next() that passes predicate', done => {
    const numbers: number[] = []
    filter(of(5, 10, 15, 20, 25, 30), i => i % 10 === 0).subscribe({
      error: done,
      next(n) { numbers.push(n) },
      complete() {
        expect(numbers).to.deep.equal([10, 20, 30], 'filter did not work correctly')
        done()
      },
    })
  })

})

