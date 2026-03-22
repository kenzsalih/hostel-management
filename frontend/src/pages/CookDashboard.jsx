import React from 'react';
import { Card } from '../components/Common';

const CookDashboard = () => {
  return (
    <div className="dashboard">
      <h1>👨‍🍳 Cook Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card title="🍽️ Today's Meal Count">
          <p>View number of students for today's meals.</p>
          <a href="/cook/mealcount" className="btn btn-primary">View Today</a>
        </Card>

        <Card title="✂️ Active Mess Cuts">
          <p>Check approved mess cuts for planning.</p>
          <a href="/cook/messcuts" className="btn btn-primary">View Cuts</a>
        </Card>

        <Card title="🛒 Grocery Items">
          <p>Available ingredients for meal planning.</p>
          <a href="/cook/groceries" className="btn btn-primary">View Items</a>
        </Card>

        <Card title="📋 Meal Planning">
          <p>Plan upcoming meals based on available items.</p>
          <a href="/cook/planning" className="btn btn-primary">Plan Meals</a>
        </Card>
      </div>
    </div>
  );
};

export default CookDashboard;
