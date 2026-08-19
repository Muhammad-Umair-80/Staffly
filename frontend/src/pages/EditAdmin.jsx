import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../styles/addEmployee.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function EditAdmin() {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="add-employee-page">
        <div className="form-header-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#64748b' }}>Loading admin profile details...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="add-employee-page">
        <div className="form-header-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Admin Account Not Found</h2>
          <p style={{ color: '#64748b', margin: '8px 0 16px 0' }}>The specified administrator account could not be found.</p>
          <Link to="/admins" className="primary-button">
            Back to Admins
          </Link>
        </div>
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
      navigate('/admins');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Unable to update admin');
    }
  };

  return (
    <div className="add-employee-page">
      <div className="form-header-card">
        <h1>Edit Admin Account</h1>
        <p>Update administrator details, email, role permissions, or reset password.</p>
      </div>

      <form className="add-employee-form" onSubmit={handleSubmit}>
        <section className="form-section-card">
          <h2 className="form-section-card__title">Account Information</h2>

          <div className="form-grid-two-col">
            <div className="field-group">
              <label htmlFor="admin-name">Full Name *</label>
              <input
                id="admin-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="admin-role">Role &amp; Access Level *</label>
              <select id="admin-role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="admin-password">New Password (optional)</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep existing"
              />
            </div>
          </div>
        </section>

        <div className="form-actions-row">
          <Link to="/admins" className="secondary-button">
            Cancel
          </Link>
          <button type="submit" className="primary-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}