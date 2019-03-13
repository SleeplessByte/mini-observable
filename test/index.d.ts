declare module 'es-observable-tests' {
  export function runTests(klazz: {
    new (...args: any[]): any
  }): Promise<{ logger: { passed: number; errored: number; failed: number } }>
}
