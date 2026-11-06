// A tiny, dependency-free test runner. Registers cases, runs each in a try/catch,
// prints PASS/FAIL, and returns the number of failures (the caller decides exit).
type TestFn = () => void | Promise<void>;

const tests: { name: string; fn: TestFn }[] = [];

export function test(name: string, fn: TestFn): void {
  tests.push({ name, fn });
}

export function assert(condition: boolean, msg?: string): void {
  if (!condition) throw new Error(msg || 'assertion failed');
}

// Asserts that `fn` throws. Used for the illegal/blocked-transition cases.
export function expectThrow(fn: () => void, msg?: string): void {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  if (!threw) throw new Error(msg || 'expected an exception');
}

export async function run(): Promise<number> {
  let failed = 0;
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`PASS  ${name}`);
    } catch (err) {
      failed++;
      console.log(`FAIL  ${name} — ${(err as Error).message}`);
    }
  }
  console.log(`\n${tests.length - failed}/${tests.length} passed`);
  return failed;
}
