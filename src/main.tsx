import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initGoogleAnalytics } from './utils/analytics';
import FirestoreErrorBoundary from './components/FirestoreErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';

// Initialize Google Analytics (GA4)
initGoogleAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirestoreErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </FirestoreErrorBoundary>
  </StrictMode>,
);
