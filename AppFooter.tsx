import React from 'react';
import { Shield, Lock } from 'lucide-react';
import type { ActiveTab } from '../../types';

interface AppFooterProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onSelectTab }) => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: '#FFFFFF',
        padding: '2.5rem clamp(1rem, 3vw, 2.5rem)',
        marginTop: 'auto',
        boxShadow: '0 -1px 3px 0 rgba(15, 23, 42, 0.02)'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          {/* Brand & Purpose */}
          <div style={{ maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Shield size={16} strokeWidth={2.4} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: 'var(--text-navy-deep)'
                }}
              >
                Scholar<span style={{ color: 'var(--accent-violet)' }}>Shield</span> AI
              </span>
              <span className="badge badge-teal" style={{ fontSize: '0.62rem' }}>
                Aurora Edition
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              An academic student-cybersecurity research project empowering collegiate learners against predatory scholarship fees, fake internship recruiters, and collegiate credential harvesting.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-navy-deep)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Navigation
              </span>
              <button
                type="button"
                onClick={() => onSelectTab('overview')}
                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', fontSize: '0.84rem', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-violet-dark)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                Overview Dashboard
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('analyze')}
                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', fontSize: '0.84rem', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-violet-dark)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                Analyze Message
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('evaluation')}
                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', fontSize: '0.84rem', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-violet-dark)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                Evaluation Metrics
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('about')}
                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', fontSize: '0.84rem', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-violet-dark)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                Methodology & Limits
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxWidth: '300px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-navy-deep)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Student Security Principle
              </span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Legitimate universities, grants, and internships never demand non-refundable application clearance fees or collegiate SSO password verification.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Project Disclosure */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={12} style={{ color: 'var(--accent-teal)' }} />
            <span>© 2026 ScholarShield AI • Aurora Intelligence System • Safe Local Execution</span>
          </div>
          <div>
            Indicators are evidentiary flags for student verification, not definitive fraud determination.
          </div>
        </div>
      </div>
    </footer>
  );
};
