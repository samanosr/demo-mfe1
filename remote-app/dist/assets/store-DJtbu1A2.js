const listeners = /* @__PURE__ */ new Map();
const state = {};
const store = {
  /** Set a value and notify all subscribers */
  set(key, value) {
    const prev = state[key];
    state[key] = value;
    console.log(
      `%c[SharedStore] SET %c${key}%c: ${JSON.stringify(prev)} → ${JSON.stringify(value)}`,
      "color: #a855f7; font-weight: bold",
      "color: #6366f1; font-weight: bold",
      "color: #8888a8"
    );
    const subs = listeners.get(key);
    if (subs) subs.forEach((fn) => fn(value, prev));
  },
  /** Get current value */
  get(key) {
    console.log(
      `%c[SharedStore] GET %c${key}%c → ${JSON.stringify(state[key])}`,
      "color: #a855f7; font-weight: bold",
      "color: #6366f1; font-weight: bold",
      "color: #8888a8"
    );
    return state[key];
  },
  /** Subscribe to changes on a key */
  subscribe(key, callback) {
    if (!listeners.has(key)) listeners.set(key, /* @__PURE__ */ new Set());
    listeners.get(key).add(callback);
    console.log(
      `%c[SharedStore] SUBSCRIBE %c${key}%c (${listeners.get(key).size} listeners)`,
      "color: #ec4899; font-weight: bold",
      "color: #6366f1; font-weight: bold",
      "color: #8888a8"
    );
    return () => {
      listeners.get(key)?.delete(callback);
      console.log(
        `%c[SharedStore] UNSUBSCRIBE %c${key}`,
        "color: #ef4444; font-weight: bold",
        "color: #6366f1; font-weight: bold"
      );
    };
  },
  /** Get full state snapshot */
  getSnapshot() {
    console.log(
      "%c[SharedStore] SNAPSHOT%c",
      "color: #a855f7; font-weight: bold",
      "color: #8888a8",
      { ...state }
    );
    return { ...state };
  }
};

export { store as default };
