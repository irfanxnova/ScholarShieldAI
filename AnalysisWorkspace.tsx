import React, { useState, useMemo } from 'react';
import type { ExampleMessage, AnalysisResult } from '../../types';
import { EXAMPLE_MESSAGES } from '../../data/examples';
import { ExampleMessageSelector } from './ExampleMessageSelector';
import { RiskScoreCard } from '../risk/RiskScoreCard';
import { WarningSignalList } from '../risk/WarningSignalList';
import { UrlIndicatorList } from '../risk/UrlIndicatorList';
import { VerificationChecklist } from '../risk/VerificationChecklist';
import { extractUrlsFromText } from '../../lib/urlUtils';
import { analyzeMessage } from '../../lib/analyzeMessage';
import { IncidentReportExportModal } from './IncidentReportExportModal';
import { MAX_ANALYSIS_INPUT_LENGTH } from '../../lib/textNormalization';
import {
  Trash2,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  Search,
  CheckCircle2,
  RefreshCw,
  FileDown
} from 'lucide-react';

interface AnalysisWorkspaceProps {
  presetExampleId?: string;
}

export const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({ presetExampleId }) => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedExampleId, setSelectedExampleId] = useState<string | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const [prevPreset, setPrevPreset] = useState<string | undefined>(presetExampleId);

  // Sync with presetExampleId when passed by presentation mode or external navigation
  if (presetExampleId !== prevPreset) {
    setPrevPreset(presetExampleId);
    if (presetExampleId) {
      const match = EXAMPLE_MESSAGES.find((ex) => ex.id === presetExampleId);
      if (match) {
        setInputText(match.content);
        setSelectedExampleId(match.id);
        setValidationError(null);
        setCurrentResult(analyzeMessage(match.content));
      }
    }
  }

  // Live static extraction of URLs from active text input
  const liveExtractedUrls = useMemo(() => {
    return extractUrlsFromText(inputText);
  }, [inputText]);

  const handleSelectExample = (example: ExampleMessage) => {
    setInputText(example.content);
    setSelectedExampleId(example.id);
    setValidationError(null);
    setIsAnalyzing(true);

    // Execute real deterministic analysis engine on example content
    setTimeout(() => {
      const result = analyzeMessage(example.content);
      setCurrentResult(result);
      setIsAnalyzing(false);
    }, 240);
  };

  const handleClear = () => {
    setInputText('');
    setSelectedExampleId(undefined);
    setValidationError(null);
    setCurrentResult(null);
  };

  const handleAnalyze = () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setValidationError('Please paste or type a scholarship or internship message to begin analysis.');
      return;
    }

    if (trimmed.length < 20) {
      setValidationError('Input is too brief. Provide the full message body or circular for meaningful risk assessment.');
      return;
    }

    setValidationError(null);
    setIsAnalyzing(true);

    // Execute real deterministic analysis engine
    setTimeout(() => {
      const result = analyzeMessage(trimmed);
      setCurrentResult(result);
      setIsAnalyzing(false);
    }, 320);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Workspace Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--accent-violet)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}
          >
            Analysis Workspace
          </span>
          <h2 style={{ fontSize: '1.85rem', color: 'var(--text-navy-deep)', marginTop: '0.2rem' }}>
            Inspect Scholarship & Internship Messages
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.3rem', maxWidth: '780px' }}>
            Paste the contents of any unsolicited email, offer letter, or recruitment notification. ScholarShield AI parses lexical threat markers, credential requests, and quarantined URL patterns.
          </p>
        </div>

        <div
          style={{
            padding: '0.5rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(5, 150, 105, 0.06)',
            border: '1px solid rgba(5, 150, 105, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.78rem',
            color: 'var(--risk-low)',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={16} />
          <span>Local Safe Execution (No data leaves your browser)</span>
        </div>
      </div>

      {/* Selectable Example Messages Strip */}
      <div
        className="card"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <ExampleMessageSelector
          selectedId={selectedExampleId}
          onSelectExample={handleSelectExample}
        />
      </div>

      {/* Input Area */}
      <div
        className="card"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-medium)',
          padding: '1.6rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label
            htmlFor="message-input"
            style={{
              fontWeight: 700,
              fontSize: '0.94rem',
              color: 'var(--text-navy-deep)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>Message Content / Email Transcript</span>
            {selectedExampleId && (
              <span className="badge badge-violet" style={{ fontSize: '0.65rem' }}>
                Preset Loaded
              </span>
            )}
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              style={{
                fontSize: '0.76rem',
                color: inputText.length > MAX_ANALYSIS_INPUT_LENGTH ? 'var(--risk-high)' : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600
              }}
            >
              {inputText.length.toLocaleString()} / {MAX_ANALYSIS_INPUT_LENGTH.toLocaleString()} chars
            </span>

            {inputText.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                title="Clear input"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <textarea
          id="message-input"
          className="textarea-dark"
          rows={8}
          placeholder="Paste scholarship offer, fellowship letter, internship recruiter message, or placement email here... (e.g., 'Congratulations! You have won $10,000. Pay $150 processing fee to release disbursement...')"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (validationError) setValidationError(null);
          }}
          aria-describedby="input-helper"
        />

        {validationError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--risk-high)',
              fontSize: '0.84rem',
              backgroundColor: 'var(--risk-high-subtle)',
              padding: '0.6rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--risk-high-border)'
            }}
            role="alert"
          >
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Live Quarantined URL Detection Snippet */}
        {liveExtractedUrls.length > 0 && (
          <div
            style={{
              backgroundColor: 'rgba(6, 182, 212, 0.05)',
              border: '1px solid rgba(6, 182, 212, 0.22)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LinkIcon size={15} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-navy-deep)' }}>
                Live URL Detector: Found <strong>{liveExtractedUrls.length}</strong> link
                {liveExtractedUrls.length === 1 ? '' : 's'} in message.
              </span>
            </div>
            <span
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              Domains: {liveExtractedUrls.map(u => u.domain).join(', ')}
            </span>
          </div>
        )}

        {/* Controls row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }} id="input-helper">
            Never paste active bank account passwords or unredacted tax IDs.
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputText.trim()}
              style={{ minWidth: '190px' }}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={17} className="animate-pulse-subtle" />
                  <span>Evaluating Signals...</span>
                </>
              ) : (
                <>
                  <Search size={17} />
                  <span>Analyze Message</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results Container */}
      {currentResult && (
        <div
          className="animate-fade-in"
          style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
        >
          {/* Action strip: Export Incident Dossier */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.95rem 1.35rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-violet)' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-navy-deep)' }}>
                Diagnostic Security Assessment Ready
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem' }}
            >
              <FileDown size={15} style={{ color: 'var(--accent-violet-dark)' }} />
              <span>Export Incident Dossier (JSON / Print)</span>
            </button>
          </div>

          {/* Executive Risk Score Card */}
          <RiskScoreCard result={currentResult} />

          {/* Warning Signals Breakdown */}
          <WarningSignalList signals={currentResult.warningSignals} />

          {/* Quarantined URL Analysis */}
          <UrlIndicatorList urls={currentResult.extractedUrls} />

          {/* Safe Actionable Verification Checklist */}
          <VerificationChecklist steps={currentResult.verificationChecklist} />
        </div>
      )}

      {/* Incident Report Export Modal */}
      {currentResult && (
        <IncidentReportExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          analysis={currentResult}
          rawMessage={inputText}
        />
      )}

      {/* Empty State Guidance (when no analysis run yet) */}
      {!currentResult && !isAnalyzing && (
        <div
          className="card"
          style={{
            padding: '2.8rem 1.5rem',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px dashed var(--border-medium)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-violet-subtle)',
              color: 'var(--accent-violet-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.1rem auto'
            }}
          >
            <Sparkles size={22} />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-navy-deep)', marginBottom: '0.4rem' }}>
            Ready for Risk Assessment
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.55 }}>
            Select one of the 5 preset demonstration scenarios above or paste your own circular, then click <strong>Analyze Message</strong> to observe explainable warning signals, numeric contributions, and verification steps.
          </p>
        </div>
      )}
    </div>
  );
};
