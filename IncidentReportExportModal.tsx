import React, { useState } from 'react';
import type { AnalysisResult } from '../../types';
import {
  createIncidentReportData,
  downloadIncidentReportJson,
  downloadIncidentReportCsv,
  type IncidentReportDocument
} from '../../lib/exportReport';
import {
  FileText,
  Download,
  Printer,
  X,
  FileSpreadsheet,
  Check,
  ShieldCheck,
  Info
} from 'lucide-react';

interface IncidentReportExportModalProps {
  analysis: AnalysisResult;
  rawMessage: string;
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentReportExportModal: React.FC<IncidentReportExportModalProps> = ({
  analysis,
  rawMessage,
  isOpen,
  onClose
}) => {
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen) return null;

  const reportData: IncidentReportDocument = createIncidentReportData(analysis, rawMessage);
  const jsonPreview = JSON.stringify(reportData, null, 2);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonPreview);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
    >
      <div
        className="card"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-popover)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                padding: '0.45rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-violet-subtle)',
                color: 'var(--accent-violet-dark)'
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <h3 id="export-modal-title" style={{ fontSize: '1.15rem', color: 'var(--text-navy-deep)', margin: 0 }}>
                Export Security Incident Dossier
              </h3>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: 'var(--accent-violet-dark)',
                  fontWeight: 700
                }}
              >
                {reportData.reportId}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close export modal"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          {/* Assessment Summary Strip */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Assessed Risk Classification
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color:
                      analysis.riskLevel === 'HIGH'
                        ? 'var(--risk-high)'
                        : analysis.riskLevel === 'MEDIUM'
                        ? 'var(--risk-medium)'
                        : 'var(--risk-low)'
                  }}
                >
                  {analysis.riskLevel} RISK ({analysis.overallScore}/100)
                </span>
                <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                  {analysis.matchedRuleCount} Signal{analysis.matchedRuleCount === 1 ? '' : 's'} Triggered
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Generated Locally</span>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                {new Date(reportData.generatedAt).toLocaleDateString()}{' '}
                {new Date(reportData.generatedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Privacy & Safety Guarantee */}
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(6, 182, 212, 0.05)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}
          >
            <ShieldCheck size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              <strong style={{ color: 'var(--text-navy-deep)' }}>100% Client-Side Privacy: </strong>
              This dossier is constructed strictly in your local browser memory. No text, credentials, IP addresses, or telemetry are transmitted to cloud endpoints or third parties.
            </div>
          </div>

          {/* Export Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Choose Export Format:
            </span>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem'
              }}
            >
              {/* JSON Button */}
              <button
                type="button"
                onClick={() => downloadIncidentReportJson(reportData)}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem'
                }}
              >
                <Download size={16} />
                <span>Download JSON Dossier</span>
              </button>

              {/* CSV Button */}
              <button
                type="button"
                onClick={() => downloadIncidentReportCsv(reportData)}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem'
                }}
              >
                <FileSpreadsheet size={16} />
                <span>Download CSV Summary</span>
              </button>

              {/* Print / PDF Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem'
                }}
              >
                <Printer size={16} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>

          {/* JSON Schema Preview Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Technical Payload Preview (JSON):
              </span>
              <button
                type="button"
                onClick={handleCopyJson}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedJson ? 'var(--risk-low)' : 'var(--accent-violet-dark)',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {copiedJson ? <Check size={13} /> : null}
                <span>{copiedJson ? 'Copied to Clipboard!' : 'Copy Raw JSON'}</span>
              </button>
            </div>

            <pre
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
                color: 'var(--text-secondary)',
                maxHeight: '160px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                margin: 0
              }}
            >
              {jsonPreview}
            </pre>
          </div>

          {/* Legal Notice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <Info size={13} />
            <span>
              Disclaimer: This report indicates heuristic threat signals and does not establish confirmed legal fraud.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
