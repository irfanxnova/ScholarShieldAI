import React from 'react';
import type { WarningSignal } from '../../types';
import { HelpCircle, ArrowRight, ShieldAlert } from 'lucide-react';

interface EvidenceCardProps {
  signal: WarningSignal;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ signal }) => {
  const severityColors = {
    critical: {
      border: 'rgba(225, 29, 72, 0.35)',
      bg: 'rgba(225, 29, 72, 0.04)',
      badge: 'badge-high',
      tag: 'Critical Threat',
      accent: 'var(--risk-high)'
    },
    high: {
      border: 'rgba(225, 29, 72, 0.28)',
      bg: 'rgba(225, 29, 72, 0.03)',
      badge: 'badge-high',
      tag: 'High Risk',
      accent: 'var(--risk-high)'
    },
    medium: {
      border: 'rgba(217, 119, 6, 0.28)',
      bg: 'rgba(217, 119, 6, 0.03)',
      badge: 'badge-medium',
      tag: 'Moderate Caution',
      accent: 'var(--risk-medium)'
    },
    low: {
      border: 'rgba(5, 150, 105, 0.28)',
      bg: 'rgba(5, 150, 105, 0.03)',
      badge: 'badge-low',
      tag: 'Low Advisory',
      accent: 'var(--risk-low)'
    }
  }[signal.severity];

  const categoryLabels: Record<string, string> = {
    financial_fee: 'Advance Fee Fraud',
    urgency_coercion: 'Psychological Urgency',
    credential_theft: 'Credential Harvesting',
    unverifiable_sender: 'Unverified Entity',
    guaranteed_placement: 'Unrealistic Guarantee',
    suspicious_channel: 'Off-Platform Routing',
    inconsistent_branding: 'Brand Mismatch'
  };

  return (
    <div
      className="card card-hover"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: severityColors.border,
        padding: '1.35rem',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Header with Title, Severity and Score Contribution */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: severityColors.bg,
              color: severityColors.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShieldAlert size={19} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.02rem', color: 'var(--text-navy-deep)', marginBottom: '0.15rem' }}>
              {signal.title}
            </h4>
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {categoryLabels[signal.category] || signal.category}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`badge ${severityColors.badge}`}>
            {severityColors.tag}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-violet-subtle)',
              color: 'var(--accent-violet-dark)',
              border: '1px solid var(--accent-violet-border)'
            }}
            title="Contribution to overall risk score"
          >
            +{signal.scoreContribution} pts
          </span>
        </div>
      </div>

      {/* Why it Matters (Explanation) */}
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
        <HelpCircle size={16} style={{ color: 'var(--accent-cyan)', marginTop: '0.18rem', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            Why This Warning Signal Matters
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {signal.explanation}
          </p>
        </div>
      </div>

      {/* Matched Evidence Snippet from Raw Input */}
      {signal.evidence && (
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 0.95rem',
            borderLeft: `3px solid ${severityColors.accent}`
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.25rem'
            }}
          >
            Detected Text Evidence:
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              color: 'var(--text-navy-deep)',
              lineHeight: 1.5,
              wordBreak: 'break-word'
            }}
          >
            "{signal.evidence}"
          </div>
        </div>
      )}

      {/* Recommended Action */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'flex-start',
          backgroundColor: 'rgba(5, 150, 105, 0.05)',
          border: '1px solid rgba(5, 150, 105, 0.22)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.65rem 0.85rem'
        }}
      >
        <ArrowRight size={15} style={{ color: 'var(--risk-low)', marginTop: '0.15rem', flexShrink: 0 }} />
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--risk-low)' }}>Student Action: </strong>
          {signal.recommendedAction}
        </div>
      </div>
    </div>
  );
};
