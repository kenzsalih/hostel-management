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
import FeaturePlaceholder from './pages/FeaturePlaceholder';
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
                <FeaturePlaceholder
                  title="My Mess Cut Requests"
                  description="Track requests and submit new mess cuts from this page."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/bills"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <FeaturePlaceholder
                  title="My Bills"
                  description="View current and historical bills with payment status."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/expenses"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <FeaturePlaceholder
                  title="Shared Expense Snapshot"
                  description="Inspect breakdown of mess expenses and trends."
                />
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
                <FeaturePlaceholder
                  title="Mess Cut Approval Queue"
                  description="Approve or reject student requests with clear status tracking."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secretary/groceries"
            element={
              <ProtectedRoute allowedRoles={['mess_secretary']}>
                <FeaturePlaceholder
                  title="Grocery Entries"
                  description="Add grocery purchases and maintain expense records."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secretary/expenses"
            element={
              <ProtectedRoute allowedRoles={['mess_secretary']}>
                <FeaturePlaceholder
                  title="Expense Control"
                  description="Analyze purchase and category-wise expense performance."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secretary/announcement"
            element={
              <ProtectedRoute allowedRoles={['mess_secretary']}>
                <FeaturePlaceholder
                  title="Publish Announcement"
                  description="Post notices visible to the selected hostel audience."
                />
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
            path="/cook/messcuts"
            element={
              <ProtectedRoute allowedRoles={['cook']}>
                <FeaturePlaceholder
                  title="Approved Mess Cuts"
                  description="Use approved mess cuts to plan meal quantities accurately."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cook/planning"
            element={
              <ProtectedRoute allowedRoles={['cook']}>
                <FeaturePlaceholder
                  title="Meal Planning"
                  description="Design daily and weekly menus using available ingredients."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cook/mealcount"
            element={
              <ProtectedRoute allowedRoles={['cook']}>
                <FeaturePlaceholder
                  title="Today's Meal Count"
                  description="Review expected meal participation for each service."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cook/groceries"
            element={
              <ProtectedRoute allowedRoles={['cook']}>
                <FeaturePlaceholder
                  title="Kitchen Inventory View"
                  description="Track available grocery records for kitchen operations."
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/announcements"
            element={
              <ProtectedRoute allowedRoles={['student', 'mess_secretary', 'cook', 'warden']}>
                <FeaturePlaceholder
                  title="Announcements"
                  description="Read the latest notices from management and kitchen staff."
                />
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
                <FeaturePlaceholder
                  title="Expense Oversight"
                  description="Review all expense data with monthly and category controls."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warden/bills"
            element={
              <ProtectedRoute allowedRoles={['warden']}>
                <FeaturePlaceholder
                  title="Bill Generation"
                  description="Generate monthly student bills and track payment status."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warden/reports"
            element={
              <ProtectedRoute allowedRoles={['warden']}>
                <FeaturePlaceholder
                  title="Operational Reports"
                  description="Analyze spending and participation trends for decision making."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warden/users"
            element={
              <ProtectedRoute allowedRoles={['warden']}>
                <FeaturePlaceholder
                  title="User Administration"
                  description="Create and manage verified user accounts by role."
                />
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
