import React from 'react';
import type { ExtractedUrl } from '../../types';
import { Globe, Lock, Unlock } from 'lucide-react';

interface UrlIndicatorListProps {
  urls: ExtractedUrl[];
}

export const UrlIndicatorList: React.FC<UrlIndicatorListProps> = ({ urls }) => {
  if (!urls || urls.length === 0) {
    return (
      <div
        className="card"
        style={{
          padding: '1.25rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)' }}>
          <Globe size={18} />
          <span style={{ fontSize: '0.88rem' }}>No external URLs or web links detected in this message.</span>
        </div>
      </div>
    );
  }

  const riskBadgeConfig = {
    minimal: { class: 'badge-low', text: 'Low Threat' },
    moderate: { class: 'badge-medium', text: 'Moderate' },
    elevated: { class: 'badge-medium', text: 'Suspicious' },
    high: { class: 'badge-high', text: 'High Risk' }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.6rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Globe size={18} style={{ color: 'var(--accent-cyan)' }} />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-navy-deep)' }}>
            Extracted URL Structure & Observable Indicators
          </h3>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(6, 182, 212, 0.08)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(6, 182, 212, 0.25)'
            }}
          >
            {urls.length} Found
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Static Inspection (Links are quarantined / non-navigable)
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {urls.map((item) => {
          const badge = riskBadgeConfig[item.riskWeight] || riskBadgeConfig.moderate;
          const isHttps = item.protocol === 'https';

          return (
            <div
              key={item.id}
              className="card"
              style={{
                padding: '1.15rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Domain & Risk Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isHttps ? (
                    <span title="TLS Encrypted HTTPS" style={{ color: 'var(--risk-low)' }}>
                      <Lock size={15} />
                    </span>
                  ) : (
                    <span title="Unencrypted Plaintext HTTP" style={{ color: 'var(--risk-high)' }}>
                      <Unlock size={15} />
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--text-navy-deep)'
                    }}
                  >
                    {item.domain}
                  </span>
                </div>

                <span className={`badge ${badge.class}`}>
                  {badge.text}
                </span>
              </div>

              {/* Quarantined raw URL view */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.85rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--text-navy-deep)',
                  wordBreak: 'break-all',
                  userSelect: 'all'
                }}
                title="Quarantined URL (non-clickable for cybersecurity protection)"
              >
                <span style={{ color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.5rem' }}>LINK:</span>
                {item.url}
              </div>

              {/* Observable characteristics bullets */}
              {item.observableNotes.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    Observable Structural Indicators:
                  </span>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {item.observableNotes.map((note, idx) => (
                      <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
