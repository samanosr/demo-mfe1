import { useState, useEffect, type FC } from 'react';

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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1.5rem',
    padding: '2.5rem',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  glowOrb: {
    position: 'absolute' as const,
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
    top: '-60px',
    right: '-60px',
    pointerEvents: 'none' as const,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.9rem',
    borderRadius: '100px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#a5b4fc',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#6366f1',
    animation: 'pulse 2s infinite',
  },
  propsDisplay: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.3rem',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    background: 'rgba(99, 102, 241, 0.06)',
    border: '1px solid rgba(99, 102, 241, 0.1)',
    width: '100%',
    fontSize: '0.72rem',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    color: '#8888a8',
  },
  propLabel: {
    color: '#a5b4fc',
    fontWeight: 600,
  },
  countDisplay: {
    fontSize: '4rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1,
    transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    userSelect: 'none' as const,
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.75rem',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.04)',
    color: '#f0f0f5',
    fontSize: '1.4rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
  },
  resetButton: {
    padding: '0.6rem 1.6rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: '#8888a8',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  },
};

const keyframes = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }
  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
`;

const Counter: FC<CounterProps> = ({ initialCount = 0, userName = 'Guest', onCountChange }) => {
  const [count, setCount] = useState<number>(initialCount);
  const [animKey, setAnimKey] = useState<number>(0);

  // 📥 Log props received FROM host
  useEffect(() => {
    console.log(
      '%c[Remote:Counter] 📥 RECEIVED PROPS FROM HOST',
      'color: #22d3ee; font-weight: bold; font-size: 12px',
    );
    console.log(
      '%c  → initialCount: %c%d',
      'color: #8888a8', 'color: #6366f1; font-weight: bold',
      initialCount,
    );
    console.log(
      '%c  → userName: %c%s',
      'color: #8888a8', 'color: #a855f7; font-weight: bold',
      userName,
    );
    console.log(
      '%c  → onCountChange: %c%s',
      'color: #8888a8', 'color: #ec4899; font-weight: bold',
      onCountChange ? 'Function ✓' : 'undefined ✗',
    );
  }, [initialCount, userName, onCountChange]);

  const handleChange = (delta: number): void => {
    const newCount = count + delta;
    setCount(newCount);
    setAnimKey((k) => k + 1);

    const payload: CountChangeData = {
      count: newCount,
      delta,
      userName,
      timestamp: new Date().toISOString(),
    };

    // 📤 Send data BACK to host via callback
    console.log(
      '%c[Remote:Counter] 📤 SENDING DATA TO HOST via onCountChange()',
      'color: #f97316; font-weight: bold; font-size: 12px',
    );
    console.log(
      '%c  → payload: %c%s',
      'color: #8888a8', 'color: #f97316; font-weight: bold',
      JSON.stringify(payload),
    );

    onCountChange?.(payload);
  };

  const handleReset = (): void => {
    setCount(0);
    setAnimKey((k) => k + 1);
    console.log(
      '%c[Remote:Counter] 🔄 RESET → sending count=0 to host',
      'color: #ef4444; font-weight: bold',
    );
    onCountChange?.({
      count: 0,
      delta: 0,
      userName,
      timestamp: new Date().toISOString(),
      action: 'reset',
    });
  };

  return (
    <>
      <style>{keyframes}</style>
      <div
        style={styles.container}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = 'rgba(99, 102, 241, 0.2)';
          el.style.boxShadow = '0 8px 40px rgba(99, 102, 241, 0.12)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = 'rgba(255, 255, 255, 0.06)';
          el.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }}
      >
        <div style={styles.glowOrb} />
        <span style={styles.badge}>
          <span style={styles.dot} />
          Remote Component
        </span>

        {/* Show received props visually */}
        <div style={styles.propsDisplay}>
          <div>
            <span style={styles.propLabel}>📥 props.userName: </span>
            {userName}
          </div>
          <div>
            <span style={styles.propLabel}>📥 props.initialCount: </span>
            {initialCount}
          </div>
        </div>

        <div
          key={animKey}
          style={{
            ...styles.countDisplay,
            animation: 'pop 0.2s ease-out',
          }}
        >
          {count}
        </div>

        <div style={styles.buttonGroup}>
          <button
            style={styles.button}
            onClick={() => handleChange(-1)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(236, 72, 153, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.3)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            −
          </button>
          <button
            style={styles.button}
            onClick={() => handleChange(1)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            +
          </button>
        </div>

        <button
          style={styles.resetButton}
          onClick={handleReset}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f0f0f5';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#8888a8';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default Counter;
