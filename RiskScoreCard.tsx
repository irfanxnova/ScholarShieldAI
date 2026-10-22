import React from 'react';
import type { AnalysisResult } from '../../types';
import { ScoreGauge } from '../common/ScoreGauge';
import { RiskBadge } from '../common/RiskBadge';
import { Info, Sparkles } from 'lucide-react';

interface RiskScoreCardProps {
  result: AnalysisResult;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ result }) => {
  const { overallScore, riskLevel, summary, isMockPreview, limitations } = result;

  const cardBorder = {
    LOW: 'var(--risk-low-border)',
    MEDIUM: 'var(--risk-medium-border)',
    HIGH: 'var(--risk-high-border)'
  }[riskLevel];

  const topBarGradient = {
    HIGH: 'linear-gradient(90deg, #E11D48 0%, #F43F5E 100%)',
    MEDIUM: 'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)',
    LOW: 'linear-gradient(90deg, #059669 0%, #10B981 100%)'
  }[riskLevel];

  return (
    <div
      className="card"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: cardBorder,
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      {/* Subtle top glow bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: topBarGradient
        }}
      />

      {isMockPreview ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.8rem',
            marginBottom: '1.25rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--accent-gold-subtle)',
            border: '1px solid var(--accent-gold-border)',
            fontSize: '0.78rem',
            color: 'var(--accent-gold-hover)'
          }}
        >
          <Sparkles size={14} />
          <span>
            <strong>Architectural Preview:</strong> Demonstrating explainable components.
          </span>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.8rem',
            marginBottom: '1.25rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(6, 182, 212, 0.06)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            fontSize: '0.78rem',
            color: 'var(--accent-cyan)'
          }}
        >
          <Sparkles size={14} />
          <span>
            <strong>Deterministic Detection Engine:</strong> Real-time heuristic evaluation across 6 threat dimensions.
          </span>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.75rem',
          alignItems: 'center'
        }}
      >
        {/* Left Column: Radial Score Gauge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1px solid var(--border-subtle)',
            paddingRight: '1rem'
          }}
        >
          <ScoreGauge score={overallScore} riskLevel={riskLevel} size={170} />
          <div
            style={{
              marginTop: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <RiskBadge level={riskLevel} size="md" />
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'var(--surface-highlight)',
                padding: '0.15rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontWeight: 600
              }}
              title="Coverage of evaluated threat rules"
            >
              Evaluated: {result.evaluatedRuleCount || 20} Rules
            </span>
          </div>
        </div>

        {/* Right Column: Evidence Summary & Analysis Synthesis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}
            >
              Executive Risk Synthesis
            </span>
            <h3
              style={{
                fontSize: '1.25rem',
                color: 'var(--text-navy-deep)',
                marginTop: '0.2rem',
                lineHeight: 1.35
              }}
            >
              {riskLevel === 'HIGH' && 'Elevated Probability of Malicious Intent or Fraud'}
              {riskLevel === 'MEDIUM' && 'Suspicious Indicators Requiring Independent Verification'}
              {riskLevel === 'LOW' && 'Low Immediate Risk Indicators Detected'}
            </h3>
          </div>

          <p
            style={{
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              backgroundColor: '#F8FAFC',
              padding: '0.95rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {summary}
          </p>

          {/* Analysis Scope Limitations */}
          {limitations && limitations.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Analytical Limitations:
              </span>
              <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
                {limitations.map((lim, idx) => (
                  <li key={idx} style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    {lim}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal / Academic Disclaimer */}
          <div
            style={{
              display: 'flex',
              gap: '0.55rem',
              alignItems: 'flex-start',
              fontSize: '0.76rem',
              color: 'var(--text-muted)',
              lineHeight: 1.45
            }}
          >
            <Info size={15} style={{ flexShrink: 0, marginTop: '0.12rem', color: 'var(--accent-cyan)' }} />
            <span>
              <strong>Crucial Notice:</strong> This risk score is an explainable heuristic signal for academic investigation, not definitive judicial proof of fraud. Genuine institutional notices can occasionally trigger warning flags. Always conduct safe out-of-band verification.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
