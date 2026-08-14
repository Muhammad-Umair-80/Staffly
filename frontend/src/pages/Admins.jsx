import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/auth.hooks.js';
import '../styles/dashboard.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadAdmins = async () => {
    setLoading(true);
    setError(false);
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      const response = await axios.get(`${API_BASE}/api/admins`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      setAdmins(response.data?.admins || []);
    } catch (err) {
      console.error('Error loading admins', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleDisable = async (id) => {
    if (!window.confirm('Are you sure you want to disable this admin?')) return;
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      await axios.patch(`${API_BASE}/api/admins/${id}/disable`, null, {
        withCredentials: true,
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      await loadAdmins();
      alert('Admin disabled');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Unable to disable admin');
    }
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card">
        <div className="dashboard-card__header">
          <div>
            <p className="dashboard-eyebrow">PeopleHub</p>
            <h1>Admins</h1>
            <p className="dashboard-subtitle">Manage system administrators</p>
          </div>
          {user?.role === 'super_admin' ? (
            <Link to="/admins/add" className="primary-button" style={{ textDecoration: 'none' }}>
              + Add Admin
            </Link>
          ) : null}
        </div>

        {loading ? (
          <div className="list-loading">
            <div className="list-loading__row" />
            <div className="list-loading__row" />
            <div className="list-loading__row" />
          </div>
        ) : null}

        {!loading && error ? (
          <div className="content-state content-state--error">
            <p>Unable to load admins.</p>
            <button type="button" className="secondary-button" onClick={loadAdmins}>
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="employees-table-wrapper">
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.role === 'super_admin' ? 'Super Admin' : 'Admin'}</td>
                    <td>{a.status === 'disabled' ? 'Disabled' : 'Active'}</td>
                    <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="employee-actions">
                        <button
                          type="button"
                          className="text-link"
                          onClick={() => navigate(`/admins/${a.id}/edit`)}
                        >
                          Edit
                        </button>
                        {a.status !== 'disabled' && user?.role === 'super_admin' ? (
                          <button type="button" className="text-link" onClick={() => handleDisable(a.id)}>
                            Disable
                          </button>
                        ) : (
                          <span style={{ color: '#666', marginLeft: 8 }}>{a.status === 'disabled' ? 'Disabled' : ''}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}