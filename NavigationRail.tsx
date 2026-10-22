import React from 'react';
import {
  LayoutDashboard,
  Search,
  BarChart2,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import type { ActiveTab } from '../../types';

interface NavigationRailProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onCloseMobile?: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeTab,
  onSelectTab,
  onCloseMobile
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ size: number }>; desc: string }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      desc: 'Threat landscape & protocol'
    },
    {
      id: 'analyze',
      label: 'Analyze Message',
      icon: Search,
      desc: 'Inspect messages & verify signals'
    },
    {
      id: 'evaluation',
      label: 'Evaluation',
      icon: BarChart2,
      desc: 'Benchmark metrics & confusion matrix'
    },
    {
      id: 'about',
      label: 'About & Methodology',
      icon: BookOpen,
      desc: 'Academic rationale & privacy'
    }
  ];

  return (
    <nav
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: '1.25rem 0.85rem',
        gap: '1.5rem',
        backgroundColor: '#FFFFFF'
      }}
      aria-label="Main Application Navigation"
    >
      {/* Top Nav Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <div
          style={{
            padding: '0.2rem 0.75rem 0.5rem 0.75rem',
            fontSize: '0.68rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}
        >
          Navigation
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.8rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--accent-violet-subtle)' : 'transparent',
                border: isActive ? '1px solid var(--accent-violet-border)' : '1px solid transparent',
                color: isActive ? 'var(--accent-violet-dark)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all var(--transition-fast)',
                position: 'relative',
                boxShadow: isActive ? '0 2px 8px -1px rgba(99, 102, 241, 0.12)' : 'none'
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '18%',
                    bottom: '18%',
                    width: '3.5px',
                    borderRadius: '0 4px 4px 0',
                    backgroundColor: 'var(--accent-violet)'
                  }}
                />
              )}

              <div
                style={{
                  color: isActive ? 'var(--accent-violet)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Icon size={19} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? 'var(--text-navy-deep)' : 'var(--text-secondary)'
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: isActive ? 'var(--text-muted)' : 'var(--text-dim)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Discreet Privacy & Security Notice Box */}
      <div
        style={{
          backgroundColor: 'rgba(6, 182, 212, 0.04)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-cyan)' }}>
          <ShieldCheck size={16} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Local-First Privacy
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          Text is parsed strictly in local browser memory. No messages are sent to external LLMs, clouds, or analytics trackers.
        </p>
      </div>
    </nav>
  );
};
