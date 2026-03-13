declare module 'remoteApp/Store' {
  export interface SharedStore {
    set(key: string, value: unknown): void;
    get(key: string): unknown;
    subscribe(key: string, callback: (value: unknown, prev: unknown) => void): () => void;
    getSnapshot(): Record<string, unknown>;
  }

  const store: SharedStore;
  export default store;
}
