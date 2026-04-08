import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const MealCount = () => {
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMealCount = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await api.get('/cook/meal-count');
      setMealData(payload?.data || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch meal count.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealCount();
  }, []);

  return (
    <section className="panel">
      <h1>Today's Meal Count</h1>

      {error && <div className="error-message">{error}</div>}

      <button className="btn btn-primary" type="button" onClick={fetchMealCount} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh Meal Count'}
      </button>

      {loading ? (
        <p className="muted">Loading meal count...</p>
      ) : mealData ? (
        <div className="result-grid">
          <div className="card">
            <h3 className="card-title">Date</h3>
            <p>{mealData.date}</p>
          </div>
          <div className="card">
            <h3 className="card-title">Total Students</h3>
            <p>{mealData.totalStudents}</p>
          </div>
          <div className="card">
            <h3 className="card-title">On Mess Cut</h3>
            <p>{mealData.studentsOnMessCut}</p>
          </div>
          <div className="card">
            <h3 className="card-title">Meal Count</h3>
            <p>{mealData.mealCount}</p>
          </div>
        </div>
      ) : (
        <p className="muted">No meal data available.</p>
      )}
    </section>
  );
};

export default MealCount;
