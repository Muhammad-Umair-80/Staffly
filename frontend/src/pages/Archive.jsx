import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/archive.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const formatDate = (value) => {
  if (!value) return 'Not provided';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not provided';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'EM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const Archive = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadArchivedEmployees = async () => {
    setLoading(true);
    setError(false);

    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      const response = await axios.get(`${API_BASE}/api/employees?status=archived`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      setEmployees(response.data?.employees || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchivedEmployees();
  }, []);

  return (
    <div className="archive-page">
      {/* Header Card */}
      <div className="archive-header-card">
        <div>
          <h1>Archived Employees</h1>
          <p>Repository of past employees, departure dates, and exit reasons.</p>
        </div>
        <Link to="/employees" className="secondary-button">
          Back to Employees
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading archived records...</div>
      ) : null}

      {!loading && error ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
          <h2>Unable to load archived records</h2>
          <button type="button" className="secondary-button" onClick={loadArchivedEmployees} style={{ marginTop: '12px' }}>
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error && employees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h2>No archived records</h2>
          <p style={{ color: '#64748b', margin: '8px 0 0 0' }}>Archived employee records will be displayed here once employees depart.</p>
        </div>
      ) : null}

      {!loading && !error && employees.length > 0 ? (
        <div className="archive-list">
          {employees.map((employee) => {
            const profileImage = employee.profileImage?.url;

            return (
              <article className="archive-card" key={employee._id}>
                <div className="archive-card__identity">
                  {profileImage ? (
                    <img className="employee-avatar" src={profileImage} alt={employee.fullName} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div className="employee-avatar employee-avatar--fallback" style={{ width: '48px', height: '48px', fontSize: '16px' }}>{getInitials(employee.fullName)}</div>
                  )}
                  <div>
                    <h3>{employee.fullName}</h3>
                    <p>{employee.role || 'Role not provided'} &bull; {employee.department || 'General'}</p>
                  </div>
                </div>

                <div className="archive-card__meta-grid">
                  <div className="archive-card__meta-item">
                    <span className="archive-card__meta-label">Employee ID</span>
                    <span className="archive-card__meta-value">{employee.employeeId || 'N/A'}</span>
                  </div>
                  <div className="archive-card__meta-item">
                    <span className="archive-card__meta-label">Joining Date</span>
                    <span className="archive-card__meta-value">{formatDate(employee.joiningDate)}</span>
                  </div>
                  <div className="archive-card__meta-item">
                    <span className="archive-card__meta-label">Leaving Date</span>
                    <span className="archive-card__meta-value">{formatDate(employee.leavingDate)}</span>
                  </div>
                  <div className="archive-card__meta-item">
                    <span className="archive-card__meta-label">Leaving Reason</span>
                    <span className="archive-card__meta-value">{employee.leavingReason || 'Not specified'}</span>
                  </div>
                </div>

                <div className="archive-card__footer">
                  <span className="status-badge status-badge--archived">
                    Archived
                  </span>
                  <Link to={`/employees/${employee._id}`} className="primary-button" style={{ padding: '6px 14px', fontSize: '13px' }}>
                    View Record
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Archive;
