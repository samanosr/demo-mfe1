import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  return (
    <div style={{ padding: '2rem', background: '#06060f', minHeight: '100vh' }}>
      <AnalyticsDashboard onSendMessage={(data) => console.log('[Remote Preview] Message Sent:', data)} />
    </div>
  );
}
