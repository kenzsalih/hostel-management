import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const toDisplayDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleDateString();
};

const ApplyMessCut = () => {
  const [formData, setFormData] = useState({ fromDate: '', toDate: '' });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMyRequests = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await api.get('/mess-cut/my');
      setRequests(payload?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load mess cut requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fromDate || !formData.toDate) {
      setError('Both fromDate and toDate are required.');
      return;
    }

    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      setError('fromDate must be on or before toDate.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/mess-cut/apply', formData);
      setSuccess('Mess cut request submitted successfully.');
      setFormData({ fromDate: '', toDate: '' });
      await fetchMyRequests();
    } catch (err) {
      setError(err.message || 'Failed to submit mess cut request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <h1>Apply Mess Cut</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="form-grid mess-cut-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fromDate">From Date</label>
          <input id="fromDate" name="fromDate" type="date" value={formData.fromDate} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="toDate">To Date</label>
          <input id="toDate" name="toDate" type="date" value={formData.toDate} onChange={handleChange} />
        </div>

        <div className="mess-cut-button-cell">
          <button 
            className="btn btn-primary mess-cut-submit-btn"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>

      </form>

      <h2 className="section-title">My Requests</h2>

      {loading ? (
        <p className="muted">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="muted">No mess cut requests found.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Applied At</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id || request.id}>
                  <td>{toDisplayDate(request.fromDate)}</td>
                  <td>{toDisplayDate(request.toDate)}</td>
                  <td>
                    <span className={`status-pill status-${request.status || 'pending'}`}>{request.status}</span>
                  </td>
                  <td>{toDisplayDate(request.appliedAt || request.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ApplyMessCut;
