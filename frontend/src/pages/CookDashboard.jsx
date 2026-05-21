import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Common';

const CookDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Cook Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card title="🍽️ Today's Meal Count">
          <p>View number of students for today's meals.</p>
          <Link to="/cook/mealcount" className="btn btn-primary">View Today</Link>
        </Card>

        <Card title="📢 Announcements">
          <p>Read daily notices from mess management.</p>
          <Link to="/announcements" className="btn btn-primary">View Updates</Link>
        </Card>
      </div>
    </div>
  );
};

export default CookDashboard;
