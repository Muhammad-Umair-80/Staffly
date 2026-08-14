import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/dashboard.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [employees, setEmployees] = useState([]); // non-archived
  const [archived, setArchived] = useState([]);
  const [projects, setProjects] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(false);

    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [empResp, archivedResp, projResp] = await Promise.all([
        axios.get(
          `${API_BASE}/api/employees`,
          { withCredentials: true, headers }
        ),
        axios.get(
          `${API_BASE}/api/employees?status=archived`,
          { withCredentials: true, headers }
        ),
        axios.get(
          `${API_BASE}/api/projects`,
          { withCredentials: true, headers }
        ),
      ]);

      setEmployees(empResp.data?.employees || []);
      setArchived(archivedResp.data?.employees || []);
      setProjects(projResp.data?.projects || []);
    } catch (err) {
      console.error('Unable to load dashboard data', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const active = employees.length;
    const archivedCount = archived.length;
    const total = active + archivedCount;
    const totalProjects = projects.length;

    return {
      totalEmployees: total,
      activeEmployees: active,
      archivedEmployees: archivedCount,
      totalProjects,
    };
  }, [employees, archived, projects]);

  const recentEmployees = employees.slice(0, 5);
  const recentArchived = archived.slice(0, 5);
  const recentProjects = projects.slice(0, 5);

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card">
        <div className="dashboard-card__header">
          <div>
            <p className="dashboard-eyebrow">Staffly</p>
            <h1>Admin Dashboard</h1>
            <p className="dashboard-subtitle">Overview of employees and projects.</p>
          </div>
        </div>

        {/* Statistics */}
        <section className="dashboard-stats">
          {loading ? (
            <div className="stats-row">
              <div className="stat-card">...</div>
              <div className="stat-card">...</div>
              <div className="stat-card">...</div>
              <div className="stat-card">...</div>
            </div>
          ) : error ? (
            <div className="content-state content-state--error">
              <p>Unable to load dashboard data.</p>
              <button type="button" className="secondary-button" onClick={fetchData}>
                Retry
              </button>
            </div>
          ) : (
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-card__title">Total Employees</div>
                <div className="stat-card__value">{stats.totalEmployees}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__title">Active Employees</div>
                <div className="stat-card__value">{stats.activeEmployees}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__title">Archived Employees</div>
                <div className="stat-card__value">{stats.archivedEmployees}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__title">Total Projects</div>
                <div className="stat-card__value">{stats.totalProjects}</div>
              </div>
            </div>
          )}
        </section>

        {/* Main content: Quick actions + recent lists */}
        <div className="dashboard-main">
          <div className="dashboard-actions">
            <Link to="/add-employee" className="dashboard-action-card">
              <h2>Add employee</h2>
              <p>Create a new employee profile and upload a profile image.</p>
            </Link>
            <Link to="/employees" className="dashboard-action-card">
              <h2>Employees</h2>
              <p>View the employee directory and manage employee records.</p>
            </Link>
            <Link to="/archive" className="dashboard-action-card">
              <h2>Archive</h2>
              <p>Review archived employees and their leaving details.</p>
            </Link>
            <Link to="/projects" className="dashboard-action-card">
              <h2>Projects</h2>
              <p>Track company projects and employee assignments.</p>
            </Link>
            <Link to="/admins" className="dashboard-action-card">
              <h2>Admins</h2>
              <p>Manage system administrators.</p>
            </Link>
          </div>

          <div className="dashboard-lists">
            <div className="list-card">
              <div className="list-card__header">
                <h3>Recent Employees</h3>
                <button className="text-link" onClick={() => navigate('/employees')}>
                  View All
                </button>
              </div>

              {loading ? (
                <div className="list-loading">
                  <div className="list-loading__row" />
                  <div className="list-loading__row" />
                  <div className="list-loading__row" />
                </div>
              ) : recentEmployees.length === 0 ? (
                <div className="content-state">
                  <h4>No employees yet</h4>
                  <p>Start by adding your first employee.</p>
                  <Link to="/add-employee" className="primary-button">
                    Add Employee
                  </Link>
                </div>
              ) : (
                <ul className="recent-list">
                  {recentEmployees.map((e) => (
                    <li key={e._id} className="recent-list__item">
                      <div className="recent-list__photo">
                        {e.profileImage?.url ? (
                          // eslint-disable-next-line jsx-a11y/img-redundant-alt
                          <img src={e.profileImage.url} alt={`Photo of ${e.fullName}`} />
                        ) : (
                          <div className="avatar-fallback">{(e.fullName || '').split(' ').map((p) => p[0]).slice(0,2).join('').toUpperCase()}</div>
                        )}
                      </div>
                      <div className="recent-list__meta">
                        <strong>{e.fullName}</strong>
                        <span>{e.role || '—'}</span>
                      </div>
                      <div className="recent-list__status">
                        <span className={`employee-status employee-status--${e.employmentStatus === 'active' ? 'active' : 'neutral'}`}>
                          {e.employmentStatus === 'active' ? 'Active' : e.employmentStatus}
                        </span>
                        <small>{e.joiningDate ? new Date(e.joiningDate).toLocaleDateString() : ''}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="list-card">
              <div className="list-card__header">
                <h3>Recent Projects</h3>
                <button className="text-link" onClick={() => navigate('/projects')}>
                  View All
                </button>
              </div>

              {loading ? (
                <div className="list-loading">
                  <div className="list-loading__row" />
                  <div className="list-loading__row" />
                </div>
              ) : recentProjects.length === 0 ? (
                <div className="content-state">
                  <h4>No projects yet</h4>
                  <p>Create your first project.</p>
                  <Link to="/add-project" className="primary-button">
                    Add Project
                  </Link>
                </div>
              ) : (
                <ul className="recent-list recent-projects">
                  {recentProjects.map((p) => (
                    <li key={p._id} className="recent-list__item recent-project-item" onClick={() => navigate(`/projects/${p._id}`)}>
                      <div className="recent-list__meta">
                        <strong>{p.name}</strong>
                        <span className="muted">{p.status}</span>
                      </div>
                      <div className="recent-list__status">
                        <small>Start: {p.startDate ? new Date(p.startDate).toLocaleDateString() : '—'}</small>
                        <small>{(p.assignedEmployees || []).length} assigned</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="list-card">
              <div className="list-card__header">
                <h3>Recently Archived</h3>
                <button className="text-link" onClick={() => navigate('/archive')}>
                  View Archive
                </button>
              </div>

              {loading ? (
                <div className="list-loading">
                  <div className="list-loading__row" />
                  <div className="list-loading__row" />
                </div>
              ) : recentArchived.length === 0 ? (
                <div className="content-state">
                  <h4>No archived employees</h4>
                </div>
              ) : (
                <ul className="recent-list">
                  {recentArchived.map((a) => (
                    <li key={a._id} className="recent-list__item">
                      <div className="recent-list__photo">
                        {a.profileImage?.url ? (
                          // eslint-disable-next-line jsx-a11y/img-redundant-alt
                          <img src={a.profileImage.url} alt={`Photo of ${a.fullName}`} />
                        ) : (
                          <div className="avatar-fallback">{(a.fullName || '').split(' ').map((p) => p[0]).slice(0,2).join('').toUpperCase()}</div>
                        )}
                      </div>
                      <div className="recent-list__meta">
                        <strong>{a.fullName}</strong>
                        <span>{a.role || '—'}</span>
                      </div>
                      <div className="recent-list__status">
                        <small>Left: {a.leavingDate ? new Date(a.leavingDate).toLocaleDateString() : '—'}</small>
                        <small>{a.leavingReason || ''}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
