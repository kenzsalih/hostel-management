import React from 'react';
import { Link } from 'react-router-dom';

const AccountRequestPage = () => {
  return (
    <section className="auth-shell">
      <div className="auth-card">
        <h1>Account Creation Policy</h1>
        <p>Public registration is disabled for security reasons.</p>
        <p>
          Contact your hostel warden or mess office to create a verified account.
        </p>
        <Link to="/login" className="primary-link">
          Back to Login
        </Link>
      </div>
    </section>
  );
};

export default AccountRequestPage;
