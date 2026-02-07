import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import StartupProfile from './pages/StartupProfile';
import Tasks from './pages/Tasks';
import Feedback from './pages/Feedback';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PitchGenerator from './pages/PitchGenerator';
import LandingPage from './pages/LandingPage';
import PublicFeedback from './pages/PublicFeedback';
import InvestorDashboard from './pages/InvestorDashboard';
import MentorDashboard from './pages/MentorDashboard';
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPage';


import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === 'Investor') return <Navigate to="/investor/dashboard" replace />;
    if (user.role === 'Mentor') return <Navigate to="/mentor/dashboard" replace />;
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/submit-feedback" element={<PublicFeedback />} />

          {/* Investor Routes */}
          <Route path="/investor" element={<Layout />}>
            <Route index element={<Navigate to="/investor/dashboard" replace />} />
            <Route path="dashboard" element={
              <ProtectedRoute allowedRoles={['Investor']}>
                <InvestorDashboard />
              </ProtectedRoute>
            } />
          </Route>

          {/* Mentor Routes */}
          <Route path="/mentor" element={<Layout />}>
            <Route index element={<Navigate to="/mentor/dashboard" replace />} />
            <Route path="dashboard" element={
              <ProtectedRoute allowedRoles={['Mentor']}>
                <MentorDashboard />
              </ProtectedRoute>
            } />
          </Route>

          {/* Founder/Team Routes */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={
              <ProtectedRoute allowedRoles={['Founder', 'Team']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute allowedRoles={['Founder']}>
                <StartupProfile />
              </ProtectedRoute>
            } />
            <Route path="tasks" element={
              <ProtectedRoute allowedRoles={['Founder', 'Team']}>
                <Tasks />
              </ProtectedRoute>
            } />
            <Route path="feedback" element={
              <ProtectedRoute allowedRoles={['Founder', 'Team']}>
                <Feedback />
              </ProtectedRoute>
            } />
            <Route path="analytics" element={
              <ProtectedRoute allowedRoles={['Founder']}>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="pitch" element={
              <ProtectedRoute allowedRoles={['Founder']}>
                <PitchGenerator />
              </ProtectedRoute>
            } />
            <Route path="subscription" element={
              <ProtectedRoute allowedRoles={['Founder']}>
                <PricingPage />
              </ProtectedRoute>
            } />
            <Route path="payment" element={
              <ProtectedRoute allowedRoles={['Founder']}>
                <PaymentPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Redirect old routes or unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

