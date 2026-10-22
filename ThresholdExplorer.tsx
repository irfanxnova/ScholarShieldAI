import React, { useMemo } from 'react';
import type { BenchmarkSample } from '../../types';
import { evaluateDataset } from '../../lib/evaluateDataset';
import { Sliders, ShieldAlert, Award } from 'lucide-react';

interface ThresholdExplorerProps {
  dataset: BenchmarkSample[];
  split: 'test' | 'development' | 'all';
}

export const ThresholdExplorer: React.FC<ThresholdExplorerProps> = ({ dataset, split }) => {
  // Compute comparison between standard mapping (Medium+High >= 30) vs strict mapping (High only >= 70)
  const standardReport = useMemo(() => {
    return evaluateDataset(dataset, {
      split,
      predictionMapping: 'medium_or_high'
    });
  }, [dataset, split]);

  const strictReport = useMemo(() => {
    return evaluateDataset(dataset, {
      split,
      predictionMapping: 'high_only'
    });
  }, [dataset, split]);

  return (
    <div
      className="card"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} style={{ color: 'var(--accent-violet)' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-navy-deep)' }}>
              Sensitivity & Decision Threshold Analysis
            </h3>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '780px' }}>
            Demonstrates the operational trade-off between sensitive early warning (flagging Medium & High scores) versus strict evidentiary triage (flagging High score only).
          </p>
        </div>

        <div
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--accent-violet-subtle)',
            border: '1px solid var(--accent-violet-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Award size={14} style={{ color: 'var(--accent-violet-dark)' }} />
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-violet-dark)' }}>
            Primary Benchmark Fixed to Standard Mapping
          </span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* Standard Model Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid var(--accent-violet)',
            borderRadius: 'var(--radius-md)',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--accent-violet-dark)',
                  letterSpacing: '0.05em'
                }}
              >
                Standard Policy (Benchmark Default)
              </span>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-navy-deep)', marginTop: '0.15rem' }}>
                Score ≥ 30 (Medium or High)
              </h4>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                backgroundColor: 'var(--accent-violet-subtle)',
                color: 'var(--accent-violet-dark)',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 800
              }}
            >
              Active Baseline
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            Prioritizes student safety by alerting whenever moderate warning indicators exist (e.g. unverified link + urgency). High recall to minimize missed scams.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-subtle)',
              padding: '0.95rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Precision</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>
                {(standardReport.precision * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Recall (Sensitivity)</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-violet-dark)', fontFamily: 'var(--font-mono)' }}>
                {(standardReport.recall * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>F1-Score</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-navy-deep)', fontFamily: 'var(--font-mono)' }}>
                {(standardReport.f1Score * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>False Positive Rate</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--risk-high)', fontFamily: 'var(--font-mono)' }}>
                {(standardReport.falsePositiveRate * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            <span>Confusion Counts:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              TP: {standardReport.confusionMatrix.truePositives} · FP: {standardReport.confusionMatrix.falsePositives} · TN: {standardReport.confusionMatrix.trueNegatives} · FN: {standardReport.confusionMatrix.falseNegatives}
            </span>
          </div>
        </div>

        {/* Conservative High-Only Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em'
                }}
              >
                Conservative Policy (High Evidence Only)
              </span>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-navy-deep)', marginTop: '0.15rem' }}>
                Score ≥ 70 (High Only)
              </h4>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                backgroundColor: 'var(--surface-highlight)',
                color: 'var(--text-muted)',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700
              }}
            >
              Alternative Policy
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            Restricts flags solely to severe threat combinations (e.g. explicit upfront fee demand or password harvesting). Minimizes false alarms at the risk of missing stealth scams.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-subtle)',
              padding: '0.95rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Precision</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>
                {(strictReport.precision * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Recall (Sensitivity)</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-violet-dark)', fontFamily: 'var(--font-mono)' }}>
                {(strictReport.recall * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>F1-Score</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-navy-deep)', fontFamily: 'var(--font-mono)' }}>
                {(strictReport.f1Score * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>False Positive Rate</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--risk-high)', fontFamily: 'var(--font-mono)' }}>
                {(strictReport.falsePositiveRate * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            <span>Confusion Counts:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              TP: {strictReport.confusionMatrix.truePositives} · FP: {strictReport.confusionMatrix.falsePositives} · TN: {strictReport.confusionMatrix.trueNegatives} · FN: {strictReport.confusionMatrix.falseNegatives}
            </span>
          </div>
        </div>
      </div>

      {/* Methodological Integrity Guardrail */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          padding: '0.85rem 1.1rem',
          borderRadius: 'var(--radius-sm)'
        }}
      >
        <ShieldAlert size={17} style={{ color: 'var(--accent-violet-dark)', flexShrink: 0 }} />
        <span>
          <strong style={{ color: 'var(--text-navy-deep)' }}>Methodological Guardrail:</strong> In scientific evaluation, thresholds must not be post-hoc tuned on the held-out test partition to artificially inflate reported metrics. The ScholarShield AI baseline is locked to the Standard Mapping (Score ≥ 30).
        </span>
      </div>
    </div>
  );
};
