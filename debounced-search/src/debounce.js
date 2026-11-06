// debounce(fn, wait, clock) — invokes `fn` at most once per `wait` window.
// `clock` is injectable (defaults to a global setTimeout/clearTimeout pair) so the
// timing is testable without real timers.
const globalClock = {
  setTimeout: (fn, ms) => globalThis.setTimeout(fn, ms),
  clearTimeout: (h) => globalThis.clearTimeout(h),
};

export function debounce(fn, wait, clock = globalClock) {
  let handle;
  return (...args) => {
    if (handle !== undefined) clock.clearTimeout(handle);
    handle = clock.setTimeout(() => {
      handle = undefined;
      fn(...args);
    }, wait);
  };
}
