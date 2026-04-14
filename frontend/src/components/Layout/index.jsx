import React from 'react';
import { NavLink } from 'react-router-dom';

// Header component
export const Header = ({ user, onLogout, dashboardPath }) => {
  return (
    <header className="header-shell">
      <div className="header-content-wrap">
        <h1 className="header-title">Wisdom Homes Hostel</h1>
        <div className="header-actions-wrap">
          {user && (
            <>
              <NavLink to={dashboardPath || '/'} className="dashboard-button">
                Dashboard
              </NavLink>
              <span className="user-name-chip">{user.name}</span>
              <button onClick={onLogout} className="danger-button" type="button">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// Sidebar component
export const Sidebar = ({ role }) => {
  const menuItems = {
    student: [
      { label: 'Apply Mess Cut', path: '/student/messcut' },
      { label: 'My Bills', path: '/student/bills' },
      { label: 'Announcements', path: '/announcements' },
    ],
    mess_secretary: [
      { label: 'Mess Cut Approval', path: '/secretary/messcuts' },
      { label: 'Expenses', path: '/secretary/expenses' },
      { label: 'Announcements', path: '/announcements' },
    ],
    cook: [
      { label: "Today's Meal Count", path: '/cook/mealcount' },
      { label: 'Announcements', path: '/announcements' },
    ],
    warden: [
      { label: 'Generate Bills', path: '/warden/bills' },
      { label: 'Expenses', path: '/warden/expenses' },
      { label: 'Manage Users', path: '/warden/users' },
      { label: 'Announcements', path: '/announcements' },
    ],
  };

  return (
    <aside className="sidebar-shell">
      <nav className="sidebar-nav-wrap">
        {menuItems[role]?.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) => `nav-link-item ${isActive ? 'is-active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

// Footer component
export const Footer = () => {
  return (
    <footer className="footer-shell">
      <p>Hostel Mess Management System 2026</p>
    </footer>
  );
};
