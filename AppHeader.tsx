import React from 'react';
import { Shield, Menu, X, Search, Lock, MonitorPlay } from 'lucide-react';
import type { ActiveTab } from '../../types';

interface AppHeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeTab,
  onSelectTab,
  mobileMenuOpen,
  onToggleMobileMenu,
  isPresentationMode = false,
  onTogglePresentationMode
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        height: '66px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 clamp(1rem, 3vw, 2.25rem)',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.03)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Brand Wordmark and Aurora Shield Icon */}
        <div
          onClick={() => onSelectTab('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelectTab('overview');
            }
          }}
          aria-label="ScholarShield AI Home"
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.28)',
              color: '#FFFFFF',
              flexShrink: 0
            }}
          >
            <Shield size={21} strokeWidth={2.4} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.025em',
                  color: 'var(--text-navy-deep)'
                }}
              >
                Scholar<span style={{ color: 'var(--accent-violet)' }}>Shield</span>
              </span>
              <span
                style={{
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  padding: '0.14rem 0.42rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
                  color: 'var(--accent-violet-dark)',
                  border: '1px solid var(--accent-violet-border)',
                  letterSpacing: '0.06em'
                }}
              >
                AURORA
              </span>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontWeight: 600,
                lineHeight: 1
              }}
            >
              Academic Threat Intelligence
            </span>
          </div>
        </div>

        {/* Discreet Privacy Notice Badge */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--surface-highlight)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.74rem',
            color: 'var(--text-secondary)'
          }}
          className="desktop-privacy-badge"
        >
          <Lock size={12} style={{ color: 'var(--accent-teal)' }} />
          <span>Local Safe Engine • Zero Cloud Telemetry</span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--risk-low)',
              display: 'inline-block'
            }}
            title="Engine operational"
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onTogglePresentationMode && (
            <button
              type="button"
              className={isPresentationMode ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              onClick={onTogglePresentationMode}
              title={isPresentationMode ? 'Exit Presentation Mode (P)' : 'Enter Classroom Presentation Mode (P)'}
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}
            >
              <MonitorPlay
                size={14}
                style={{ color: isPresentationMode ? '#FFFFFF' : 'var(--accent-violet)' }}
              />
              <span className="desktop-privacy-badge">
                {isPresentationMode ? 'Exit Presentation' : 'Presentation Mode'}
              </span>
            </button>
          )}

          {activeTab !== 'analyze' && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onSelectTab('analyze')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Search size={14} />
              <span>Analyze Message</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label="Toggle Navigation Menu"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text-ivory)',
              cursor: 'pointer',
              padding: '0.4rem'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
};
