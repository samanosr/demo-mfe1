import { useState, useEffect, useCallback, type FC } from 'react';

// === Interfaces ===
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

const styles = {
  container: {
    padding: '2rem',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(16px)',
    width: '100%',
    color: '#f0f0f5',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    padding: '1.5rem',
    borderRadius: '16px',
    background: 'rgba(251, 191, 36, 0.05)',
    border: '1px solid rgba(251, 191, 36, 0.1)',
    transition: 'transform 0.2s ease',
  },
  label: {
    fontSize: '0.7rem',
    color: '#7777a0',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  value: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#ffffff',
  },
  inputArea: {
    padding: '1.5rem',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  inputLabel: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#a5b4fc',
    marginBottom: '1rem',
  },
  flex: {
    display: 'flex',
    gap: '0.75rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    color: '#06060f',
    border: 'none',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  status: {
    marginTop: '1.5rem',
    fontSize: '0.7rem',
    color: '#555570',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }
};

const AnalyticsDashboard: FC<AnalyticsDashboardProps> = ({ onSendMessage }) => {
  const [interactions, setInteractions] = useState(0);
  const [lastSync, setLastSync] = useState('Never');
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('%c[Remote 2] 📊 INITIALIZING AnalyticsDashboard', 'color: #fbbf24; font-weight: bold');
    
    // Subscribe to shared store from Remote 1
    let unsubscribe: (() => void) | undefined;
    
    import('remoteApp/Store').then((mod) => {
      const store = mod.default;
      unsubscribe = store.subscribe('counter', (val: any) => {
        if (val && typeof val.value === 'number') {
          console.log('%c[Remote 2] 📥 SYNC: counter incremented in Remote 1', 'color: #fbbf24');
          setInteractions(prev => prev + 1);
          setLastSync(new Date().toLocaleTimeString());
        }
      });
    }).catch(err => console.error('[Remote 2] Store load failed', err));

    return () => unsubscribe?.();
  }, []);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;
    
    console.log('%c[Remote 2] 📤 SENDING MESSAGE to Host', 'color: #fbbf24');
    
    const payload: MessageData = {
      text: message,
      sender: 'Analytics App',
      timestamp: new Date().toISOString(),
    };

    onSendMessage?.(payload);
    setMessage('');
  }, [message, onSendMessage]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span>📊</span> Analytics Dashboard
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.label}>Cross-App Events</div>
          <div style={styles.value}>{interactions}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.label}>Last Remote Sync</div>
          <div style={{ ...styles.value, fontSize: '1rem' }}>{lastSync}</div>
        </div>
      </div>

      <div style={styles.inputArea}>
        <label style={styles.inputLabel}>💬 Send Command / Message to Host</label>
        <div style={styles.flex}>
          <input 
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            style={styles.button}
            onClick={handleSend}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Send
          </button>
        </div>
      </div>

      <div style={styles.status}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24' }} />
        Synchronized with SharedStore via Module Federation
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
