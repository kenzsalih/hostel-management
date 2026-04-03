import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Common';

const WardenDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Warden Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card title="💸 Monitor Expenses">
          <p>Track all mess expenses and purchases.</p>
          <Link to="/warden/expenses" className="btn btn-primary">View Expenses</Link>
        </Card>

        <Card title="🧾 Generate Bills">
          <p>Create and distribute student bills.</p>
          <Link to="/warden/bills" className="btn btn-primary">Manage Bills</Link>
        </Card>

        <Card title="📈 Reports">
          <p>View detailed expense and income reports.</p>
          <Link to="/warden/reports" className="btn btn-primary">View Reports</Link>
        </Card>

        <Card title="👥 Manage Users">
          <p>Oversee all user accounts and permissions.</p>
          <Link to="/warden/users" className="btn btn-primary">Manage Users</Link>
        </Card>
      </div>
    </div>
  );
};

export default WardenDashboard;
