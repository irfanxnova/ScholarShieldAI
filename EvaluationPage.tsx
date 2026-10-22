import React, { useState, useMemo } from 'react';
import type { EvaluationMetrics, EvaluationReport } from '../types';
import { MetricCard } from '../components/evaluation/MetricCard';
import { ConfusionMatrixVisualizer } from '../components/evaluation/ConfusionMatrixVisualizer';
import { ClassDistributionChart } from '../components/evaluation/ClassDistributionChart';
import { ErrorAnalysisExplorer } from '../components/evaluation/ErrorAnalysisExplorer';
import { ThresholdExplorer } from '../components/evaluation/ThresholdExplorer';
import { evaluateDataset } from '../lib/evaluateDataset';
import { BENCHMARK_DATASET, BENCHMARK_METADATA } from '../data/benchmarkDataset';
import {
  BookOpen,
  Cpu,
  Layers,
  HelpCircle,
  FileCheck2,
  ShieldCheck,
  Calendar,
  Database
} from 'lucide-react';

interface EvaluationPageProps {
  metrics?: EvaluationMetrics;
}

export const EvaluationPage: React.FC<EvaluationPageProps> = () => {
  const [selectedSplit, setSelectedSplit] = useState<'test' | 'development' | 'all'>('test');

  // Compute live evaluation report from benchmark dataset and detection engine
  const report: EvaluationReport = useMemo(() => {
    return evaluateDataset(BENCHMARK_DATASET, {
      split: selectedSplit,
      splitRatio: 0.5,
      seed: 42,
      predictionMapping: 'medium_or_high'
    });
  }, [selectedSplit]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div>
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: 'var(--accent-violet)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}
        >
          Model Evaluation & Statistical Rigor
        </span>
        <h2 style={{ fontSize: '1.85rem', color: 'var(--text-navy-deep)', marginTop: '0.2rem' }}>
          Classifier Performance & Benchmark Metrics
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem', maxWidth: '840px' }}>
          Empirical evaluation harness testing the deterministic ScholarShield AI detection engine against a curated, ground-truth benchmark of {BENCHMARK_METADATA.totalSamples} balanced collegiate announcements, internship invitations, and deceptive scams.
        </p>
      </div>

      {/* Dataset & Split Control Banner */}
      <div
        className="card"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-violet-subtle)',
              color: 'var(--accent-violet-dark)'
            }}
          >
            <Database size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1.02rem', color: 'var(--text-navy-deep)', margin: 0 }}>
                Benchmark Corpus: v{BENCHMARK_METADATA.version}
              </h4>
              <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>
                Group-Aware Leakage Protected
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              Deterministic Mulberry32 PRNG (Seed 42) ensures identical samples across all execution environments.
            </p>
          </div>
        </div>

        {/* Partition Selector Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: '#F1F5F9', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setSelectedSplit('test')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: selectedSplit === 'test' ? 'var(--accent-violet)' : 'transparent',
              color: selectedSplit === 'test' ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: selectedSplit === 'test' ? '0 2px 6px rgba(99, 102, 241, 0.25)' : 'none'
            }}
          >
            <ShieldCheck size={14} />
            <span>Held-Out Test Set (Recommended)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSplit('development')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: selectedSplit === 'development' ? '#FFFFFF' : 'transparent',
              color: selectedSplit === 'development' ? 'var(--text-navy-deep)' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: selectedSplit === 'development' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Development Set
          </button>

          <button
            type="button"
            onClick={() => setSelectedSplit('all')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: selectedSplit === 'all' ? '#FFFFFF' : 'transparent',
              color: selectedSplit === 'all' ? 'var(--text-navy-deep)' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: selectedSplit === 'all' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            All Samples (Full Corpus)
          </button>
        </div>
      </div>

      {/* Primary Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}
      >
        <MetricCard
          label="Precision"
          status="available"
          value={report.precision}
          formula="TP / (TP + FP)"
          accentColor="var(--accent-teal)"
          description="Fraction of flagged messages that are genuinely fraudulent. High precision minimizes disruptive false alarms for students."
        />
        <MetricCard
          label="Recall (Sensitivity)"
          status="available"
          value={report.recall}
          formula="TP / (TP + FN)"
          accentColor="var(--accent-violet-dark)"
          description="Fraction of all fraudulent messages successfully identified. High recall ensures stealthy scam solicitations are intercepted."
        />
        <MetricCard
          label="F1-Score"
          status="available"
          value={report.f1Score}
          formula="2·(P·R)/(P+R)"
          accentColor="var(--text-navy-deep)"
          description="Harmonic mean balancing precision and recall across realistic collegiate message distributions."
        />
        <MetricCard
          label="False Positive Rate"
          status="available"
          value={report.falsePositiveRate}
          formula="FP / (FP + TN)"
          accentColor="var(--risk-high)"
          description="Percentage of authentic university notices mistakenly flagged as threats. Essential for student trust."
        />
      </div>

      {/* Confusion Matrix & Class Distribution Visualizations */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem'
        }}
      >
        <ConfusionMatrixVisualizer matrix={report.confusionMatrix} status="available" />
        <ClassDistributionChart
          distribution={report.classDistribution}
          totalSamples={report.evaluatedCount}
          status="available"
        />
      </div>

      {/* Presentation Cheat-Sheet & Metric Explanation Cards */}
      <div
        className="card"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.6rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={18} style={{ color: 'var(--accent-violet)' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-navy-deep)' }}>
            Classroom Presentation Guide: How to Interpret These Metrics
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-teal)' }}>
              Precision: "When it alerts, can you trust it?"
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              If precision is 100%, every message flagged by the system is a genuine scam. High precision prevents 'alert fatigue' so students do not dismiss authentic aid awards.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-violet-dark)' }}>
              Recall: "Did any scam slip through?"
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              If recall is 87%, the system caught 87 out of 100 scams. Missed threats (False Negatives) represent student financial vulnerability to fee theft or credential leakage.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-navy-deep)' }}>
              F1-Score: "Overall Balanced Discernment"
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The harmonic mean between Precision and Recall. Unlike simple accuracy, F1 penalizes models that trivially guess the majority class or suffer asymmetric errors.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--risk-high)' }}>
              FPR: "Disruption to Campus Operations"
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The proportion of authentic university circulars falsely quarantined. A 0.0% false-positive rate protects normal educational workflows from disruption.
            </p>
          </div>
        </div>
      </div>

      {/* Threshold Comparison */}
      <ThresholdExplorer dataset={BENCHMARK_DATASET} split={selectedSplit} />

      {/* Diagnostic Error Analysis Explorer */}
      <ErrorAnalysisExplorer
        sampleResults={report.sampleResults}
        errorSamples={report.errorSamples}
      />

      {/* Scientific Rigor & Limitations Protocol */}
      <div
        className="card"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} style={{ color: 'var(--accent-violet)' }} />
          <h3 style={{ fontSize: '1.18rem', color: 'var(--text-navy-deep)' }}>
            Evaluation Methodology & Scientific Limitations
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileCheck2 size={16} style={{ color: 'var(--accent-teal)' }} />
              <h4 style={{ fontSize: '0.96rem', color: 'var(--accent-teal)' }}>
                1. Provenance & Benchmark Scope
              </h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              The benchmark consists of 80 carefully curated samples (40 legitimate negative controls, 40 deceptive threat variants). All domains use reserved documentation TLDs (*.example.edu, *.example.com) to guarantee zero live threat hazards.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} style={{ color: 'var(--accent-violet-dark)' }} />
              <h4 style={{ fontSize: '0.96rem', color: 'var(--accent-violet-dark)' }}>
                2. Leakage Prevention Protocol
              </h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Related message variants share a common <code>splitGroup</code> attribute. Group-aware splitting ensures that entire template families reside strictly in either development or test, preventing inflated metrics from near-duplicate memorization.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={16} style={{ color: 'var(--risk-high)' }} />
              <h4 style={{ fontSize: '0.96rem', color: 'var(--risk-high)' }}>
                3. Generalization Threat Note
              </h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              ScholarShield AI uses transparent heuristic rules, not statistical machine learning. High performance on this benchmark confirms rule fidelity against modelled attack archetypes, but does not prove generalization to unobserved real-world campaigns.
            </p>
          </div>
        </div>

        {/* Audit Metadata Strip */}
        <div
          style={{
            marginTop: '0.5rem',
            padding: '0.85rem 1.1rem',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <span>Evaluation Engine: Pure TypeScript client harness (0 external APIs)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={13} />
            Evaluated: {new Date(report.evaluatedAt).toLocaleDateString()} {new Date(report.evaluatedAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};
