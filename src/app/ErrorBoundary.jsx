import { Component } from 'react';

/**
 * Last-resort boundary so a render crash never leaves a blank page mid-booking.
 * Wire Sentry in here once VITE_SENTRY_DSN is set (blueprint 6.3).
 */
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-xl font-semibold text-content">Something went wrong</h1>
        <p className="max-w-sm text-sm text-content-muted">
          The page failed to load. Reloading usually fixes it.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 rounded-token bg-primary px-5 py-2.5 text-sm font-medium text-primary-contrast"
        >
          Reload page
        </button>
      </div>
    );
  }
}
