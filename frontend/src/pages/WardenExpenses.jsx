import React, { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

const WardenExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await api.get('/expenses/all');
      setExpenses(payload?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalAmount = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0).toFixed(2),
    [expenses]
  );

  return (
    <section className="panel">
      <h1>All Expenses</h1>

      {error && <div className="error-message">{error}</div>}

      <button className="btn btn-primary" type="button" onClick={fetchExpenses} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh'}
      </button>

      <p>
        Total Expense: <strong>{totalAmount}</strong>
      </p>

      {loading ? (
        <p className="muted">Loading expense records...</p>
      ) : expenses.length === 0 ? (
        <p className="muted">No expense records found.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Added By</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr key={item._id || item.id}>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>{Number(item.amount || 0).toFixed(2)}</td>
                  <td>{item.addedBy?.username || item.addedBy?.name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default WardenExpenses;
