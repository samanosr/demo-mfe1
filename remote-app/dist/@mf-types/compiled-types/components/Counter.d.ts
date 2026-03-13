import { type FC } from 'react';
export interface CountChangeData {
    count: number;
    delta: number;
    userName: string;
    timestamp: string;
    action?: string;
}
interface CounterProps {
    initialCount?: number;
    userName?: string;
    onCountChange?: (data: CountChangeData) => void;
}
declare const Counter: FC<CounterProps>;
export default Counter;
