import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Prevent third-party script loading cross-origin error noise
if (typeof window !== 'undefined') {
  const originalOnError = window.onerror;
  window.onerror = function (msg, url, line, col, error) {
    if (typeof msg === 'string' && msg.toLowerCase().includes('script error')) {
      console.warn('Suppressed third-party cross-origin script error:', { msg, url });
      return true;
    }
    if (originalOnError) {
      return originalOnError.apply(window, arguments as any);
    }
    return false;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

