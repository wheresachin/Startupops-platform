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

import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={
              <ProtectedRoute allowedRoles={['Founder']}>
                <StartupProfile />
              </ProtectedRoute>
            } />
            <Route path="tasks" element={<Tasks />} />
            <Route path="feedback" element={<Feedback />} />
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
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
