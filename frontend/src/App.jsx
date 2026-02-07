import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import StartupProfile from './pages/StartupProfile';
import Tasks from './pages/Tasks';
import Feedback from './pages/Feedback';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import PitchGenerator from './pages/PitchGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} /> {/* Reusing Login for now as quick mockup */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<StartupProfile />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="pitch" element={<PitchGenerator />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
