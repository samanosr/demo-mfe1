/// <reference types="vite/client" />

declare module 'remoteApp/Counter' {
  import type { FC } from 'react';

  export interface CountChangeData {
    count: number;
    delta: number;
    userName: string;
    timestamp: string;
    action?: string;
  }

  export interface CounterProps {
    initialCount?: number;
    userName?: string;
    onCountChange?: (data: CountChangeData) => void;
  }

  const Counter: FC<CounterProps>;
  export default Counter;
}

declare module 'remoteApp/Card' {
  import type { FC } from 'react';

  export interface CardActionData {
    title: string;
    tag: string;
    variant: string;
    timestamp: string;
  }

  export interface CardProps {
    icon?: string;
    label?: string;
    title?: string;
    description?: string;
    tag?: string;
    variant?: 'indigo' | 'purple' | 'pink';
    onAction?: (data: CardActionData) => void;
  }

  const Card: FC<CardProps>;
  export default Card;
}

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
declare module 'remoteApp2/AnalyticsDashboard' {
  import type { FC } from 'react';

  export interface MessageData {
    text: string;
    sender: string;
    timestamp: string;
  }

  export interface AnalyticsDashboardProps {
    onSendMessage?: (data: MessageData) => void;
  }

  const AnalyticsDashboard: FC<AnalyticsDashboardProps>;
  export default AnalyticsDashboard;
}
