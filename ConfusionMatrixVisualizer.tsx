import React from 'react';
import type { ConfusionMatrix } from '../../types';
import { Grid } from 'lucide-react';

interface ConfusionMatrixVisualizerProps {
  matrix?: ConfusionMatrix;
  status: 'pending_integration' | 'available';
}

export const ConfusionMatrixVisualizer: React.FC<ConfusionMatrixVisualizerProps> = ({
  matrix,
  status
}) => {
  const isAvailable = status === 'available' && !!matrix;

  return (
    <div
      className="card"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        padding: '1.6rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Grid size={18} style={{ color: 'var(--accent-violet)' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-navy-deep)' }}>
            Binary Classification Confusion Matrix
          </h3>
        </div>
        <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
          {isAvailable ? 'Empirical Benchmark Loaded' : 'Awaiting Benchmark Execution'}
        </span>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Evaluates classifier discernment across legitimate student announcements versus deceptive scam campaigns on the held-out test partition.
      </p>

      {/* Matrix Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '130px 1fr 1fr',
          gap: '0.75rem',
          maxWidth: '680px',
          margin: '0 auto',
          textAlign: 'center'
        }}
      >
        {/* Top Header Row */}
        <div />
        <div
          style={{
            fontSize: '0.76rem',
            fontWeight: 800,
            color: 'var(--risk-high)',
            textTransform: 'uppercase',
            padding: '0.5rem',
            letterSpacing: '0.04em'
          }}
        >
          Predicted Scam (Positive)
        </div>
        <div
          style={{
            fontSize: '0.76rem',
            fontWeight: 800,
            color: 'var(--risk-low)',
            textTransform: 'uppercase',
            padding: '0.5rem',
            letterSpacing: '0.04em'
          }}
        >
          Predicted Legitimate (Negative)
        </div>

        {/* Row 1: Actual Scam */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '0.75rem',
            fontSize: '0.76rem',
            fontWeight: 800,
            color: 'var(--risk-high)',
            textTransform: 'uppercase'
          }}
        >
          Actual Scam
        </div>

        {/* TP Cell */}
        <div
          style={{
            backgroundColor: 'rgba(225, 29, 72, 0.05)',
            border: '1.5px solid var(--risk-high-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            True Positives (TP)
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--risk-high)'
            }}
          >
            {isAvailable ? matrix.truePositives : '—'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            Scams correctly identified
          </span>
        </div>

        {/* FN Cell */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            False Negatives (FN)
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--text-muted)'
            }}
          >
            {isAvailable ? matrix.falseNegatives : '—'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            Scams missed (Type II Error)
          </span>
        </div>

        {/* Row 2: Actual Legitimate */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '0.75rem',
            fontSize: '0.76rem',
            fontWeight: 800,
            color: 'var(--risk-low)',
            textTransform: 'uppercase'
          }}
        >
          Actual Legitimate
        </div>

        {/* FP Cell */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            False Positives (FP)
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--text-muted)'
            }}
          >
            {isAvailable ? matrix.falsePositives : '—'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            Legitimate falsely flagged
          </span>
        </div>

        {/* TN Cell */}
        <div
          style={{
            backgroundColor: 'rgba(5, 150, 105, 0.05)',
            border: '1.5px solid var(--risk-low-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            True Negatives (TN)
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--risk-low)'
            }}
          >
            {isAvailable ? matrix.trueNegatives : '—'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            Legitimate verified correctly
          </span>
        </div>
      </div>
    </div>
  );
};
