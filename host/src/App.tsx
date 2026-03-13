import React, { Suspense, useState, useEffect, useCallback, type FC } from 'react';
import type { CountChangeData } from 'remoteApp/Counter';
import type { CardActionData } from 'remoteApp/Card';

const RemoteCounter = React.lazy(() => import('remoteApp/Counter'));
const RemoteCard = React.lazy(() => import('remoteApp/Card'));
const RemoteAnalytics = React.lazy(() => import('remoteApp2/AnalyticsDashboard'));
const RemoteStoreModule = import('remoteApp/Store');

// === Types ===

interface LogEntry {
  id: number;
  time: string;
  direction: string;
  source: string;
  message: string;
  data: string;
}

// === Styles ===

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(20px)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    background: 'rgba(6, 6, 15, 0.8)',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
  },
  logoText: {
    fontSize: '0.95rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #f0f0f5, #a5b4fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.35rem 0.85rem',
    borderRadius: '100px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#4ade80',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)',
    animation: 'pulse 2s infinite',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '3rem 2rem',
  },
  hero: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
    maxWidth: '640px',
    animation: 'fadeInUp 0.6s ease-out',
  },
  heroPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.4rem 1rem',
    borderRadius: '100px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08))',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#a5b4fc',
    marginBottom: '1.5rem',
    letterSpacing: '0.04em',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    fontWeight: 900,
    lineHeight: 1.15,
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #ffffff, #a5b4fc, #c4b5fd)',
    backgroundSize: '200% 200%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'gradientShift 6s ease infinite',
  },
  heroSubtitle: {
    fontSize: '1.05rem',
    color: '#7777a0',
    lineHeight: 1.7,
    fontWeight: 400,
  },
  section: {
    width: '100%',
    maxWidth: '1000px',
    marginBottom: '3rem',
    animation: 'fadeInUp 0.6s ease-out',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  sectionLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)',
  },
  sectionLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#7777a0',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    whiteSpace: 'nowrap' as const,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  counterSection: {
    display: 'flex',
    justifyContent: 'center',
  },
  // --- Data Log Panel ---
  logPanel: {
    width: '100%',
    maxWidth: '1000px',
    marginBottom: '3rem',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    overflow: 'hidden' as const,
    animation: 'fadeInUp 0.6s ease-out',
  },
  logHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    background: 'rgba(255, 255, 255, 0.02)',
  },
  logTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#f0f0f5',
  },
  logClearBtn: {
    padding: '0.3rem 0.8rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(255, 255, 255, 0.04)',
    color: '#7777a0',
    fontSize: '0.7rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  logBody: {
    padding: '1rem 1.5rem',
    maxHeight: '300px',
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.72rem',
  },
  logEntry: {
    display: 'flex',
    gap: '0.75rem',
    padding: '0.6rem 0.8rem',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    alignItems: 'flex-start',
    lineHeight: 1.5,
    animation: 'fadeInUp 0.3s ease-out',
  },
  logTime: {
    color: '#555570',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
  logDirection: {
    fontWeight: 700,
    flexShrink: 0,
  },
  logMessage: {
    color: '#c4c4d8',
    wordBreak: 'break-all' as const,
  },
  logEmpty: {
    textAlign: 'center' as const,
    color: '#555570',
    padding: '2rem',
    fontSize: '0.8rem',
  },
  // --- Host State Panel ---
  statePanel: {
    width: '100%',
    maxWidth: '1000px',
    marginBottom: '3rem',
    borderRadius: '20px',
    background: 'rgba(34, 197, 94, 0.03)',
    border: '1px solid rgba(34, 197, 94, 0.1)',
    padding: '1.5rem',
    animation: 'fadeInUp 0.6s ease-out',
  },
  statePanelTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#4ade80',
    marginBottom: '1rem',
  },
  stateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.75rem',
  },
  stateItem: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  stateLabel: {
    fontSize: '0.65rem',
    color: '#7777a0',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.3rem',
  },
  stateValue: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#f0f0f5',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
  },
  // --- Loading / Error ---
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '3rem',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    minHeight: '200px',
    width: '100%',
  },
  spinner: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '3px solid rgba(99, 102, 241, 0.15)',
    borderTopColor: '#6366f1',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    fontSize: '0.8rem',
    color: '#7777a0',
    fontWeight: 500,
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
    padding: '3rem',
    borderRadius: '20px',
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    width: '100%',
    textAlign: 'center' as const,
  },
  errorTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fca5a5',
  },
  errorDesc: {
    fontSize: '0.85rem',
    color: '#7777a0',
    lineHeight: 1.6,
  },
  retryButton: {
    padding: '0.5rem 1.5rem',
    borderRadius: '10px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#fca5a5',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  footer: {
    textAlign: 'center' as const,
    padding: '2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    color: '#555570',
    fontSize: '0.75rem',
  },
};

const extraKeyframes = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

// === Sub-components ===

const LoadingFallback: FC<{ label: string }> = ({ label }) => (
  <div style={styles.loadingContainer}>
    <div style={styles.spinner} />
    <span style={styles.loadingText}>Loading {label}…</span>
  </div>
);

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorContainer}>
          <span style={{ fontSize: '2rem' }}>⚠️</span>
          <h3 style={styles.errorTitle}>Remote Component Error</h3>
          <p style={styles.errorDesc}>
            Check if the remote is running at the expected port.
          </p>
          <button
            style={styles.retryButton}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry Connection
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// === Main App ===

const App: FC = () => {
  // === HOST STATE (data from host → remote via props) ===
  const [userName] = useState<string>('Demo User');
  const [initialCount] = useState<number>(10);

  // === STATE RECEIVED BACK FROM REMOTE ===
  const [lastCountData, setLastCountData] = useState<CountChangeData | null>(null);
  const [lastCardAction, setLastCardAction] = useState<CardActionData | null>(null);
  const [lastRemoteMessage, setLastRemoteMessage] = useState<any>(null);

  // === DATA LOG ===
  const [dataLog, setDataLog] = useState<LogEntry[]>([]);

  const addLog = useCallback(
    (direction: string, source: string, message: string, data: unknown): void => {
      const entry: LogEntry = {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        direction,
        source,
        message,
        data: JSON.stringify(data),
      };
      setDataLog((prev) => [entry, ...prev].slice(0, 50));
    },
    [],
  );

  // === INIT: Load shared store and subscribe ===
  useEffect(() => {
    console.log(
      '%c[Host] 🚀 INITIALIZING — preparing data to send to remote components',
      'color: #22d3ee; font-weight: bold; font-size: 13px',
    );
    console.log(
      '%c  → userName: %c%s',
      'color: #8888a8',
      'color: #6366f1; font-weight: bold',
      userName,
    );
    console.log(
      '%c  → initialCount: %c%d',
      'color: #8888a8',
      'color: #a855f7; font-weight: bold',
      initialCount,
    );
    addLog('📤 SENT', 'Host', 'Sending props to Remote', { userName, initialCount });

    // Load shared store from remote
    RemoteStoreModule.then((mod) => {
      const store = mod.default;
      console.log(
        '%c[Host] 📡 SHARED STORE loaded from remoteApp/Store',
        'color: #4ade80; font-weight: bold; font-size: 12px',
      );

      // Host writes data to shared store
      store.set('hostInfo', {
        appName: 'MFE Host',
        version: '1.0.0',
        startedAt: new Date().toISOString(),
      });
      store.set('theme', 'dark');
      addLog('📤 SENT', 'Host → Store', 'Set hostInfo & theme in shared store', {
        theme: 'dark',
      });

      // Subscribe to store changes
      store.subscribe('counter', (value: unknown) => {
        console.log(
          '%c[Host] 📥 STORE UPDATE received: counter = %c%s',
          'color: #22d3ee; font-weight: bold',
          'color: #f97316; font-weight: bold',
          JSON.stringify(value),
        );
        addLog('📥 RECEIVED', 'Store → Host', 'counter updated in shared store', value);
      });
    }).catch(() => {
      console.log(
        '%c[Host] ⚠️ Could not load shared store',
        'color: #ef4444; font-weight: bold',
      );
    });
  }, []);

  // === CALLBACK: Counter sends data back ===
  const handleCountChange = useCallback(
    (data: CountChangeData): void => {
      console.log(
        '%c[Host] 📥 RECEIVED DATA FROM Remote:Counter',
        'color: #22d3ee; font-weight: bold; font-size: 12px',
      );
      console.log('%c  → data:', 'color: #8888a8', data);
      setLastCountData(data);
      addLog('📥 RECEIVED', 'Counter → Host', `Count changed to ${data.count}`, data);

      // Also write to shared store
      RemoteStoreModule.then((mod) => {
        mod.default.set('counter', { value: data.count, lastUpdated: data.timestamp });
      }).catch(() => {});
    },
    [addLog],
  );

  // === CALLBACK: Card sends data back ===
  const handleCardAction = useCallback(
    (data: CardActionData): void => {
      console.log(
        '%c[Host] 📥 RECEIVED ACTION FROM Remote:Card',
        'color: #22d3ee; font-weight: bold; font-size: 12px',
      );
      console.log('%c  → data:', 'color: #8888a8', data);
      setLastCardAction(data);
      addLog('📥 RECEIVED', 'Card → Host', `Explore clicked: "${data.title}"`, data);
    },
    [addLog],
  );

  // === CALLBACK: Remote 2 Dashboard sends data back ===
  const handleRemoteMessage = useCallback(
    (data: any): void => {
      console.log(
        '%c[Host] 📥 MESSAGE FROM Remote:AnalyticsDashboard',
        'color: #fbbf24; font-weight: bold; font-size: 12px',
      );
      setLastRemoteMessage(data);
      addLog('📥 RECEIVED', 'Analytics → Host', `Message: "${data.text}"`, data);
    },
    [addLog],
  );

  return (
    <>
      <style>{extraKeyframes}</style>
      <div style={styles.app}>
        {/* NAV */}
        <nav style={styles.nav}>
          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>⚡</div>
            <span style={styles.logoText}>MFE Host</span>
          </div>
          <div style={{ ...styles.statusPill, background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>
             <div style={{ ...styles.statusDot, background: '#fbbf24', boxShadow: '0 0 8px rgba(251, 191, 36, 0.5)' }} />
             Sync Active
          </div>
        </nav>

        {/* MAIN */}
        <main style={styles.main}>
          {/* HERO */}
          <div style={styles.hero}>
            <span style={styles.heroPill}>
              🔄 Data Sharing Demo — React 19 + Vite Federation + TypeScript
            </span>
            <h1 style={styles.heroTitle}>
              Cross-MFE
              <br />
              Data Sharing
            </h1>
            <p style={styles.heroSubtitle}>
              Watch data flow between <strong style={{ color: '#6366f1' }}>Host</strong> and{' '}
              <strong style={{ color: '#a855f7' }}>Remote</strong> apps in real-time. Open{' '}
              <strong style={{ color: '#4ade80' }}>DevTools Console</strong> to see detailed logs.
            </p>
          </div>

          {/* HOST STATE PANEL */}
          <div style={styles.statePanel}>
            <div style={styles.statePanelTitle}>
              🏠 Host State (sent to Remote as props)
            </div>
            <div style={styles.stateGrid}>
              <div style={styles.stateItem}>
                <div style={styles.stateLabel}>userName (→ Counter)</div>
                <div style={styles.stateValue}>{userName}</div>
              </div>
              <div style={styles.stateItem}>
                <div style={styles.stateLabel}>initialCount (→ Counter)</div>
                <div style={styles.stateValue}>{initialCount}</div>
              </div>
              <div style={styles.stateItem}>
                <div style={styles.stateLabel}>Last Count from Remote</div>
                <div
                  style={{
                    ...styles.stateValue,
                    color: lastCountData ? '#6366f1' : '#555570',
                  }}
                >
                  {lastCountData ? lastCountData.count : '—'}
                </div>
              </div>
              <div style={styles.stateItem}>
                <div style={styles.stateLabel}>Last Card Action</div>
                <div
                  style={{
                    ...styles.stateValue,
                    color: lastCardAction ? '#a855f7' : '#555570',
                    fontSize: '0.85rem',
                  }}
                >
                  {lastCardAction ? `"${lastCardAction.title}"` : '—'}
                </div>
              </div>
              <div style={styles.stateItem}>
                <div style={styles.stateLabel}>Last Remote Command</div>
                <div
                  style={{
                    ...styles.stateValue,
                    color: lastRemoteMessage ? '#fbbf24' : '#555570',
                    fontSize: '0.85rem',
                  }}
                >
                  {lastRemoteMessage ? `"${lastRemoteMessage.text}"` : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* DASHBOARD GRID (Side by Side) */}
          <div style={{ ...styles.grid, gridTemplateColumns: '1fr 1fr', marginBottom: '4rem' }}>
            {/* COLUMN 1: REMOTE APP 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionLabel}>🕹️ Remote App 1: Interactivity</span>
                <div style={styles.sectionLine} />
              </div>
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback label="Counter" />}>
                  <RemoteCounter
                    initialCount={initialCount}
                    userName={userName}
                    onCountChange={handleCountChange}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* COLUMN 2: REMOTE APP 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionLabel}>📊 Remote App 2: Analytics & Msg</span>
                <div style={styles.sectionLine} />
              </div>
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback label="Analytics Dashboard" />}>
                  <RemoteAnalytics 
                    onSendMessage={handleRemoteMessage}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>

          {/* CARDS SECTION */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionLabel}>
                🧩 Remote → Host (onAction callback)
              </span>
              <div style={styles.sectionLine} />
            </div>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback label="Cards" />}>
                <div style={styles.grid}>
                  <RemoteCard
                    icon="🚀"
                    label="Runtime Sharing"
                    title="Zero Build-Time Coupling"
                    description="Click 'Explore' and check the console — the card sends data back to the host via callback."
                    tag="federation"
                    variant="indigo"
                    onAction={handleCardAction}
                  />
                  <RemoteCard
                    icon="🎨"
                    label="Independent Deploy"
                    title="Ship Components Separately"
                    description="Click 'Explore' — data flows from this remote component back to the host app instantly."
                    tag="devops"
                    variant="purple"
                    onAction={handleCardAction}
                  />
                  <RemoteCard
                    icon="🔒"
                    label="Shared Store"
                    title="Shared Event Bus"
                    description="Both host and remote can read/write the shared store. Counter updates are synced via the store module."
                    tag="store"
                    variant="pink"
                    onAction={handleCardAction}
                  />
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* DATA LOG PANEL */}
          <div style={styles.logPanel}>
            <div style={styles.logHeader}>
              <div style={styles.logTitle}>
                📋 Data Flow Log (see console for detailed output)
              </div>
              <button
                style={styles.logClearBtn}
                onClick={() => setDataLog([])}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f0f0f5';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#7777a0';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                Clear
              </button>
            </div>
            <div style={styles.logBody}>
              {dataLog.length === 0 ? (
                <div style={styles.logEmpty}>
                  No data exchanges yet. Click the counter buttons or card "Explore" to see
                  data flow.
                </div>
              ) : (
                dataLog.map((entry) => (
                  <div key={entry.id} style={styles.logEntry}>
                    <span style={styles.logTime}>{entry.time}</span>
                    <span
                      style={{
                        ...styles.logDirection,
                        color: entry.direction.includes('SENT') ? '#f97316' : '#22d3ee',
                      }}
                    >
                      {entry.direction}
                    </span>
                    <span style={styles.logMessage}>
                      <strong style={{ color: '#a5b4fc' }}>[{entry.source}]</strong>{' '}
                      {entry.message}{' '}
                      <span style={{ color: '#555570' }}>{entry.data}</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer style={styles.footer}>
          Module Federation Demo · React {React.version} · TypeScript · Built with Vite · Open
          DevTools Console 🔍
        </footer>
      </div>
    </>
  );
};

export default App;
