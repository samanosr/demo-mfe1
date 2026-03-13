import Counter from './components/Counter';
import Card from './components/Card';

const styles = {
  header: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.4rem 1rem',
    borderRadius: '100px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.12))',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#a5b4fc',
    marginBottom: '1.25rem',
    letterSpacing: '0.04em',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #f0f0f5, #8888a8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#8888a8',
    fontSize: '0.95rem',
    fontWeight: 400,
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '2rem',
    justifyContent: 'center',
    alignItems: 'flex-start',
    maxWidth: '900px',
    width: '100%',
  },
};

export default function App() {
  return (
    <>
      <div style={styles.header}>
        <span style={styles.pill}>📡 Remote App — Port 5001</span>
        <h1 style={styles.title}>Exposed Components</h1>
        <p style={styles.subtitle}>These components are federated to the Host shell</p>
      </div>
      <div style={styles.grid}>
        <Counter />
        <Card
          icon="⚡"
          label="Micro-Frontend"
          title="Module Federation"
          description="Components are built, deployed, and versioned independently — then shared at runtime across applications."
          tag="@module-federation/vite"
          variant="indigo"
        />
        <Card
          icon="🧩"
          label="Architecture"
          title="Shared Dependencies"
          description="React and React DOM are shared as singletons, ensuring one instance across all micro-frontends."
          tag="react ^19.0.0"
          variant="purple"
        />
      </div>
    </>
  );
}
