import React from 'react';

interface MetricCardProps {
  label: string;
  value?: number; // e.g. 0.94
  percentage?: boolean;
  status: 'pending_integration' | 'available';
  description: string;
  formula?: string;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  percentage = true,
  status,
  description,
  formula,
  accentColor = 'var(--accent-violet-dark)'
}) => {
  return (
    <div
      className="card card-hover"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        padding: '1.35rem',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.75rem',
        minHeight: '145px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {label}
        </span>
        {formula && (
          <span
            title={`Mathematical Definition: ${formula}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-dim)',
              cursor: 'help',
              fontWeight: 600
            }}
          >
            {formula}
          </span>
        )}
      </div>

      <div>
        {status === 'available' && typeof value === 'number' ? (
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.1rem',
              fontWeight: 800,
              color: accentColor,
              lineHeight: 1,
              letterSpacing: '-0.02em'
            }}
          >
            {percentage ? `${(value * 100).toFixed(1)}%` : value}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--text-muted)'
              }}
            >
              --.-%
            </span>
            <span
              className="badge badge-neutral"
              style={{ fontSize: '0.65rem', textTransform: 'none', letterSpacing: 'normal' }}
            >
              Pending Benchmarking
            </span>
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
        {description}
      </div>
    </div>
  );
};
