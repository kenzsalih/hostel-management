import React from 'react';
import { Card } from '../components/Common';

const MessecretaryDashboard = () => {
  return (
    <div className="dashboard">
      <h1>📊 Mess Secretary Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card title="✂️ Mess Cut Requests">
          <p>Approve or reject student mess cut requests.</p>
          <a href="/secretary/messcuts" className="btn btn-primary">Manage Requests</a>
        </Card>

        <Card title="🛒 Add Groceries">
          <p>Record grocery purchases and expenses.</p>
          <a href="/secretary/groceries" className="btn btn-primary">Add Items</a>
        </Card>

        <Card title="💸 Track Expenses">
          <p>Monitor total mess expenses.</p>
          <a href="/secretary/expenses" className="btn btn-primary">View Expenses</a>
        </Card>

        <Card title="📢 Post Announcement">
          <p>Create announcements for mess members.</p>
          <a href="/secretary/announcement" className="btn btn-primary">Post New</a>
        </Card>
      </div>
    </div>
  );
};

export default MessecretaryDashboard;
