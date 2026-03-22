import React from 'react';
import { Card } from '../components/Common';

const StudentDashboard = () => {
  return (
    <div className="dashboard">
      <h1>📊 Student Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card title="📋 My Mess Cuts">
          <p>View and manage your mess cut requests.</p>
          <a href="/student/messcut" className="btn btn-primary">View Details</a>
        </Card>

        <Card title="💰 My Bills">
          <p>Track and pay your mess bills.</p>
          <a href="/student/bills" className="btn btn-primary">View Bills</a>
        </Card>

        <Card title="📢 Announcements">
          <p>Latest updates from mess management.</p>
          <a href="/announcements" className="btn btn-primary">View All</a>
        </Card>

        <Card title="💸 Expenses">
          <p>View current mess expenses breakdown.</p>
          <a href="/student/expenses" className="btn btn-primary">View Expenses</a>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
