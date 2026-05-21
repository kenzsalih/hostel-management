import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <section className="auth-shell">
      <div className="auth-card">
        <h1>Access Restricted</h1>
        <p>You do not have permission to open this page.</p>
        <Link to="/" className="primary-link">
          Go to Dashboard
        </Link>
      </div>
    </section>
  );
};

export default UnauthorizedPage;
