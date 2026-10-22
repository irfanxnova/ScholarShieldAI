import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // Defensive logging: log error message in dev mode without sensitive user data
    if (import.meta.env?.DEV) {
      console.error('[ScholarShield AI ErrorBoundary]', error.message, errorInfo.componentStack);
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '360px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2.5rem 1.5rem',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--risk-high-border)',
            borderRadius: 'var(--radius-lg)',
            margin: '2rem auto',
            maxWidth: '680px',
            textAlign: 'center',
            gap: '1.25rem',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--risk-high-subtle)',
              border: '1px solid var(--risk-high)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--risk-high)'
            }}
          >
            <AlertOctagon size={28} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-navy-deep)', margin: 0 }}>
              {this.props.fallbackTitle || 'Application Error Detected'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: 0, lineHeight: 1.5 }}>
              ScholarShield AI intercepted an unhandled rendering condition. Your analyzed text and session have been safeguarded in memory.
            </p>
          </div>

          {this.state.error && (
            <div
              style={{
                width: '100%',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1rem',
                textAlign: 'left',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--risk-high)',
                overflowX: 'auto'
              }}
            >
              <strong>Error:</strong> {this.state.error.message}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={this.handleReset}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                fontSize: '0.85rem'
              }}
            >
              <RotateCcw size={16} />
              <span>Recover Session</span>
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                fontSize: '0.85rem'
              }}
            >
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
