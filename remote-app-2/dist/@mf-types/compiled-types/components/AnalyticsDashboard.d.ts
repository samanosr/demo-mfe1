import { type FC } from 'react';
export interface AnalyticsData {
    interactions: number;
    lastActive: string;
}
export interface MessageData {
    text: string;
    sender: string;
    timestamp: string;
}
interface AnalyticsDashboardProps {
    onSendMessage?: (data: MessageData) => void;
}
declare const AnalyticsDashboard: FC<AnalyticsDashboardProps>;
export default AnalyticsDashboard;
