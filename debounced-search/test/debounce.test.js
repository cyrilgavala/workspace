import test from 'node:test';
import assert from 'node:assert';
import { debounce } from '../src/debounce.js';

// A fake, controllable clock so timing is deterministic (no real timers).
// The handle returned by setTimeout must match what clearTimeout looks up.
function fakeClock() {
  const pending = [];
  let id = 0;
  return {
    setTimeout(fn) {
      const handle = id++;
      pending.push({ fn, handle });
      return handle;
    },
    clearTimeout(handle) {
      const e = pending.find((x) => x.handle === handle);
      if (e) e.cancelled = true;
    },
    flush() {
      const run = pending.splice(0, pending.length).filter((e) => !e.cancelled);
      for (const e of run) e.fn();
    },
  };
}

test('debounce collapses rapid calls into one invocation', () => {
  const clock = fakeClock();
  let calls = 0;
  const fn = debounce(() => calls++, 200, clock);

  fn();
  fn();
  fn();
  assert.strictEqual(calls, 0, 'should not fire before the window elapses');
  clock.flush(); // window elapses
  assert.strictEqual(calls, 1, 'should fire exactly once after the window');
});

test('debounce forwards the latest arguments', () => {
  const clock = fakeClock();
  let last;
  const fn = debounce((x) => (last = x), 100, clock);
  fn('a');
  fn('b');
  fn('c');
  clock.flush();
  assert.strictEqual(last, 'c', 'the latest argument should win');
});
