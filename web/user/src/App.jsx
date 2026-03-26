import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './theme';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Packages from './pages/Packages';
import Installation from './pages/Installation';
import Settings from './pages/Settings';
import Support from './pages/Support';
import SpeedTest from './pages/SpeedTest';
import Billing from './pages/Billing';
import PackageComparison from './pages/PackageComparison';
import Promo from './pages/Promo';
import Game from './pages/Game';
import Technicians from './pages/Technicians';
import InstallationStatus from './pages/InstallationStatus';
import TechnicianDashboard from './pages/TechnicianDashboard';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    const userRole = user.role || 'customer';
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to={userRole === 'technician' ? '/technician-dashboard' : '/dashboard'} />;
    }
    
    return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to={user.role === 'technician' ? '/technician-dashboard' : '/dashboard'} />;
    }

    return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/installation" element={<Installation />} />
                  <Route path="/promo" element={<Promo />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/speedtest" element={<SpeedTest />} />
                  <Route 
                      path="/login" 
                      element={
                          <PublicRoute>
                              <Login />
                          </PublicRoute>
                      } 
                  />
                  <Route 
                      path="/register" 
                      element={
                          <PublicRoute>
                              <Register />
                          </PublicRoute>
                      } 
                  />
                  <Route 
                      path="/dashboard" 
                      element={
                          <ProtectedRoute allowedRoles={['customer', 'admin']}>
                              <Dashboard />
                          </ProtectedRoute>
                      } 
                  />
                  <Route 
                      path="/technician-dashboard" 
                      element={
                          <ProtectedRoute allowedRoles={['technician']}>
                              <TechnicianDashboard />
                          </ProtectedRoute>
                      } 
                  />
                  <Route 
                      path="/settings" 
                      element={
                          <ProtectedRoute>
                              <Settings />
                          </ProtectedRoute>
                      } 
                  />
                  <Route 
                      path="/support" 
                      element={
                          <ProtectedRoute>
                              <Support />
                          </ProtectedRoute>
                      } 
                  />
                  <Route 
                      path="/speed-test" 
                      element={
                          <ProtectedRoute>
                              <SpeedTest />
                          </ProtectedRoute>
                      } 
                  />
                  <Route 
                      path="/package-comparison" 
                      element={
                          <ProtectedRoute>
                              <PackageComparison />
                          </ProtectedRoute>
                      } 
                  />
                  <Route 
                      path="/billing" 
                      element={
                          <ProtectedRoute allowedRoles={['customer', 'admin']}>
                              <Billing />
                          </ProtectedRoute>
                      } 
                  />
                  <Route 
                      path="/installation-status" 
                      element={
                          <ProtectedRoute>
                              <InstallationStatus />
                          </ProtectedRoute>
                      } 
                  />
                  <Route 
                      path="/technicians" 
                      element={
                          <ProtectedRoute>
                              <Technicians />
                          </ProtectedRoute>
                      } 
                  />
              </Routes>
          </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
