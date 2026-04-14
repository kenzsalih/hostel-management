import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const Announcements = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canCreate = ['mess_secretary', 'cook', 'warden'].includes(user?.role);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await api.get('/announcements');
      setAnnouncements(payload?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.content) {
      setError('Title and content are required.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/announcements', formData);
      setSuccess('Announcement posted successfully.');
      setFormData({ title: '', content: '' });
      await fetchAnnouncements();
    } catch (err) {
      setError(err.message || 'Failed to post announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <h1>Announcements</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {canCreate && (
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={formData.title} onChange={handleChange} />
          </div>
          <div className="form-group full-width">
            <label htmlFor="content">Content</label>
            <textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={4} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Announcement'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="muted">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="muted">No announcements available.</p>
      ) : (
        <div className="list-stack">
          {announcements.map((item) => (
            <article className="card" key={item._id || item.id}>
              <h3 className="card-title">{item.title}</h3>
              <p>{item.content}</p>
              <p className="muted">
                Posted on {new Date(item.createdAt).toLocaleString()}
                {item.createdBy?.username ? ` by ${item.createdBy.username}` : ''}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Announcements;
