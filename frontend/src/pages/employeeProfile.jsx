import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/employeeProfile.scss';
import '../styles/ArchivedEmployee.scss';

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

export const EmployeeEditPlaceholder = () => {
  const { id } = useParams();

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card employee-profile-card">
        <div className="content-state">
          
          <p>Editing for employee {id} will be available soon.</p>
          <Link to="/employees" className="primary-button" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            Back to Employees
          </Link>
        </div>
      </div>
    </div>
  );
};

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const loadEmployee = async () => {
    setLoading(true);
    setError(false);
    setNotFound(false);

    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      const response = await axios.get(`${API_BASE}/api/employees/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      const employeeData = response.data?.employee || null;
      setEmployee(employeeData);
      setNotFound(!employeeData);
    } catch (err) {
      if (err?.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(true);
      }
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const profileImage = employee?.profileImage?.url;
  const employmentStatus = employee?.employmentStatus || 'active';
  const statusLabel = employmentStatus === 'on-leave' ? 'On Leave' : employmentStatus === 'archived' ? 'Archived' : 'Active';

  const infoItems = useMemo(
    () => [
      {
        label: 'Email',
        value: employee?.email || 'Not provided',
      },
      {
        label: 'Phone',
        value: employee?.phone || 'Not provided',
      },
      {
        label: 'City',
        value: employee?.city || 'Not provided',
      },
      {
        label: 'Address',
        value: employee?.address || 'Not provided',
      },
    ],
    [employee]
  );

  const employmentItems = useMemo(
    () => [
      {
        label: 'Employee ID',
        value: employee?.employeeId || 'Not provided',
      },
      {
        label: 'Role',
        value: employee?.role || 'Not provided',
      },
      {
        label: 'Department',
        value: employee?.department || 'Not provided',
      },
      {
        label: 'Joining Date',
        value: formatDate(employee?.joiningDate),
      },
      {
        label: 'Reporting To',
        value: employee?.reportingTo || 'Not provided',
      },
      {
        label: 'Current Project',
        value: employee?.currentProject || 'Not provided',
      },
      {
        label: 'Employment Status',
        value: statusLabel,
      },
    ],
    [employee, statusLabel]
  );

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card employee-profile-card">
        {loading ? (
          <div className="profile-loading" aria-live="polite">
            <div className="profile-loading__header" />
            <div className="profile-loading__content" />
            <div className="profile-loading__content" />
          </div>
        ) : null}

        {!loading && notFound ? (
          <div className="content-state">
            <h2>Employee not found</h2>
            <p>The employee you're looking for does not exist.</p>
            <button type="button" className="primary-button" onClick={() => navigate('/employees')}>
              Back to Employees
            </button>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="content-state content-state--error">
            <h2>Unable to load employee information.</h2>
            <button type="button" className="secondary-button" onClick={loadEmployee}>
              Try Again
            </button>
          </div>
        ) : null}

        {!loading && !notFound && !error && employee ? (
          <>
            <div className="profile-header">
              <div className="profile-header__identity">
                {profileImage ? (
                  <img className="profile-avatar" src={profileImage} alt={employee.fullName} />
                ) : (
                  <div className="profile-avatar profile-avatar--fallback">{getInitials(employee.fullName)}</div>
                )}
                <div>
                  <p className="dashboard-eyebrow">PeopleHub</p>
                  <h1>{employee.fullName || 'Employee'}</h1>
                  <p className="profile-role">{employee.role || 'Role not provided'}</p>
                  <div className="profile-meta-row">
                    <span className="profile-pill">{employee.employeeId || 'Not provided'}</span>
                    <span className={`employee-status employee-status--${employmentStatus === 'active' ? 'active' : 'neutral'}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              </div>
                 <Link to={`/archived-employees/${employee._id}/edit`} className="archive-button" style={{ textDecoration: 'none', display: 'inline-flex' ,color: '#fdfdfd', backgroundColor: '#f44336', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer'}}>
                Archive Employee
              </Link>
              <Link to={`/employees/${employee._id}/edit`} className="primary-button" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                Edit Employee
              </Link>
            </div>

            <div className="profile-grid">
              <section className="profile-section">
                <div className="profile-section__heading">
                  <h2>Personal Information</h2>
                </div>
                <div className="profile-info-list">
                  {infoItems.map((row) => (
                    <div className="profile-info-row" key={row.label}>
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="profile-section">
                <div className="profile-section__heading">
                  <h2>Employment Information</h2>
                </div>
                <div className="profile-info-list">
                  {employmentItems.map((row) => (
                    <div className="profile-info-row" key={row.label}>
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EmployeeProfile;
