import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error(`[${this.props.moduleName || 'Module'}]`, error, info);
    }
    // Production: send to monitoring service (Sentry, DataDog, etc.)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="glass" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, margin: '0 auto 12px',
            borderRadius: 999,
            background: 'rgba(255,87,87,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-bearish)',
          }}>
            <svg width={20} height={20} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </div>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
            {this.props.moduleName || 'Module'} Error
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
            {this.state.error?.message || 'Something went wrong'}
          </p>
          <button className="btn btn-sm" onClick={this.handleRetry}>
            <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 8a5 5 0 1 1-1.5-3.5M13 3v2.5h-2.5" />
            </svg>
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
