import React from 'react';
import { NavLink } from 'react-router-dom';

// Header component
export const Header = ({ user, onLogout }) => {
  return (
    <header className="header-shell">
      <div className="header-content-wrap">
        <h1 className="header-title">Hostel Mess Command Center</h1>
        <div className="header-actions-wrap">
          {user && (
            <>
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
      { label: 'Dashboard', path: '/student' },
      { label: 'Apply Mess Cut', path: '/student/messcut' },
      { label: 'My Bills', path: '/student/bills' },
      { label: 'Announcements', path: '/announcements' },
    ],
    mess_secretary: [
      { label: 'Dashboard', path: '/secretary' },
      { label: 'Mess Cuts', path: '/secretary/messcuts' },
      { label: 'Add Groceries', path: '/secretary/groceries' },
      { label: 'Expenses', path: '/secretary/expenses' },
      { label: 'Post Announcement', path: '/secretary/announcement' },
    ],
    cook: [
      { label: 'Dashboard', path: '/cook' },
      { label: 'Mess Cuts', path: '/cook/messcuts' },
      { label: 'Meal Planning', path: '/cook/planning' },
      { label: "Today's Meal Count", path: '/cook/mealcount' },
      { label: 'Groceries', path: '/cook/groceries' },
    ],
    warden: [
      { label: 'Dashboard', path: '/warden' },
      { label: 'Monitor Expenses', path: '/warden/expenses' },
      { label: 'Generate Bills', path: '/warden/bills' },
      { label: 'Reports', path: '/warden/reports' },
      { label: 'Manage Users', path: '/warden/users' },
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
