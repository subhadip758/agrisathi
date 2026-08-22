import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/auth/PrivateRoute';
import ErrorBoundaryWrapper from './components/common/ErrorBoundaryWrapper';
import FloatingChatButton from './components/chatbot/Floatingchatbutton';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SoilAnalysis from './pages/SoilAnalysis';
import WeatherAdvisory from './pages/WeatherAdvisory';
import IrrigationPlanner from './pages/IrrigationPlanner';
import DiseaseDetection from './pages/DiseaseDetection';
import WaterAnalytics from './pages/WaterAnalytics';
import YieldPrediction from './pages/YieldPrediction';
import Helpdesk from './pages/Helpdesk';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Privacypolicy from './pages/Privacypolicy';
import Termsandconditions from './pages/Termsandconditions';
import Marketplace from './pages/Marketplace';
import GovernmentSchemes from './pages/GovernmentSchemes';
import CropAlerts from './pages/CropAlerts';
import AdminDashboard from './pages/AdminDashboard';
import Community from './pages/Community';

// ── Offline system — lazy loaded so a missing/broken file never crashes the main app
const Offline = lazy(() =>
  import('./pages/Offline').catch(() => ({
    default: () => <OfflineFallback />
  }))
);

function OfflineFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f0fdf4', flexDirection: 'column',
      fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
      <h2 style={{ color: '#166534', marginBottom: '0.5rem' }}>You are offline</h2>
      <p style={{ color: '#15803d', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Server is not reachable. Please check your connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: '#16a34a',
          color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '0.9rem',
          cursor: 'pointer', fontWeight: '600' }}>
        ↻ Retry
      </button>
    </div>
  );
}

class OfflineErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { crashed: false }; }
  static getDerivedStateFromError() { return { crashed: true }; }
  render() {
    if (this.state.crashed) return <OfflineFallback />;
    return this.props.children;
  }
}

const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://fruity-towns-sink.loca.lt';
const HEALTH_CHECK_INTERVAL = 3_000;
const HEALTH_TIMEOUT        = 4_000;

const HEALTH_URL = (() => {
  try {
    const u = new URL(BACKEND_URL);
    return `${u.protocol}//${u.host}/health`;
  } catch {
    return 'http://localhost:5180/health';
  }
})();

async function pingBackend() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return false;
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT);
    const res = await fetch(HEALTH_URL, {
      method: 'GET',
      headers: {
        'Bypass-Tunnel-Reminder': 'true',
        'ngrok-skip-browser-warning': 'true',
        'localtunnel-bypass-https': 'true'
      },
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timer);
    if (res.ok) return true;
  } catch {
    // Fallthrough to navigator.onLine check
  }
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

function App() {
  const [isOnline, setIsOnline]     = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [backOnline, setBackOnline] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkStatus() {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        if (!cancelled) setIsOnline(false);
        return;
      }
      const online = await pingBackend();
      if (!cancelled) setIsOnline(online);
    }

    checkStatus();

    const handleOffline = () => {
      if (!cancelled) setIsOnline(false);
    };

    const handleOnline = async () => {
      const online = await pingBackend();
      if (!cancelled) {
        setIsOnline(online);
        if (online) {
          setBackOnline(true);
          setTimeout(() => window.location.reload(), 1500);
        }
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    const interval = setInterval(async () => {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        if (!cancelled) setIsOnline(false);
        return;
      }
      const online = await pingBackend();
      if (cancelled) return;

      setIsOnline(prev => {
        if (!prev && online) {
          setBackOnline(true);
          setTimeout(() => window.location.reload(), 2000);
        }
        return online;
      });
    }, HEALTH_CHECK_INTERVAL);

    return () => {
      cancelled = true;
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      clearInterval(interval);
    };
  }, []);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    const online = await pingBackend();
    setIsRetrying(false);
    setIsOnline(online);
    if (online) {
      setBackOnline(true);
      setTimeout(() => window.location.reload(), 1500);
    }
  }, []);

  if (isOnline === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f0fdf4', flexDirection: 'column',
        fontFamily: 'sans-serif', textAlign: 'center' }}>
        <style dangerouslySetInnerHTML={{ __html: "@keyframes _kspin { to { transform: rotate(360deg); } } ._kspin { animation: _kspin 0.8s linear infinite; }" }} />
        <div className="_kspin" style={{ width: 52, height: 52, borderRadius: '50%',
          border: '4px solid #bbf7d0', borderTopColor: '#16a34a', marginBottom: 16 }} />
        <p style={{ color: '#15803d', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
          Connecting to server…
        </p>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <OfflineErrorBoundary>
        <Suspense fallback={<OfflineFallback />}>
          <Offline
            onRetry={handleRetry}
            isRetrying={isRetrying}
            isBackOnline={backOnline}
          />
        </Suspense>
      </OfflineErrorBoundary>
    );
  }

  return (
    <LanguageProvider>
      <ErrorBoundaryWrapper>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 flex flex-col relative">
                <AppContent />
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={true}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </div>
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundaryWrapper>
    </LanguageProvider>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login"  element={<Login />}  />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/*"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <Navbar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
        <Routes>
          <Route path="/"                    element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"           element={<Dashboard />} />
          <Route path="/soil-analysis"       element={<SoilAnalysis />} />
          <Route path="/weather"             element={<WeatherAdvisory />} />
          <Route path="/irrigation"          element={<IrrigationPlanner />} />
          <Route path="/disease-detection"   element={<DiseaseDetection />} />
          <Route path="/market"              element={<Marketplace />} />
          <Route path="/schemes"             element={<GovernmentSchemes />} />
          <Route path="/alerts"              element={<CropAlerts />} />
          <Route path="/admin"               element={<AdminDashboard />} />
          <Route path="/water-analytics"     element={<WaterAnalytics />} />
          <Route path="/yield-prediction"    element={<YieldPrediction />} />
          <Route path="/helpdesk"            element={<Helpdesk />} />
          <Route path="/profile"             element={<Profile />} />
          <Route path="/settings"            element={<Settings />} />
          <Route path="/crop-recommendation" element={<Navigate to="/soil-analysis" replace />} />
          <Route path="/register"            element={<Signup />} />
          <Route path="/community"           element={<Community />} />
          <Route path="/notifications"       element={<Notifications />} />
          <Route path="/privacy"             element={<Privacypolicy />} />
          <Route path="/terms"              element={<Termsandconditions />} />
          <Route path="/offline"            element={
            <Suspense fallback={<OfflineFallback />}>
              <Offline onRetry={() => window.location.reload()} isRetrying={false} isBackOnline={false} />
            </Suspense>
          } />
          <Route path="*"                    element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {/* Global Floating Chatbot Icon rendered across ALL pages */}
      <FloatingChatButton />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

export default App;