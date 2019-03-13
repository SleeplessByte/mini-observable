import { runTests } from 'es-observable-tests'
import { describe, it } from 'mocha'
import Observable from '../observable'

describe('TC39 tests', () => {
  it('TC39 tests (not all will pass)', () =>
    runTests(Observable).then(status => {
      if (status.logger.failed > status.logger.passed) {
        throw new Error(
          `too many tc39 tests failed! (${status.logger.failed +
            status.logger.errored})`
        )
      }
    }))
})
