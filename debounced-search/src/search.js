import { debounce } from './debounce.js';

// Case-insensitive name/keyword filter.
export function filter(data, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return data;
  return data.filter((item) => (item.name || '').toLowerCase().includes(q));
}

// A small search controller exposing a visible loading flag plus a debounced query().
export function createSearch(data, { wait = 200, clock } = {}) {
  let state = { loading: false, results: data, query: '' };
  const run = debounce((q) => {
    state = { loading: false, results: filter(data, q), query: q };
  }, wait, clock);

  return {
    get state() {
      return state;
    },
    query(term) {
      // Show a loading state immediately; the actual filter runs after the window.
      state = { loading: true, results: state.results, query: term };
      run(term);
    },
  };
}
