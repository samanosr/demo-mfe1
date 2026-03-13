import { useState, useEffect, type FC } from 'react';

// === Interfaces (to be shared) ===
export interface UserStatsData {
  interactions: number;
  lastActive: string;
  source: string;
}

const styles = {
  container: {
    padding: '1.5rem',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
    width: '100%',
    maxWidth: '350px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#fbbf24',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  statCard: {
    padding: '1rem',
    borderRadius: '12px',
    background: 'rgba(251, 191, 36, 0.05)',
    border: '1px solid rgba(251, 191, 36, 0.1)',
    textAlign: 'center' as const,
  },
  label: {
    fontSize: '0.65rem',
    color: '#7777a0',
    textTransform: 'uppercase' as const,
    marginBottom: '0.2rem',
  },
  value: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#f0f0f5',
  },
  syncTab: {
    marginTop: '1rem',
    padding: '0.6rem',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.03)',
    fontSize: '0.7rem',
    color: '#8888a8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
};

const UserStats: FC = () => {
  const [interactions, setInteractions] = useState(0);
  const [lastSync, setLastSync] = useState('Never');

  useEffect(() => {
    console.log('%c[Remote:UserStats] 🔌 CONNECTING to SharedStore from remoteApp', 'color: #fbbf24; font-weight: bold');
    
    // Dynamically import the store from the other remote!
    import('remoteApp/Store').then((mod) => {
      const store = mod.default;
      
      // Subscribe to the counter update from the OTHER remote
      const unsubscribe = store.subscribe('counter', (val: any) => {
        if (val && typeof val.value === 'number') {
          console.log('%c[Remote:UserStats] 📥 CROSS-REMOTE SYNC: counter updated', 'color: #fbbf24');
          setInteractions(prev => prev + 1);
          setLastSync(new Date().toLocaleTimeString());
        }
      });
      
      return unsubscribe;
    }).catch(() => {
      console.warn('[Remote:UserStats] SharedStore from remoteApp not available');
    });
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        📊 Multi-App Global Activity
      </div>
      <div style={styles.statGrid}>
        <div style={styles.statCard}>
          <div style={styles.label}>Cross-App Events</div>
          <div style={styles.value}>{interactions}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.label}>Active Remotes</div>
          <div style={styles.value}>2</div>
        </div>
      </div>
      <div style={styles.syncTab}>
        🔄 Syncing via SharedStore • Last: {lastSync}
      </div>
    </div>
  );
};

export default UserStats;
