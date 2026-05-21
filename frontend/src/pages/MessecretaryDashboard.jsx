import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Common';

const MessecretaryDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Mess Secretary Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card title="✂️ Mess Cut Requests">
          <p>Approve or reject student mess cut requests.</p>
          <Link to="/secretary/messcuts" className="btn btn-primary">Manage Requests</Link>
        </Card>

        <Card title="💸 Track Expenses">
          <p>Monitor total mess expenses.</p>
          <Link to="/secretary/expenses" className="btn btn-primary">View Expenses</Link>
        </Card>

        <Card title="📢 Post Announcement">
          <p>Create announcements for mess members.</p>
          <Link to="/announcements" className="btn btn-primary">Post New</Link>
        </Card>
      </div>
    </div>
  );
};

export default MessecretaryDashboard;
