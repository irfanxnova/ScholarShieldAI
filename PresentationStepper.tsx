import React from 'react';
import {
  MonitorPlay,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  HelpCircle
} from 'lucide-react';
import {
  PRESENTATION_STEPS,
  type PresentationStepDef
} from '../../data/presentationSteps';

interface PresentationStepperProps {
  currentStepIndex: number;
  onStepChange: (newIndex: number) => void;
  onExitPresentation: () => void;
  onExecuteDemoAction: (step: PresentationStepDef) => void;
}

export const PresentationStepper: React.FC<PresentationStepperProps> = ({
  currentStepIndex,
  onStepChange,
  onExitPresentation,
  onExecuteDemoAction
}) => {
  const currentStep = PRESENTATION_STEPS[currentStepIndex] || PRESENTATION_STEPS[0];
  const totalSteps = PRESENTATION_STEPS.length;

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      onStepChange(prevIndex);
      onExecuteDemoAction(PRESENTATION_STEPS[prevIndex]);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      const nextIndex = currentStepIndex + 1;
      onStepChange(nextIndex);
      onExecuteDemoAction(PRESENTATION_STEPS[nextIndex]);
    }
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 66,
        zIndex: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '2px solid var(--accent-violet)',
        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.08)',
        padding: '0.85rem clamp(1rem, 3vw, 2.25rem)'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        {/* Top Control Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'var(--accent-violet-subtle)',
                color: 'var(--accent-violet-dark)',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 800,
                fontSize: '0.75rem',
                border: '1px solid var(--accent-violet-border)',
                letterSpacing: '0.04em'
              }}
            >
              <MonitorPlay size={15} />
              <span>CLASSROOM PRESENTATION MODE</span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {PRESENTATION_STEPS.map((step, idx) => (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => {
                    onStepChange(idx);
                    onExecuteDemoAction(step);
                  }}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: idx === currentStepIndex ? 'var(--accent-violet)' : '#F1F5F9',
                    color: idx === currentStepIndex ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: idx === currentStepIndex ? '0 2px 8px rgba(99, 102, 241, 0.35)' : 'none'
                  }}
                  title={`Step ${step.number}: ${step.title}`}
                >
                  {step.number}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              Step {currentStep.number} of {totalSteps}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => onExecuteDemoAction(currentStep)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
              title="Re-run demonstration action for this step"
            >
              <Play size={13} style={{ color: 'var(--accent-violet-dark)' }} />
              <span>Load Step Demo</span>
            </button>

            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem' }}
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentStepIndex === totalSteps - 1}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem' }}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>

            <button
              type="button"
              onClick={onExitPresentation}
              className="btn btn-ghost btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}
              title="Exit presentation mode (P or Esc)"
            >
              <X size={15} />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Current Step Guidance & Talking Points Box */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.85rem 1.15rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-navy-deep)' }}>
                {currentStep.title}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-violet-dark)', fontWeight: 600 }}>
                • {currentStep.subtitle}
              </span>
            </div>
            <ul
              style={{
                margin: '0.45rem 0 0 1.25rem',
                padding: 0,
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}
            >
              {currentStep.talkingPoints.map((point, pIdx) => (
                <li key={pIdx}>{point}</li>
              ))}
            </ul>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              fontWeight: 600
            }}
          >
            <HelpCircle size={14} />
            <span>Shortcuts: [P] toggle, [←] prev, [→] next</span>
          </div>
        </div>
      </div>
    </div>
  );
};
