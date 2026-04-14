import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

const currentMonthValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const Expenses = () => {
  const [month, setMonth] = useState(currentMonthValue());
  const [formData, setFormData] = useState({ amount: '', category: '', description: '', date: '' });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMonthly = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await api.get(`/expenses/monthly?month=${encodeURIComponent(month)}`);
      setSummary(payload?.data || null);
    } catch (err) {
      setError(err.message || 'Failed to load monthly expenses.');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchMonthly();
  }, [fetchMonthly]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.amount || !formData.category || !formData.description || !formData.date) {
      setError('All fields are required.');
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/expenses', {
        amount: Number(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date,
      });
      setSuccess('Expense added successfully.');
      setFormData({ amount: '', category: '', description: '', date: '' });
      await fetchMonthly();
    } catch (err) {
      setError(err.message || 'Failed to add expense.');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryRows = useMemo(() => summary?.categoryBreakdown || [], [summary]);
  const expenseRows = useMemo(() => summary?.expenses || [], [summary]);

  return (
    <section className="panel">
      <h1>Expenses</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input id="amount" name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input id="category" name="category" value={formData.category} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input id="description" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
        </div>
        <button className="btn btn-primary expense-submit-btn" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Add Expense'}
        </button>
      </form>

      <div className="section-title-row">
        <h2 className="section-title">Monthly Summary</h2>
        <div className="form-group inline-filter">
          <label htmlFor="expenseMonth">Month</label>
          <input id="expenseMonth" type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
        </div>
      </div>

      {loading ? (
        <p className="muted">Loading monthly data...</p>
      ) : (
        <>
          <p>
            Total Monthly Expense: <strong>{Number(summary?.totalMonthlyExpense || 0).toFixed(2)}</strong>
          </p>

          <h3>Category Breakdown</h3>
          {categoryRows.length === 0 ? (
            <p className="muted">No category data available.</p>
          ) : (
            <ul className="data-list">
              {categoryRows.map((item) => (
                <li key={item.category}>
                  <span>{item.category}</span>
                  <strong>{Number(item.total || 0).toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          )}

          <h3>Expense Entries</h3>
          {expenseRows.length === 0 ? (
            <p className="muted">No expense records for this month.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseRows.map((entry) => (
                    <tr key={entry._id || entry.id}>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{entry.category}</td>
                      <td>{entry.description}</td>
                      <td>{Number(entry.amount || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Expenses;
