import React, { useState, useMemo } from 'react';
import type { EvaluationSampleResult, RiskLevel } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
  Eye,
  EyeOff,
  ChevronDown,
  Info
} from 'lucide-react';

interface ErrorAnalysisExplorerProps {
  sampleResults: EvaluationSampleResult[];
  errorSamples: EvaluationSampleResult[];
}

type ErrorFilter = 'errors_only' | 'fp_only' | 'fn_only' | 'all';

export const ErrorAnalysisExplorer: React.FC<ErrorAnalysisExplorerProps> = ({
  sampleResults,
  errorSamples
}) => {
  const [filterType, setFilterType] = useState<ErrorFilter>('errors_only');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Extract unique scenario categories for filtering
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const res of sampleResults) {
      if (res.sample.scenarioCategory) {
        set.add(res.sample.scenarioCategory);
      }
    }
    return Array.from(set).sort();
  }, [sampleResults]);

  // Compute counts
  const fpCount = useMemo(() => sampleResults.filter((r) => r.outcome === 'FP').length, [sampleResults]);
  const fnCount = useMemo(() => sampleResults.filter((r) => r.outcome === 'FN').length, [sampleResults]);
  const tpCount = useMemo(() => sampleResults.filter((r) => r.outcome === 'TP').length, [sampleResults]);
  const tnCount = useMemo(() => sampleResults.filter((r) => r.outcome === 'TN').length, [sampleResults]);

  // Filter items
  const filteredItems = useMemo(() => {
    return sampleResults.filter((item) => {
      // Type filter
      if (filterType === 'errors_only' && item.isCorrect) return false;
      if (filterType === 'fp_only' && item.outcome !== 'FP') return false;
      if (filterType === 'fn_only' && item.outcome !== 'FN') return false;

      // Category filter
      if (selectedCategory !== 'all' && item.sample.scenarioCategory !== selectedCategory) {
        return false;
      }

      // Risk level filter
      if (selectedRisk !== 'all' && item.riskLevel !== selectedRisk) {
        return false;
      }

      return true;
    });
  }, [sampleResults, filterType, selectedCategory, selectedRisk]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return 'var(--risk-high)';
      case 'MEDIUM':
        return 'var(--risk-medium)';
      case 'LOW':
        return 'var(--risk-low)';
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'TP':
        return { label: 'True Positive (Hit)', color: 'var(--risk-high)', bg: 'rgba(225, 29, 72, 0.08)' };
      case 'TN':
        return { label: 'True Negative (Pass)', color: 'var(--risk-low)', bg: 'rgba(5, 150, 105, 0.08)' };
      case 'FP':
        return { label: 'False Positive (False Alarm)', color: 'var(--risk-high)', bg: 'rgba(225, 29, 72, 0.15)' };
      case 'FN':
        return { label: 'False Negative (Missed Threat)', color: 'var(--risk-medium)', bg: 'rgba(217, 119, 6, 0.15)' };
      default:
        return { label: outcome, color: 'var(--text-muted)', bg: 'var(--surface-highlight)' };
    }
  };

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
        gap: '1.5rem',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      {/* Header and Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} style={{ color: 'var(--accent-violet)' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-navy-deep)' }}>
              Diagnostic Error Analysis & Discrepancy Explorer
            </h3>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: '750px' }}>
            Transparently inspect edge cases, false alarms (Type I errors), and missed threats (Type II errors) to diagnose heuristic boundary limitations.
          </p>
        </div>

        {/* Quick Tally Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--risk-high-subtle)',
              border: '1px solid var(--risk-high-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <XCircle size={14} style={{ color: 'var(--risk-high)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--risk-high)' }}>
              {fpCount} False Positive{fpCount === 1 ? '' : 's'}
            </span>
          </div>

          <div
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--risk-medium-subtle)',
              border: '1px solid var(--risk-medium-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <AlertTriangle size={14} style={{ color: 'var(--risk-medium)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--risk-medium)' }}>
              {fnCount} False Negative{fnCount === 1 ? '' : 's'}
            </span>
          </div>

          <div
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--risk-low-subtle)',
              border: '1px solid var(--risk-low-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <CheckCircle2 size={14} style={{ color: 'var(--risk-low)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--risk-low)' }}>
              {tpCount + tnCount} Correct
            </span>
          </div>
        </div>
      </div>

      {/* Domain Interpretation Banner */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          borderLeft: '4px solid var(--accent-violet)',
          borderTop: '1px solid rgba(99, 102, 241, 0.15)',
          borderRight: '1px solid rgba(99, 102, 241, 0.15)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
          display: 'flex',
          gap: '0.85rem',
          alignItems: 'flex-start'
        }}
      >
        <Info size={18} style={{ color: 'var(--accent-violet)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          <strong style={{ color: 'var(--text-navy-deep)' }}>Heuristic Diagnostic Observations: </strong>
          False positives commonly stem from legitimate academic urgency phrasing (e.g. strict application windows) or official scholarship renewal disclaimers. False negatives reflect adversarial evasions where scammers use polite conversational prose, third-party interview forms, or novel compensation schemes that do not trigger explicit credential or fee patterns.
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          padding: '0.85rem 1rem',
          backgroundColor: '#F8FAFC',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '0.5rem' }}>
          <Filter size={15} style={{ color: 'var(--accent-violet-dark)' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Filter:
          </span>
        </div>

        {/* View Mode Pills */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setFilterType('errors_only')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: 700,
              backgroundColor: filterType === 'errors_only' ? 'var(--accent-violet)' : '#FFFFFF',
              color: filterType === 'errors_only' ? '#FFFFFF' : 'var(--text-secondary)',
              border: filterType === 'errors_only' ? '1px solid var(--accent-violet)' : '1px solid var(--border-medium)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            All Errors ({errorSamples.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('fp_only')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: 700,
              backgroundColor: filterType === 'fp_only' ? 'var(--risk-high)' : '#FFFFFF',
              color: filterType === 'fp_only' ? '#FFFFFF' : 'var(--text-secondary)',
              border: filterType === 'fp_only' ? '1px solid var(--risk-high)' : '1px solid var(--border-medium)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            False Positives ({fpCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('fn_only')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: 700,
              backgroundColor: filterType === 'fn_only' ? 'var(--risk-medium)' : '#FFFFFF',
              color: filterType === 'fn_only' ? '#FFFFFF' : 'var(--text-secondary)',
              border: filterType === 'fn_only' ? '1px solid var(--risk-medium)' : '1px solid var(--border-medium)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            False Negatives ({fnCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('all')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: 700,
              backgroundColor: filterType === 'all' ? 'var(--accent-violet-dark)' : '#FFFFFF',
              color: filterType === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
              border: filterType === 'all' ? '1px solid var(--accent-violet-dark)' : '1px solid var(--border-medium)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            All Evaluated ({sampleResults.length})
          </button>
        </div>

        {/* Category Dropdown */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              backgroundColor: '#FFFFFF',
              color: 'var(--text-navy-deep)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem 0.75rem',
              fontSize: '0.76rem',
              fontWeight: 600
            }}
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          {/* Risk Level Dropdown */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            style={{
              backgroundColor: '#FFFFFF',
              color: 'var(--text-navy-deep)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem 0.75rem',
              fontSize: '0.76rem',
              fontWeight: 600
            }}
          >
            <option value="all">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      {filteredItems.length === 0 ? (
        <div
          style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-medium)',
            color: 'var(--text-muted)'
          }}
        >
          <CheckCircle2 size={32} style={{ color: 'var(--risk-low)', marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-navy-deep)' }}>
            No samples match the selected diagnostic filter criteria.
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Adjust your error filter, category selection, or risk filter above.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.sample.id;
            const outcomeBadge = getOutcomeBadge(item.outcome);

            return (
              <div
                key={item.sample.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: item.isCorrect ? '1px solid var(--border-subtle)' : `1.5px solid ${outcomeBadge.color}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Sample Header Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--text-navy-deep)',
                        backgroundColor: '#F1F5F9',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {item.sample.id}
                    </span>

                    {/* Outcome Badge */}
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: outcomeBadge.bg,
                        color: outcomeBadge.color,
                        border: `1px solid ${outcomeBadge.color}`
                      }}
                    >
                      {outcomeBadge.label}
                    </span>

                    {/* Ground Truth Label */}
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      Ground Truth:{' '}
                      <strong
                        style={{
                          color: item.sample.groundTruth === 'suspicious' ? 'var(--risk-high)' : 'var(--risk-low)'
                        }}
                      >
                        {item.sample.groundTruth.toUpperCase()}
                      </strong>
                    </span>

                    {/* Category */}
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        backgroundColor: '#F8FAFC',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        fontWeight: 600
                      }}
                    >
                      {item.sample.scenarioCategory.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Engine Prediction Score */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        color: getRiskColor(item.riskLevel)
                      }}
                    >
                      Predicted {item.riskLevel} ({item.overallScore}/100)
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.sample.id)}
                      aria-label="Toggle sample text inspection"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-violet-dark)',
                        cursor: 'pointer',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.4rem'
                      }}
                    >
                      {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>{isExpanded ? 'Hide Raw Text' : 'Inspect Raw Text'}</span>
                      <ChevronDown
                        size={12}
                        style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.15s ease'
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* Explanatory Rationale */}
                {item.misclassificationRationale ? (
                  <div
                    style={{
                      padding: '0.7rem 0.95rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5
                    }}
                  >
                    <span style={{ fontWeight: 700, color: 'var(--accent-violet-dark)' }}>Diagnosis: </span>
                    {item.misclassificationRationale}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Annotation: {item.sample.annotationRationale}
                  </div>
                )}

                {/* Detected Warning Signals */}
                {item.warningSignals.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Signals Triggered:
                    </span>
                    {item.warningSignals.map((sig) => (
                      <span
                        key={sig.id}
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--accent-violet-subtle)',
                          border: '1px solid var(--accent-violet-border)',
                          color: 'var(--accent-violet-dark)',
                          fontWeight: 600
                        }}
                        title={sig.explanation}
                      >
                        {sig.title} (+{sig.scoreContribution})
                      </span>
                    ))}
                  </div>
                )}

                {/* Raw Message Text Quarantined View */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '0.35rem',
                      padding: '0.95rem 1.1rem',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 700
                      }}
                    >
                      <span>Quarantined Text Body</span>
                      <span>Provenance: {item.sample.provenance}</span>
                    </div>
                    <pre
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'var(--text-navy-deep)',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        lineHeight: 1.55,
                        margin: 0
                      }}
                    >
                      {item.sample.text}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
