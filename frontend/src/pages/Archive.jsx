import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/dashboard.scss';
import '../styles/employees.scss';
import '../styles/archive.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const formatDate = (value) => {
  if (!value) {
    return 'Not provided';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Not provided';
  }

  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return 'EM';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

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
    <div className="dashboard-shell">
      <div className="dashboard-card employees-card">
        <div className="dashboard-card__header employees-card__header">
          <div>
            <p className="dashboard-eyebrow">Staffly</p>
            <h1>Archive</h1>
            <p className="dashboard-subtitle">View all archived employees.</p>
          </div>
          <Link to="/employees" className="secondary-button" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            Back to Employees
          </Link>
        </div>

        {loading ? (
          <div className="list-loading" aria-live="polite">
            <div className="list-loading__row" />
            <div className="list-loading__row" />
            <div className="list-loading__row" />
          </div>
        ) : null}

        {!loading && error ? (
          <div className="content-state content-state--error">
            <p>Unable to load archived employees.</p>
            <button type="button" className="secondary-button" onClick={loadArchivedEmployees}>
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !error && employees.length === 0 ? (
          <div className="content-state">
            <h2>No archived employees</h2>
            <p>Archived employees will appear here once they are moved off the active directory.</p>
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
                      <img className="employee-avatar" src={profileImage} alt={employee.fullName} />
                    ) : (
                      <div className="employee-avatar employee-avatar--fallback">{getInitials(employee.fullName)}</div>
                    )}
                    <div>
                      <h3>{employee.fullName}</h3>
                      <p>{employee.role || 'Role not provided'}</p>
                    </div>
                  </div>

                  <div className="archive-card__meta">
                    <div>
                      <span>Employee ID</span>
                      <strong>{employee.employeeId || 'Not provided'}</strong>
                    </div>
                    <div>
                      <span>Department</span>
                      <strong>{employee.department || 'Not provided'}</strong>
                    </div>
                    <div>
                      <span>Joining Date</span>
                      <strong>{formatDate(employee.joiningDate)}</strong>
                    </div>
                    <div>
                      <span>Leaving Date</span>
                      <strong>{formatDate(employee.leavingDate)}</strong>
                    </div>
                    <div>
                      <span>Leaving Reason</span>
                      <strong>{employee.leavingReason || 'Not provided'}</strong>
                    </div>
                    <div>
                      <span>Leaving Details</span>
                      <strong>{employee.leavingDetails || 'Not provided'}</strong>
                    </div>
                    <div>
                      <span>Status</span>
                      <strong>Archived</strong>
                    </div>
                  </div>

                  <div className="archive-card__actions">
                    <span className="employee-status employee-status--neutral">Archived</span>
                    <Link to={`/employees/${employee._id}`} className="text-link">
                      View
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Archive;
