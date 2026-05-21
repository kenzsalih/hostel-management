import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Common';

const StudentDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card title="📋 My Mess Cuts">
          <p>View and manage your mess cut requests.</p>
          <Link to="/student/messcut" className="btn btn-primary">View Details</Link>
        </Card>

        <Card title="💰 My Bills">
          <p>Track and pay your mess bills.</p>
          <Link to="/student/bills" className="btn btn-primary">View Bills</Link>
        </Card>

        <Card title="📢 Announcements">
          <p>Latest updates from mess management.</p>
          <Link to="/announcements" className="btn btn-primary">View All</Link>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
