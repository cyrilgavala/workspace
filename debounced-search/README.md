# debounced-search — debounced search filter (vanilla, framework-agnostic)

Filters a JSON dataset by name/keyword with a debounce window and a visible `loading`
state. No framework: the `debounce` utility takes an injectable clock so its timing is
testable without real timers.

## Files
- `src/debounce.js` — `debounce(fn, wait, clock?)`; injectable timer.
- `src/search.js` — `createSearch(data)` → controller with `{ loading, results, query }` and `query(term)`.
- `data.json` — sample dataset.
- `test/debounce.test.js` — `node:test` + `node:assert`, driven by a fake clock.

## Verify
```bash
cd debounced-search
npm test          # runs `node --test`
```
