import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Packages from './pages/Packages/Packages';
import Customers from './pages/Customers/Customers';
import Orders from './pages/Orders/Orders';
import Issues from './pages/Issues/Issues';
import Technicians from './pages/Technicians/Technicians';
import InstallationRegistration from './pages/Medicines/Medicines';
import Notifications from './pages/Notifications/Notifications';
import SubscriptionExpiry from './pages/Subscriptions/SubscriptionExpiry';
import ChatAdmin from './pages/Chat/ChatAdmin';
import CommunityAdmin from './pages/Community/CommunityAdmin';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/packages" 
            element={
              <PrivateRoute>
                <Packages />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/customers" 
            element={
              <PrivateRoute>
                <Customers />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/issues" 
            element={
              <PrivateRoute>
                <Issues />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/technicians" 
            element={
              <PrivateRoute>
                <Technicians />
              </PrivateRoute>
            } 
          />
          <Route
            path="/installations"
            element={
              <PrivateRoute>
                <InstallationRegistration />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <PrivateRoute>
                <SubscriptionExpiry />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/community"
            element={
              <PrivateRoute>
                <CommunityAdmin />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
