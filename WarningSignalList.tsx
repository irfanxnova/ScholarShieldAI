import React from 'react';
import type { WarningSignal } from '../../types';
import { EvidenceCard } from './EvidenceCard';
import { ShieldCheck, Filter } from 'lucide-react';

interface WarningSignalListProps {
  signals: WarningSignal[];
}

export const WarningSignalList: React.FC<WarningSignalListProps> = ({ signals }) => {
  if (!signals || signals.length === 0) {
    return (
      <div
        className="card"
        style={{
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          border: '1px dashed var(--border-medium)',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--risk-low-subtle)',
            color: 'var(--risk-low)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}
        >
          <ShieldCheck size={24} />
        </div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-navy-deep)' }}>
          No Critical Warning Signals Detected
        </h4>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
          The submitted text does not contain typical lexical patterns associated with scholarship fees, credential harvesting, or coercion.
        </p>
      </div>
    );
  }

  const criticalCount = signals.filter(s => s.severity === 'critical' || s.severity === 'high').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-navy-deep)' }}>
            Detected Warning Signals
          </h3>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--surface-highlight)',
              color: 'var(--text-navy-deep)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {signals.length} {signals.length === 1 ? 'Indicator' : 'Indicators'}
          </span>
        </div>

        {criticalCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--risk-high)' }}>
            <Filter size={14} />
            <span>{criticalCount} Elevated / Critical</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {signals.map((signal) => (
          <EvidenceCard key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  );
};
