import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/auth.hooks.js';
import '../styles/addEmployee.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function AddAdmin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="add-employee-page">
        <div className="form-header-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Access Denied</h2>
          <p style={{ color: '#64748b' }}>Only Super Administrators have permissions to create new admin accounts.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      await axios.post(
        `${API_BASE}/api/admins`,
        { name, email, password, role },
        { withCredentials: true, headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );
      navigate('/admins');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Unable to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-employee-page">
      <div className="form-header-card">
        <h1>Create Admin Account</h1>
        <p>Grant administrative access and role privileges to a user.</p>
      </div>

      <form className="add-employee-form" onSubmit={handleSubmit}>
        <section className="form-section-card">
          <h2 className="form-section-card__title">Admin Account Details</h2>

          <div className="form-grid-two-col">
            <div className="field-group">
              <label htmlFor="admin-name">Full Name *</label>
              <input
                id="admin-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="admin-email">Email Address *</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@staffly.com"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="admin-password">Password *</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="admin-role">Role &amp; Permissions *</label>
              <select id="admin-role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
        </section>

        <div className="form-actions-row">
          <Link to="/admins" className="secondary-button">
            Cancel
          </Link>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </div>
      </form>
    </div>
  );
}