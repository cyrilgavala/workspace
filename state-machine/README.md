# state-machine — guarded TS state machine + tiny test runner

States `idle | running | paused | done` with a guarded transition table. A guard can
veto a transition even when it is otherwise listed (demonstrated: a `locked` run cannot
be paused). `done` is terminal. The test runner is hand-rolled (no framework) and prints
`PASS`/`FAIL`, exiting non-zero on any failure.

## Verify
```bash
cd state-machine
npm install        # installs typescript (dev only)
npm run test       # compiles with tsc, then runs the runner
```

Expected: every case prints `PASS` and the process exits 0.
