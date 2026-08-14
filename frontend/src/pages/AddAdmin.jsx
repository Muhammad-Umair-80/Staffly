import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth.hooks.js';
import '../styles/dashboard.scss';

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
      <div className="dashboard-shell">
        <div className="dashboard-card">
          <p>Not authorized</p>
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
      alert('Admin created');
      navigate('/admins');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Unable to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card">
        <div className="dashboard-card__header">
          <div>
            <p className="dashboard-eyebrow">PeopleHub</p>
            <h1>Add Admin</h1>
            <p className="dashboard-subtitle">Create a new system administrator</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </label>

          <div style={{ marginTop: 12 }}>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Creating Admin...' : 'Create Admin'}
            </button>
            <button type="button" className="secondary-button" style={{ marginLeft: 8 }} onClick={() => navigate('/admins')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}