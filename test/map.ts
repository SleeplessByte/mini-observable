import {expect} from 'chai'
import {describe, it} from 'mocha'
import map from '../map'
import of from '../of'

describe('map', () => {

  it('transforms observable next\'s to new values', done => {
    const letters: string[] = []
    map(of({ letter: 'a' }, { letter: 'b' }, { letter: 'c' }), event => event.letter).subscribe({
      error: done,
      next(letter) { letters.push(letter) },
      complete() {
        expect(letters).to.deep.equal(['a', 'b', 'c'], 'map did not work correctly')
        done()
      },
    })
  })

})

