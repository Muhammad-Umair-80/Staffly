import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/auth.hooks.js';
import '../styles/employees.scss';

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
    if (!window.confirm('Are you sure you want to disable this admin account?')) return;
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      await axios.patch(`${API_BASE}/api/admins/${id}/disable`, null, {
        withCredentials: true,
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      await loadAdmins();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Unable to disable admin');
    }
  };

  return (
    <div className="employees-page">
      {/* Header Row */}
      <div className="employees-header-row">
        <div>
          <h1>Admin Management</h1>
          <p>System administrators with access permissions to Staffly.</p>
        </div>
        {user?.role === 'super_admin' ? (
          <Link to="/admins/add" className="primary-button">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            <span>Add Admin</span>
          </Link>
        ) : null}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading administrators...</div>
      ) : null}

      {!loading && error ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
          <h2>Unable to load admins</h2>
          <button type="button" className="secondary-button" onClick={loadAdmins} style={{ marginTop: '12px' }}>
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="employees-table-card">
          <table className="employees-table">
            <thead>
              <tr>
                <th>Admin Name</th>
                <th>Email Address</th>
                <th>Access Level</th>
                <th>Account Status</th>
                <th>Created Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="employee-photo-cell">
                      <div className="employee-avatar-fallback">
                        {(a.name || 'AD').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="employee-info-stack">
                        <span className="employee-name-link">{a.name}</span>
                      </div>
                    </div>
                  </td>
                  <td>{a.email}</td>
                  <td>
                    <span className={`status-badge ${a.role === 'super_admin' ? 'status-badge--active' : 'status-badge--in-progress'}`}>
                      {a.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${a.status === 'disabled' ? 'status-badge--archived' : 'status-badge--active'}`}>
                      {a.status === 'disabled' ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="secondary-button"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => navigate(`/admins/${a.id}/edit`)}
                      >
                        Edit
                      </button>
                      {a.status !== 'disabled' && user?.role === 'super_admin' && (
                        <button
                          type="button"
                          className="secondary-button"
                          style={{ padding: '4px 10px', fontSize: '12px', color: '#dc2626' }}
                          onClick={() => handleDisable(a.id)}
                        >
                          Disable
                        </button>
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
  );
}