import React, { useState } from 'react';
import type { VerificationStep } from '../../types';
import { CheckCircle2, Circle, Shield } from 'lucide-react';

interface VerificationChecklistProps {
  steps: VerificationStep[];
}

export const VerificationChecklist: React.FC<VerificationChecklistProps> = ({ steps }) => {
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setCompletedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!steps || steps.length === 0) return null;

  const priorityBadges = {
    essential: { class: 'badge-high', text: 'Mandatory Safe Step' },
    recommended: { class: 'badge-gold', text: 'Recommended' },
    optional: { class: 'badge-neutral', text: 'Advisory' }
  };

  const completedCount = steps.filter(s => completedIds[s.id]).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.6rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Shield size={18} style={{ color: 'var(--accent-violet)' }} />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-navy-deep)' }}>
            Safe Student Verification Protocol
          </h3>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.15rem 0.55rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: completedCount === steps.length ? 'var(--risk-low-subtle)' : 'var(--accent-violet-subtle)',
              color: completedCount === steps.length ? 'var(--risk-low)' : 'var(--accent-violet-dark)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {completedCount} / {steps.length} Verified
          </span>
        </div>

        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          Click step to mark as verified during demonstration
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {steps.map((step) => {
          const isDone = !!completedIds[step.id];
          const badge = priorityBadges[step.priority] || priorityBadges.recommended;

          return (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className="card card-hover"
              style={{
                padding: '1.15rem',
                backgroundColor: isDone ? '#F8FAFC' : '#FFFFFF',
                borderColor: isDone ? 'var(--border-subtle)' : 'var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                gap: '0.9rem',
                alignItems: 'flex-start',
                opacity: isDone ? 0.75 : 1,
                boxShadow: isDone ? 'none' : 'var(--shadow-sm)'
              }}
            >
              <button
                type="button"
                aria-label={`Toggle verification step: ${step.title}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  marginTop: '0.15rem',
                  color: isDone ? 'var(--risk-low)' : 'var(--text-dim)'
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={20} strokeWidth={2.5} />
                ) : (
                  <Circle size={20} strokeWidth={1.8} />
                )}
              </button>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h4
                    style={{
                      fontSize: '0.96rem',
                      color: isDone ? 'var(--text-muted)' : 'var(--text-navy-deep)',
                      textDecoration: isDone ? 'line-through' : 'none'
                    }}
                  >
                    {step.title}
                  </h4>
                  <span className={`badge ${badge.class}`} style={{ fontSize: '0.65rem' }}>
                    {badge.text}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.85rem',
                    color: isDone ? 'var(--text-dim)' : 'var(--text-secondary)',
                    lineHeight: 1.45
                  }}
                >
                  {step.instruction}
                </p>

                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent-teal)',
                    marginTop: '0.2rem',
                    fontStyle: 'normal'
                  }}
                >
                  <strong>Why this step protects you: </strong>
                  {step.rationale}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
