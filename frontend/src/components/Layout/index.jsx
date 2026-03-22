import React from 'react';
import '../../styles/Layout.css';

// Header component
export const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>🏠 Hostel Mess Management</h1>
        <div className="header-actions">
          {user && (
            <>
              <span className="user-name">Welcome, {user.name}</span>
              <button onClick={onLogout} className="logout-btn">
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
      { label: 'Dashboard', icon: '📊', path: '/student' },
      { label: 'Apply Mess Cut', icon: '✂️', path: '/student/messcut' },
      { label: 'My Bills', icon: '💰', path: '/student/bills' },
      { label: 'Announcements', icon: '📢', path: '/announcements' },
    ],
    mess_secretary: [
      { label: 'Dashboard', icon: '📊', path: '/secretary' },
      { label: 'Mess Cuts', icon: '✂️', path: '/secretary/messcuts' },
      { label: 'Add Groceries', icon: '🛒', path: '/secretary/groceries' },
      { label: 'Expenses', icon: '💸', path: '/secretary/expenses' },
      { label: 'Post Announcement', icon: '📢', path: '/secretary/announcement' },
    ],
    cook: [
      { label: 'Dashboard', icon: '👨‍🍳', path: '/cook' },
      { label: 'Mess Cuts', icon: '✂️', path: '/cook/messcuts' },
      { label: 'Meal Planning', icon: '🍽️', path: '/cook/planning' },
    ],
    warden: [
      { label: 'Dashboard', icon: '📋', path: '/warden' },
      { label: 'Monitor Expenses', icon: '💸', path: '/warden/expenses' },
      { label: 'Generate Bills', icon: '🧾', path: '/warden/bills' },
      { label: 'Reports', icon: '📈', path: '/warden/reports' },
    ],
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems[role]?.map((item, idx) => (
          <a key={idx} href={item.path} className="nav-link">
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

// Footer component
export const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2026 Hostel Mess Management System. All rights reserved.</p>
    </footer>
  );
};
