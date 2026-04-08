import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Header, Sidebar, Footer } from './components/Layout';

// Page imports
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import MessecretaryDashboard from './pages/MessecretaryDashboard';
import CookDashboard from './pages/CookDashboard';
import WardenDashboard from './pages/WardenDashboard';
import ApplyMessCut from './pages/ApplyMessCut';
import MyBills from './pages/MyBills';
import Expenses from './pages/Expenses';
import MessCutApproval from './pages/MessCutApproval';
import Announcements from './pages/Announcements';
import GenerateBills from './pages/GenerateBills';
import MealCount from './pages/MealCount';
import ManageUsers from './pages/ManageUsers';
import WardenExpenses from './pages/WardenExpenses';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AccountRequestPage from './pages/AccountRequestPage';
import NotFound from './pages/NotFound';

import './styles/index.css';

function App() {
  const { user, isLoading, isAuth, logout } = useAuth();

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
    window.location.assign('/login');
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
          <Route path="/access-request" element={<AccountRequestPage />} />
          <Route path="/register" element={<Navigate to="/access-request" replace />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes - Student */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/messcut"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ApplyMessCut />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/bills"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyBills />
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
          <Route
            path="/secretary/messcuts"
            element={
              <ProtectedRoute allowedRoles={['mess_secretary']}>
                <MessCutApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secretary/expenses"
            element={
              <ProtectedRoute allowedRoles={['mess_secretary']}>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute allowedRoles={['student', 'mess_secretary', 'cook', 'warden']}>
                <Announcements />
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
          <Route
            path="/cook/mealcount"
            element={
              <ProtectedRoute allowedRoles={['cook']}>
                <MealCount />
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
          <Route
            path="/warden/expenses"
            element={
              <ProtectedRoute allowedRoles={['warden']}>
                <WardenExpenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warden/bills"
            element={
              <ProtectedRoute allowedRoles={['warden']}>
                <GenerateBills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warden/users"
            element={
              <ProtectedRoute allowedRoles={['warden']}>
                <ManageUsers />
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
