import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const toDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleDateString();
};

const MessCutApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPending = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await api.get('/mess-cut/pending');
      setRequests(payload?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch pending requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleReview = async (id, action) => {
    setProcessingId(id);
    setError('');
    setSuccess('');

    try {
      await api.patch(`/mess-cut/${id}/${action}`);
      setSuccess(`Request ${action}d successfully.`);
      await fetchPending();
    } catch (err) {
      setError(err.message || `Failed to ${action} request.`);
    } finally {
      setProcessingId('');
    }
  };

  return (
    <section className="panel">
      <h1>Mess Cut Approval</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <p className="muted">Loading pending requests...</p>
      ) : requests.length === 0 ? (
        <p className="muted">No pending mess cut requests.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>From</th>
                <th>To</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const id = request._id || request.id;
                const user = request.userId || {};

                return (
                  <tr key={id}>
                    <td>{user.username || user.name || request.userId}</td>
                    <td>{toDate(request.fromDate)}</td>
                    <td>{toDate(request.toDate)}</td>
                    <td>{toDate(request.appliedAt)}</td>
                    <td className="action-cell">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => handleReview(id, 'approve')}
                        disabled={processingId === id}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => handleReview(id, 'reject')}
                        disabled={processingId === id}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MessCutApproval;
