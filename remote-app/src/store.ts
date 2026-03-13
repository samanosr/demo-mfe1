/**
 * Shared Store — exposed from remoteApp via Module Federation
 * A simple pub/sub event bus for cross-MFE data sharing
 */

type Listener = (value: unknown, prev: unknown) => void;

const listeners = new Map<string, Set<Listener>>();
const state: Record<string, unknown> = {};

const store = {
  /** Set a value and notify all subscribers */
  set(key: string, value: unknown): void {
    const prev = state[key];
    state[key] = value;
    console.log(
      `%c[SharedStore] SET %c${key}%c: ${JSON.stringify(prev)} → ${JSON.stringify(value)}`,
      'color: #a855f7; font-weight: bold',
      'color: #6366f1; font-weight: bold',
      'color: #8888a8',
    );
    const subs = listeners.get(key);
    if (subs) subs.forEach((fn) => fn(value, prev));
  },

  /** Get current value */
  get(key: string): unknown {
    console.log(
      `%c[SharedStore] GET %c${key}%c → ${JSON.stringify(state[key])}`,
      'color: #a855f7; font-weight: bold',
      'color: #6366f1; font-weight: bold',
      'color: #8888a8',
    );
    return state[key];
  },

  /** Subscribe to changes on a key */
  subscribe(key: string, callback: Listener): () => void {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(callback);
    console.log(
      `%c[SharedStore] SUBSCRIBE %c${key}%c (${listeners.get(key)!.size} listeners)`,
      'color: #ec4899; font-weight: bold',
      'color: #6366f1; font-weight: bold',
      'color: #8888a8',
    );
    return () => {
      listeners.get(key)?.delete(callback);
      console.log(
        `%c[SharedStore] UNSUBSCRIBE %c${key}`,
        'color: #ef4444; font-weight: bold',
        'color: #6366f1; font-weight: bold',
      );
    };
  },

  /** Get full state snapshot */
  getSnapshot(): Record<string, unknown> {
    console.log(
      '%c[SharedStore] SNAPSHOT%c',
      'color: #a855f7; font-weight: bold',
      'color: #8888a8',
      { ...state },
    );
    return { ...state };
  },
};

export default store;
