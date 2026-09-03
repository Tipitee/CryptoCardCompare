import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

/**
 * Top-level error boundary. Prevents a single component crash from blanking the
 * whole app (white screen). Shows a minimal recovery UI and a reload button.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to the console (and any attached monitoring) without leaking to users.
    console.error('App crashed:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Une erreur est survenue</h1>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem', maxWidth: '32rem' }}>
          Désolé, un problème technique est survenu. Rechargez la page pour continuer.
        </p>
        <button
          onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
          style={{ background: '#06b6d4', color: '#0f172a', border: 0, borderRadius: '0.5rem', padding: '0.6rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Recharger la page
        </button>
      </div>
    );
  }
}
