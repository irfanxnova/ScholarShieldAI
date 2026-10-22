import React, { useState } from 'react';
import type { ActiveTab } from '../../types';
import { AppHeader } from './AppHeader';
import { NavigationRail } from './NavigationRail';
import { AppFooter } from './AppFooter';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { X } from 'lucide-react';

interface AppShellProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  children: React.ReactNode;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
  presentationStepper?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  children,
  isPresentationMode = false,
  onTogglePresentationMode,
  presentationStepper
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={isPresentationMode ? 'presentation-mode' : ''}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-canvas)'
      }}
    >
      {/* Top Fixed / Sticky Header */}
      <AppHeader
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        isPresentationMode={isPresentationMode}
        onTogglePresentationMode={onTogglePresentationMode}
      />

      {/* Classroom Presentation Stepper (when presentation mode is active) */}
      {isPresentationMode && presentationStepper}

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            zIndex: 50,
            display: 'flex'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '84%',
              maxWidth: '320px',
              backgroundColor: '#FFFFFF',
              borderRight: '1px solid var(--border-medium)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-popover)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.1rem 1.25rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-navy-deep)' }}>
                ScholarShield AI
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
                aria-label="Close Navigation Drawer"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <NavigationRail
                activeTab={activeTab}
                onSelectTab={handleTabChange}
                onCloseMobile={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: Desktop Rail + Active Page */}
      <div className="app-layout">
        <aside
          className="desktop-rail"
          style={{
            display: isPresentationMode ? 'none' : undefined
          }}
        >
          <NavigationRail
            activeTab={activeTab}
            onSelectTab={handleTabChange}
          />
        </aside>

        <main
          className="main-content"
          id="main-content"
          style={{
            maxWidth: isPresentationMode ? '1200px' : undefined,
            margin: isPresentationMode ? '0 auto' : undefined
          }}
        >
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      {/* Application Footer */}
      <AppFooter onSelectTab={handleTabChange} />
    </div>
  );
};
