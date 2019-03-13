import { expect } from 'chai'
import { describe, it } from 'mocha'
import combineObject from '../combineobject'
import of from '../of'

describe('combineObject', () => {
  it('calls transform() on the results of each latest next()', done => {
    const observables = {
      a: of(1),
      b: of(2),
      c: of(3),
      d: of(4)
    }
    combineObject(observables).subscribe({
      complete: done,
      error: done,
      next(value) {
        expect(value).to.deep.equal(
          { a: 1, b: 2, c: 3, d: 4 },
          'combineObject did not work correctly'
        )
      }
    })
  })
})
