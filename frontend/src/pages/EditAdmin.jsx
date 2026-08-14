import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/auth.hooks.js';
import '../styles/dashboard.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function EditAdmin() {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = window.localStorage.getItem('peoplehub-auth-token');
        const response = await axios.get(`${API_BASE}/api/admins/${id}`, {
          withCredentials: true,
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });
        setAdmin(response.data?.admin);
        setName(response.data?.admin?.name || '');
        setEmail(response.data?.admin?.email || '');
        setRole(response.data?.admin?.role || 'admin');
      } catch (err) {
        console.error(err);
        alert('Unable to load admin');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-card">Loading...</div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-card">Admin not found</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      await axios.put(
        `${API_BASE}/api/admins/${id}`,
        { name, email, role, password: password || undefined },
        { withCredentials: true, headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );
      alert('Admin updated');
      navigate('/admins');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Unable to update admin');
    }
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card">
        <div className="dashboard-card__header">
          <div>
            <p className="dashboard-eyebrow">PeopleHub</p>
            <h1>Edit Admin</h1>
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
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </label>

          <label>
            New Password (leave empty to keep current)
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <div style={{ marginTop: 12 }}>
            <button type="submit" className="primary-button">
              Save
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