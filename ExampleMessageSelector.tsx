import React from 'react';
import type { ExampleMessage } from '../../types';
import { EXAMPLE_MESSAGES } from '../../data/examples';
import { Sparkles } from 'lucide-react';

interface ExampleMessageSelectorProps {
  onSelectExample: (example: ExampleMessage) => void;
  selectedId?: string;
}

export const ExampleMessageSelector: React.FC<ExampleMessageSelectorProps> = ({
  onSelectExample,
  selectedId
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.4rem'
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--accent-violet)' }} />
          Select Demonstration Scenarios:
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>
          5 Fictional Academic Scenarios
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.65rem'
        }}
      >
        {EXAMPLE_MESSAGES.map((example) => {
          const isSelected = selectedId === example.id;
          const isHigh = example.expectedRisk === 'HIGH';

          return (
            <button
              key={example.id}
              type="button"
              onClick={() => onSelectExample(example)}
              className="card-hover"
              style={{
                backgroundColor: isSelected ? 'var(--accent-violet-subtle)' : '#FFFFFF',
                border: isSelected ? '1.5px solid var(--accent-violet)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.8rem 0.95rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                transition: 'all var(--transition-fast)',
                boxShadow: isSelected ? '0 4px 14px -2px rgba(99, 102, 241, 0.22)' : 'var(--shadow-sm)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.4rem'
                }}
              >
                <span
                  className={`badge ${isHigh ? 'badge-high' : 'badge-low'}`}
                  style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}
                >
                  {example.categoryBadge}
                </span>

                {isSelected && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--accent-violet-dark)',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    Active
                  </span>
                )}
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: isSelected ? 'var(--text-navy-deep)' : 'var(--text-secondary)',
                  lineHeight: 1.35
                }}
              >
                {example.title}
              </div>

              <div
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.35,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {example.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
