export type State = 'idle' | 'running' | 'paused' | 'done';
export type Event = 'start' | 'pause' | 'resume' | 'complete';

export interface MachineContext {
  state: State;
  locked: boolean; // example guard input
}

// A guard may veto a transition even when it is otherwise listed in the table.
type Guard = (ctx: MachineContext) => boolean;

interface Transition {
  to: State;
  guard?: Guard;
}

// Guarded transition table. `done` is terminal (no outgoing entries).
const TABLE: Record<State, Partial<Record<Event, Transition>>> = {
  idle: {
    start: { to: 'running' },
  },
  running: {
    // A locked run cannot be paused — the guard blocks this even though it is listed.
    pause: { to: 'paused', guard: (c) => !c.locked },
    complete: { to: 'done' },
  },
  paused: {
    resume: { to: 'running' },
    complete: { to: 'done' },
  },
  done: {},
};

export class Machine {
  state: State;
  locked = false;

  constructor(initial: State = 'idle') {
    this.state = initial;
  }

  // Returns the next state, or throws on an illegal or guard-blocked transition.
  send(event: Event): State {
    const next = TABLE[this.state]?.[event];
    if (!next) throw new Error(`illegal: ${event} from ${this.state}`);
    if (next.guard && !next.guard({ state: this.state, locked: this.locked })) {
      throw new Error(`blocked: ${event} from ${this.state} (guard)`);
    }
    this.state = next.to;
    return this.state;
  }
}
