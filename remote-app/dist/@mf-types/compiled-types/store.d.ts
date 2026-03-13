/**
 * Shared Store — exposed from remoteApp via Module Federation
 * A simple pub/sub event bus for cross-MFE data sharing
 */
type Listener = (value: unknown, prev: unknown) => void;
declare const store: {
    /** Set a value and notify all subscribers */
    set(key: string, value: unknown): void;
    /** Get current value */
    get(key: string): unknown;
    /** Subscribe to changes on a key */
    subscribe(key: string, callback: Listener): () => void;
    /** Get full state snapshot */
    getSnapshot(): Record<string, unknown>;
};
export default store;
