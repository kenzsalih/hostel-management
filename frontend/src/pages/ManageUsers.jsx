import React, { useState } from 'react';
import { createUserByRole } from '../services/auth.service';

const ManageUsers = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'student' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createdUser, setCreatedUser] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setCreatedUser(null);

    if (!formData.username || !formData.password || !formData.role) {
      setError('username, password, and role are required.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = await createUserByRole({
        name: formData.username,
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });

      setSuccess('User created successfully.');
      setCreatedUser(payload?.user || null);
      setFormData({ username: '', password: '', role: 'student' });
    } catch (err) {
      setError(err.message || 'Failed to create user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <h1>Manage Users</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" value={formData.username} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="student">student</option>
            <option value="mess_secretary">mess_secretary</option>
            <option value="cook">cook</option>
            <option value="warden">warden</option>
          </select>
        </div>

        <button className="btn btn-primary create-user-btn" type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create User'}
        </button>
      </form>

      {createdUser && (
        <div className="result-block">
          <h3>Created User</h3>
          <p>Username: {createdUser.username}</p>
          <p>Role: {createdUser.role}</p>
        </div>
      )}
    </section>
  );
};

export default ManageUsers;
