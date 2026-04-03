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

        <Card title="✂️ Active Mess Cuts">
          <p>Check approved mess cuts for planning.</p>
          <Link to="/cook/messcuts" className="btn btn-primary">View Cuts</Link>
        </Card>

        <Card title="🛒 Grocery Items">
          <p>Available ingredients for meal planning.</p>
          <Link to="/cook/groceries" className="btn btn-primary">View Items</Link>
        </Card>

        <Card title="📋 Meal Planning">
          <p>Plan upcoming meals based on available items.</p>
          <Link to="/cook/planning" className="btn btn-primary">Plan Meals</Link>
        </Card>
      </div>
    </div>
  );
};

export default CookDashboard;
