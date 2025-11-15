import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LandlordProvider } from './context/LandlordContext';
import LandlordLayout from './layouts/LandlordLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import Properties from './pages/Properties';
import NewProperty from './pages/NewProperty';
import EditProperty from './pages/EditProperty';
import Applications from './pages/Applications';
import Payments from './pages/Payments';
import Maintenance from './pages/Maintenance';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LandlordProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/landlord/login" element={<Login />} />

              {/* Protected Landlord Routes */}
              <Route path="/landlord" element={
                <ProtectedRoute>
                  <LandlordLayout />
                </ProtectedRoute>
              }>
                {/* Dashboard */}
                <Route index element={<Dashboard />} />

                {/* User Management */}
                <Route path="users" element={
                  <ProtectedRoute permission="users.read">
                    <Users />
                  </ProtectedRoute>
                } />
                <Route path="users/:id" element={
                  <ProtectedRoute permission="users.read">
                    <UserDetails />
                  </ProtectedRoute>
                } />

                {/* Property Management */}
                <Route path="properties" element={
                  <ProtectedRoute permission="properties.read">
                    <Properties />
                  </ProtectedRoute>
                } />
                <Route path="properties/new" element={
                  <ProtectedRoute permission="properties.create">
                    <NewProperty />
                  </ProtectedRoute>
                } />
                <Route path="properties/:id/edit" element={
                  <ProtectedRoute permission="properties.update">
                    <EditProperty />
                  </ProtectedRoute>
                } />
                <Route path="properties/:id" element={
                  <ProtectedRoute permission="properties.read">
                    <Properties />
                  </ProtectedRoute>
                } />

                {/* Application Management */}
                <Route path="applications" element={
                  <ProtectedRoute permission="applications.read">
                    <Applications />
                  </ProtectedRoute>
                } />
                <Route path="applications/:id" element={
                  <ProtectedRoute permission="applications.read">
                    <Applications />
                  </ProtectedRoute>
                } />

                {/* Payment Management */}
                <Route path="payments" element={
                  <ProtectedRoute permission="payments.read">
                    <Payments />
                  </ProtectedRoute>
                } />
                <Route path="payments/:id" element={
                  <ProtectedRoute permission="payments.read">
                    <Payments />
                  </ProtectedRoute>
                } />

                {/* Maintenance Management */}
                <Route path="maintenance" element={
                  <ProtectedRoute permission="maintenance.read">
                    <Maintenance />
                  </ProtectedRoute>
                } />
                <Route path="maintenance/:id" element={
                  <ProtectedRoute permission="maintenance.read">
                    <Maintenance />
                  </ProtectedRoute>
                } />

                {/* Analytics */}
                <Route path="analytics" element={
                  <ProtectedRoute permission="analytics.read">
                    <Dashboard />
                  </ProtectedRoute>
                } />

                {/* Activity Logs */}
                <Route path="activity" element={
                  <ProtectedRoute permission="logs.read">
                    <Dashboard />
                  </ProtectedRoute>
                } />

                {/* Settings */}
                <Route path="settings" element={
                  <ProtectedRoute permission="settings.read">
                    <Settings />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Root Redirect */}
              <Route path="/" element={<Navigate to="/landlord" replace />} />

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </LandlordProvider>
    </QueryClientProvider>
  );
}

export default App;