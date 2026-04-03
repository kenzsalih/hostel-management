import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <h1>404 - Page Not Found</h1>
        <p>The route does not exist or your session path changed.</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} className="btn btn-primary" type="button">
            Go Back
          </button>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
