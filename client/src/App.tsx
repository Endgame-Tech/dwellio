import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './styles/designSystem.css';

// Lazy loading dashboard components for better performance
import { Suspense, lazy } from 'react';
import ModernDashboardLayout from './layouts/ModernDashboardLayout';
import Properties from './pages/Properties';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Contact from './pages/Contact';

const ModernTenantDashboard = lazy(() => import('./pages/ModernTenantDashboard'));
const TenantProfile = lazy(() => import('./pages/TenantProfile'));
const MoveOutIntent = lazy(() => import('./pages/MoveOutIntent'));
const Applications = lazy(() => import('./pages/ModernApplications'));

// Fallback loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-700 dark:border-primary-500"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Public Pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/properties" element={<Properties />} />

            {/* Tenant Dashboard Routes with Modern Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <ModernDashboardLayout>
                    <ModernTenantDashboard />
                  </ModernDashboardLayout>
                </Suspense>
              </ProtectedRoute>
            } />

            <Route path="/tenant/profile" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <ModernDashboardLayout>
                    <TenantProfile />
                  </ModernDashboardLayout>
                </Suspense>
              </ProtectedRoute>
            } />

            <Route path="/move-out" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <ModernDashboardLayout>
                    <MoveOutIntent />
                  </ModernDashboardLayout>
                </Suspense>
              </ProtectedRoute>
            } />

            <Route path="/applications" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <ModernDashboardLayout>
                    <Applications />
                  </ModernDashboardLayout>
                </Suspense>
              </ProtectedRoute>
            } />

            {/* Redirect any unknown route to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
