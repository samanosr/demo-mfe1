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

const styles = {
  card: {
    position: 'relative' as const,
    padding: '2rem',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden' as const,
    maxWidth: '380px',
    width: '100%',
  },
  shimmer: {
    position: 'absolute' as const,
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
    transition: 'left 0.6s ease',
    pointerEvents: 'none' as const,
  },
  iconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    marginBottom: '1.25rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.3rem 0.75rem',
    borderRadius: '100px',
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#f0f0f5',
    marginBottom: '0.6rem',
    lineHeight: 1.3,
  },
  description: {
    fontSize: '0.875rem',
    color: '#8888a8',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  },
  tag: {
    padding: '0.3rem 0.7rem',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    fontSize: '0.75rem',
    color: '#8888a8',
    fontWeight: 500,
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.45rem 1rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
    color: '#a5b4fc',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

interface VariantStyle {
  iconBg: string;
  iconBorder: string;
  badgeBg: string;
  badgeBorder: string;
  badgeColor: string;
  hoverBorder: string;
  hoverShadow: string;
}

const variants: Record<string, VariantStyle> = {
  indigo: {
    iconBg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.08))',
    iconBorder: '1px solid rgba(99, 102, 241, 0.2)',
    badgeBg: 'rgba(99, 102, 241, 0.1)',
    badgeBorder: '1px solid rgba(99, 102, 241, 0.2)',
    badgeColor: '#a5b4fc',
    hoverBorder: 'rgba(99, 102, 241, 0.2)',
    hoverShadow: '0 8px 40px rgba(99, 102, 241, 0.1)',
  },
  purple: {
    iconBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.08))',
    iconBorder: '1px solid rgba(168, 85, 247, 0.2)',
    badgeBg: 'rgba(168, 85, 247, 0.1)',
    badgeBorder: '1px solid rgba(168, 85, 247, 0.2)',
    badgeColor: '#c4b5fd',
    hoverBorder: 'rgba(168, 85, 247, 0.2)',
    hoverShadow: '0 8px 40px rgba(168, 85, 247, 0.1)',
  },
  pink: {
    iconBg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.08))',
    iconBorder: '1px solid rgba(236, 72, 153, 0.2)',
    badgeBg: 'rgba(236, 72, 153, 0.1)',
    badgeBorder: '1px solid rgba(236, 72, 153, 0.2)',
    badgeColor: '#f9a8d4',
    hoverBorder: 'rgba(236, 72, 153, 0.2)',
    hoverShadow: '0 8px 40px rgba(236, 72, 153, 0.1)',
  },
};

const Card: FC<CardProps> = ({
  icon = '✦',
  label = 'Component',
  title = 'Feature Card',
  description = 'A beautifully crafted component shared across micro-frontends via Module Federation.',
  tag = 'remote',
  variant = 'indigo',
  onAction,
}) => {
  const v = variants[variant] || variants.indigo;

  const handleExplore = (): void => {
    const payload: CardActionData = {
      title,
      tag,
      variant,
      timestamp: new Date().toISOString(),
    };
    console.log(
      '%c[Remote:Card] 📤 SENDING ACTION TO HOST via onAction()',
      'color: #f97316; font-weight: bold; font-size: 12px',
    );
    console.log(
      '%c  → payload: %c%s',
      'color: #8888a8', 'color: #f97316; font-weight: bold',
      JSON.stringify(payload),
    );
    onAction?.(payload);
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = v.hoverBorder;
        el.style.boxShadow = v.hoverShadow;
        el.style.transform = 'translateY(-4px)';
        (el.querySelector('[data-shimmer]') as HTMLElement).style.left = '100%';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(255, 255, 255, 0.06)';
        el.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        el.style.transform = 'translateY(0)';
        (el.querySelector('[data-shimmer]') as HTMLElement).style.left = '-100%';
      }}
    >
      <div data-shimmer style={styles.shimmer} />
      <div
        style={{
          ...styles.iconContainer,
          background: v.iconBg,
          border: v.iconBorder,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          ...styles.badge,
          background: v.badgeBg,
          border: v.badgeBorder,
          color: v.badgeColor,
        }}
      >
        {label}
      </span>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.description}>{description}</p>
      <div style={styles.footer}>
        <span style={styles.tag}>{tag}</span>
        <button
          style={styles.action}
          onClick={handleExplore}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Explore →
        </button>
      </div>
    </div>
  );
};

export default Card;
