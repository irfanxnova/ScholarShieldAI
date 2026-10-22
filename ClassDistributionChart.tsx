import React from 'react';
import type { ClassDistribution } from '../../types';
import { BarChart3 } from 'lucide-react';

interface ClassDistributionChartProps {
  distribution?: ClassDistribution[];
  status: 'pending_integration' | 'available';
  totalSamples?: number;
}

export const ClassDistributionChart: React.FC<ClassDistributionChartProps> = ({
  distribution,
  status,
  totalSamples
}) => {
  const isAvailable = status === 'available' && !!distribution && distribution.length > 0;

  return (
    <div
      className="card"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        padding: '1.6rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={18} style={{ color: 'var(--accent-violet)' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-navy-deep)' }}>
            Benchmark Dataset Composition & Class Balance
          </h3>
        </div>
        <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
          {isAvailable ? `${totalSamples} Evaluated Samples` : 'Target Taxonomy'}
        </span>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
        A scientifically defensible benchmark demands a balanced distribution between legitimate institutional notifications and real-world deception patterns.
      </p>

      {isAvailable && distribution ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {distribution.map((item, idx) => {
            const isNegativeControl = item.category.toLowerCase().includes('negative') || item.category.toLowerCase().includes('legitimate');
            const barColor = isNegativeControl ? 'var(--risk-low)' : 'var(--risk-high)';
            const tagBg = isNegativeControl ? 'rgba(5, 150, 105, 0.08)' : 'rgba(225, 29, 72, 0.08)';

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: barColor,
                        display: 'inline-block'
                      }}
                    />
                    <span style={{ color: 'var(--text-navy-deep)', fontWeight: 600 }}>{item.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: tagBg,
                        color: barColor,
                        fontWeight: 700
                      }}
                    >
                      {item.count} samples
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#F1F5F9',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.percentage}%`,
                      backgroundColor: barColor,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Awaiting evaluation dataset load...
        </div>
      )}
    </div>
  );
};
