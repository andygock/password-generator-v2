import { Component } from 'react';
import ui from './ui.module.css';

// Suspense handles pending chunks; an error boundary handles rejected chunks.
// A full reload also replaces stale asset URLs after a deployment.
export default class GeneratorErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className={`${ui.panel} ${ui.body}`} role="alert">
          <p>
            Unable to open the generator. Check your connection and reload the
            page.
          </p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
