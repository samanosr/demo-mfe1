import type { FC } from 'react';
export interface CardActionData {
    title: string;
    tag: string;
    variant: string;
    timestamp: string;
}
interface CardProps {
    icon?: string;
    label?: string;
    title?: string;
    description?: string;
    tag?: string;
    variant?: 'indigo' | 'purple' | 'pink';
    onAction?: (data: CardActionData) => void;
}
declare const Card: FC<CardProps>;
export default Card;
