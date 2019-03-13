import { expect } from 'chai'
import { describe, it } from 'mocha'
import fromEvent from '../fromEvent'

describe('fromEvent', () => {
  it('attaches event listener', done => {
    const optionsStub = {}
    const fakeDomNode = {
      removeEventListener() {
        done(
          new Error('removeEventListener was called but shoult not have been')
        )
      },
      addEventListener(name: string, fn: () => void, options: object) {
        expect(name).to.equal(
          'click',
          'fromEvent addedEventListener with wrong name'
        )
        expect(fn).to.be.a(
          'function',
          'fromEvent addedEventListener passed incorrect callback type'
        )
        expect(options).to.equal(
          optionsStub,
          'fromEvent addedEventListener with wrong options'
        )
        done()
      }
    }
    fromEvent(fakeDomNode, 'click', optionsStub).subscribe({})
  })

  it('removes event listener on unsubscribe', done => {
    let nextFn: (() => void) | null = null
    const optionsStub = {}
    const fakeDomNode = {
      addEventListener(name: string, fn: () => void) {
        nextFn = fn
      },
      removeEventListener(name: string, fn: () => void, options: object) {
        expect(name).to.equal(
          'click',
          'fromEvent removedEventListener with wrong name'
        )
        expect(fn).to.equal(
          nextFn,
          'fromEvent removedEventListener passed wrong function'
        )
        expect(options).to.equal(
          optionsStub,
          'fromEvent removedEventListener with wrong options'
        )
        done()
      }
    }
    const { unsubscribe } = fromEvent(
      fakeDomNode,
      'click',
      optionsStub
    ).subscribe({ error: done })
    unsubscribe()
  })
})
