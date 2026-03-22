import React from 'react';
import { Card } from '../components/Common';

const WardenDashboard = () => {
  return (
    <div className="dashboard">
      <h1>📋 Warden Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card title="💸 Monitor Expenses">
          <p>Track all mess expenses and purchases.</p>
          <a href="/warden/expenses" className="btn btn-primary">View Expenses</a>
        </Card>

        <Card title="🧾 Generate Bills">
          <p>Create and distribute student bills.</p>
          <a href="/warden/bills" className="btn btn-primary">Manage Bills</a>
        </Card>

        <Card title="📈 Reports">
          <p>View detailed expense and income reports.</p>
          <a href="/warden/reports" className="btn btn-primary">View Reports</a>
        </Card>

        <Card title="👥 Manage Users">
          <p>Oversee all user accounts and permissions.</p>
          <a href="/warden/users" className="btn btn-primary">Manage Users</a>
        </Card>
      </div>
    </div>
  );
};

export default WardenDashboard;
