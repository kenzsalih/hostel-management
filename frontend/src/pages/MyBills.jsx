import React, { useCallback, useEffect, useState } from 'react';
import api from '../utils/api';

const toMoney = (value) => Number(value || 0).toFixed(2);

const MyBills = () => {
  const [bills, setBills] = useState([]);
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBills = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const query = month ? `?month=${encodeURIComponent(month)}` : '';
      const payload = await api.get(`/billing/my${query}`);
      setBills(payload?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch bills.');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const handlePay = async (billId) => {
    setPayingId(billId);
    setError('');
    setSuccess('');

    try {
      await api.patch('/billing/pay', { billId });
      setSuccess('Bill marked as paid successfully.');
      await fetchBills();
    } catch (err) {
      setError(err.message || 'Failed to pay bill.');
    } finally {
      setPayingId('');
    }
  };

  return (
    <section className="panel">
      <h1>My Bills</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="form-group inline-filter">
        <label htmlFor="billMonth">Filter Month</label>
        <input id="billMonth" type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
      </div>

      {loading ? (
        <p className="muted">Loading bills...</p>
      ) : bills.length === 0 ? (
        <p className="muted">No bills available.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Amount</th>
                <th>Mess Cut Days</th>
                <th>Payable Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => {
                const billId = bill._id || bill.id;
                const isPaid = bill.status === 'paid';
                const isPaying = payingId === billId;

                return (
                  <tr key={billId}>
                    <td>{bill.month}</td>
                    <td>{toMoney(bill.totalAmount)}</td>
                    <td>{bill.messCutDays}</td>
                    <td>{toMoney(bill.payableAmount)}</td>
                    <td>
                      <span className={`status-pill status-${bill.status || 'unpaid'}`}>{bill.status}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => handlePay(billId)}
                        disabled={isPaid || isPaying}
                      >
                        {isPaid ? 'Paid' : isPaying ? 'Paying...' : 'Pay Bill'}
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

export default MyBills;
