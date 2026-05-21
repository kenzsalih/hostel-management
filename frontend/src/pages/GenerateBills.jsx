import React, { useState } from 'react';
import api from '../utils/api';

const currentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const GenerateBills = () => {
  const [month, setMonth] = useState(currentMonth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setError('');
    setSuccess('');

    if (!month) {
      setError('Month is required.');
      return;
    }

    setLoading(true);

    try {
      const payload = await api.post('/billing/generate', { month });
      const data = payload?.data || payload;
      setResult(data);
      setSuccess('Monthly bills generated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to generate bills.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h1>Generate Monthly Bills</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="form-group inline-filter">
        <label htmlFor="billGenerateMonth">Month</label>
        <input id="billGenerateMonth" type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
      </div>

      <button className="btn btn-primary" type="button" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Monthly Bills'}
      </button>

      {result && (
        <div className="result-block">
          <p>
            Total Expenses: <strong>{Number(result.totalExpenses || 0).toFixed(2)}</strong>
          </p>
          <p>
            Total Users: <strong>{result.totalUsers}</strong>
          </p>
          <p>
            Per Day Cost: <strong>{Number(result.perDayCost || 0).toFixed(2)}</strong>
          </p>
          <p>
            Bills Generated: <strong>{Array.isArray(result.bills) ? result.bills.length : 0}</strong>
          </p>
        </div>
      )}
    </section>
  );
};

export default GenerateBills;
