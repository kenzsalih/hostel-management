import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { logout } from './services/auth.service';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Header, Sidebar, Footer } from './components/Layout';

// Page imports
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import MessecretaryDashboard from './pages/MessecretaryDashboard';
import CookDashboard from './pages/CookDashboard';
import WardenDashboard from './pages/WardenDashboard';
import NotFound from './pages/NotFound';

import './styles/index.css';

function App() {
  const { user, isLoading, isAuth } = useAuth();

  const getDefaultPathForRole = (role) => {
    const rolePathMap = {
      student: '/student',
      mess_secretary: '/secretary',
      cook: '/cook',
      warden: '/warden',
    };

    return rolePathMap[role] || '/login';
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      {isAuth && user && (
        <>
          <Header user={user} onLogout={handleLogout} />
          <Sidebar role={user.role} />
        </>
      )}

      <main className={isAuth ? 'main-content' : ''}>
        <Routes>
          <Route
            path="/"
            element={
              isAuth && user ? (
                <Navigate to={getDefaultPathForRole(user.role)} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - Student */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Mess Secretary */}
          <Route
            path="/secretary"
            element={
              <ProtectedRoute allowedRoles={['mess_secretary']}>
                <MessecretaryDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Cook */}
          <Route
            path="/cook"
            element={
              <ProtectedRoute allowedRoles={['cook']}>
                <CookDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Warden */}
          <Route
            path="/warden"
            element={
              <ProtectedRoute allowedRoles={['warden']}>
                <WardenDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {isAuth && <Footer />}
    </Router>
  );
}

export default App;
