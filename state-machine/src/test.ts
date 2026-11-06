import { test, run, assert, expectThrow } from './runner';
import { Machine } from './machine';

// Valid guarded transitions.
test('idle -> running via start', () => {
  const m = new Machine();
  assert(m.send('start') === 'running', 'expected running');
});

test('running -> paused via pause', () => {
  const m = new Machine();
  m.send('start');
  assert(m.send('pause') === 'paused', 'expected paused');
});

test('paused -> running via resume', () => {
  const m = new Machine();
  m.send('start');
  m.send('pause');
  assert(m.send('resume') === 'running', 'expected running');
});

test('running -> done via complete', () => {
  const m = new Machine();
  m.send('start');
  assert(m.send('complete') === 'done', 'expected done');
});

// Illegal / blocked transitions must throw.
test('pause from idle is illegal', () => {
  const m = new Machine();
  expectThrow(() => m.send('pause'), 'expected pause from idle to throw');
});

test('pause is blocked by the guard when locked', () => {
  const m = new Machine();
  m.send('start');
  m.locked = true;
  expectThrow(() => m.send('pause'), 'expected guard to block the pause');
});

test('no outgoing transitions from done (terminal)', () => {
  const m = new Machine();
  m.send('start');
  m.send('complete');
  expectThrow(() => m.send('resume'), 'expected resume from done to throw');
});

run();
