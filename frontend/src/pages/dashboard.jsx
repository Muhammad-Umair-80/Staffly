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
        axios.get(`${API_BASE}/api/employees`, { withCredentials: true, headers }),
        axios.get(`${API_BASE}/api/employees?status=archived`, { withCredentials: true, headers }),
        axios.get(`${API_BASE}/api/projects`, { withCredentials: true, headers }),
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
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="dashboard-shell">
      {/* Page Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Overview of your organization, active employees, and ongoing projects.</p>
      </div>

      {/* Statistics Cards */}
      <section className="dashboard-stats">
        {loading ? (
          <div className="stats-grid">
            <div className="stat-card">...</div>
            <div className="stat-card">...</div>
            <div className="stat-card">...</div>
            <div className="stat-card">...</div>
          </div>
        ) : error ? (
          <div className="empty-state">
            <h4>Unable to load dashboard data</h4>
            <p>Please check your connection and try again.</p>
            <button type="button" className="secondary-button" onClick={fetchData}>
              Retry
            </button>
          </div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card__top">
                <div className="stat-card__icon stat-card__icon--blue">
                  <span className="material-symbols-outlined">group</span>
                </div>
              </div>
              <div className="stat-card__value">{stats.totalEmployees}</div>
              <div className="stat-card__label">Total Employees</div>
            </div>

            <div className="stat-card">
              <div className="stat-card__top">
                <div className="stat-card__icon stat-card__icon--emerald">
                  <span className="material-symbols-outlined">person_check</span>
                </div>
              </div>
              <div className="stat-card__value">{stats.activeEmployees}</div>
              <div className="stat-card__label">Active Employees</div>
            </div>

            <div className="stat-card">
              <div className="stat-card__top">
                <div className="stat-card__icon stat-card__icon--red">
                  <span className="material-symbols-outlined">person_off</span>
                </div>
              </div>
              <div className="stat-card__value">{stats.archivedEmployees}</div>
              <div className="stat-card__label">Archived Employees</div>
            </div>

            <div className="stat-card">
              <div className="stat-card__top">
                <div className="stat-card__icon stat-card__icon--amber">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
              </div>
              <div className="stat-card__value">{stats.totalProjects}</div>
              <div className="stat-card__label">Total Projects</div>
            </div>
          </div>
        )}
      </section>

      {/* Quick Actions Bar */}
      <section className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-bar">
          <Link to="/add-employee" className="action-btn action-btn--primary">
            <span className="material-symbols-outlined">person_add</span>
            <span>Add Employee</span>
          </Link>

          <Link to="/employees" className="action-btn action-btn--secondary">
            <span className="material-symbols-outlined">group</span>
            <span>Employees</span>
          </Link>

          <Link to="/projects" className="action-btn action-btn--secondary">
            <span className="material-symbols-outlined">assignment</span>
            <span>Projects</span>
          </Link>

          <Link to="/archived-employees" className="action-btn action-btn--secondary">
            <span className="material-symbols-outlined">archive</span>
            <span>Archive</span>
          </Link>

          <Link to="/admins" className="action-btn action-btn--secondary">
            <span className="material-symbols-outlined">admin_panel_settings</span>
            <span>Admins</span>
          </Link>
        </div>
      </section>

      {/* Bento Grid: Recent Employees & Recently Archived */}
      <div className="bento-grid">
        {/* Recent Employees Data Table */}
        <div className="bento-card">
          <div className="bento-card__header">
            <h3>Recent Employees</h3>
            <button className="text-link" onClick={() => navigate('/employees')}>
              View All
            </button>
          </div>
          <div className="bento-card__body">
            {loading ? (
              <div className="empty-state"><p>Loading employees...</p></div>
            ) : recentEmployees.length === 0 ? (
              <div className="empty-state">
                <h4>No employees yet</h4>
                <p>Start by adding your first employee.</p>
                <Link to="/add-employee" className="primary-button">Add Employee</Link>
              </div>
            ) : (
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joining Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEmployees.map((e) => (
                    <tr 
                      key={e._id} 
                      onClick={() => navigate(`/employees/${e._id}`)} 
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className="user-cell">
                          {e.profileImage?.url ? (
                            <img className="user-cell-avatar" src={e.profileImage.url} alt={e.fullName} />
                          ) : (
                            <div className="user-cell-fallback">
                              {(e.fullName || '').split(' ').map((p) => p[0]).slice(0,2).join('').toUpperCase()}
                            </div>
                          )}
                          <div className="user-cell-meta">
                            <span className="user-cell-name">{e.fullName}</span>
                            <span className="user-cell-email">{e.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>{e.role || '—'}</td>
                      <td>
                        <span className={`status-badge status-badge--${e.employmentStatus === 'active' ? 'active' : 'inactive'}`}>
                          {e.employmentStatus === 'active' ? 'Active' : e.employmentStatus}
                        </span>
                      </td>
                      <td>{e.joiningDate ? new Date(e.joiningDate).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recently Archived Feed */}
        <div className="bento-card">
          <div className="bento-card__header">
            <h3>Recently Archived</h3>
            <button className="text-link" onClick={() => navigate('/archived-employees')}>
              View Archive
            </button>
          </div>
          <div className="bento-card__body">
            {loading ? (
              <div className="empty-state"><p>Loading archive...</p></div>
            ) : recentArchived.length === 0 ? (
              <div className="empty-state">
                <h4>No archived employees</h4>
                <p>Archived employees will appear here.</p>
              </div>
            ) : (
              <ul className="archived-feed">
                {recentArchived.map((a) => (
                  <li key={a._id} className="archived-feed-item">
                    <div className="archived-info">
                      <div className="user-cell-fallback" style={{ width: '32px', height: '32px', fontSize: '11px', backgroundColor: '#fef2f2', color: '#dc2626' }}>
                        {(a.fullName || '').split(' ').map((p) => p[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                      <div className="archived-meta">
                        <strong>{a.fullName}</strong>
                        <span>{a.role || 'Archived'}</span>
                      </div>
                    </div>
                    <div className="archived-date">
                      {a.leavingDate ? new Date(a.leavingDate).toLocaleDateString() : '—'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Recent Projects Cards Grid */}
      <section className="projects-grid-section">
        <div className="bento-card__header" style={{ border: 'none', padding: '0 0 16px 0', background: 'transparent' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Recent Projects</h2>
          <button className="text-link" onClick={() => navigate('/projects')}>
            View All
          </button>
        </div>

        {loading ? (
          <div className="projects-cards-grid">
            <div className="project-bento-card">...</div>
            <div className="project-bento-card">...</div>
            <div className="project-bento-card">...</div>
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="bento-card">
            <div className="empty-state">
              <h4>No projects yet</h4>
              <p>Track team tasks and projects here.</p>
              <Link to="/projects/add" className="primary-button">Add Project</Link>
            </div>
          </div>
        ) : (
          <div className="projects-cards-grid">
            {recentProjects.map((p) => (
              <div 
                key={p._id} 
                className="project-bento-card" 
                onClick={() => navigate(`/projects/${p._id}`)}
              >
                <div>
                  <div className="project-bento-header">
                    <h3 className="project-bento-name">{p.name}</h3>
                    <span className="status-badge status-badge--in-progress">
                      {p.status || 'Active'}
                    </span>
                  </div>
                  <div className="project-bento-date">
                    Start Date: {p.startDate ? new Date(p.startDate).toLocaleDateString() : '—'}
                  </div>
                </div>

                <div className="project-bento-footer">
                  <div className="team-avatar-stack">
                    {(p.assignedEmployees || []).slice(0, 3).map((emp, idx) => (
                      <div 
                        key={emp._id || idx} 
                        className="user-cell-fallback" 
                        style={{ width: '26px', height: '26px', fontSize: '10px', border: '2px solid #fff' }}
                        title={emp.fullName}
                      >
                        {(emp.fullName || 'E')[0]}
                      </div>
                    ))}
                    {(p.assignedEmployees || []).length > 3 && (
                      <div className="avatar-more">
                        +{(p.assignedEmployees || []).length - 3}
                      </div>
                    )}
                  </div>
                  <span className="team-count">
                    {(p.assignedEmployees || []).length} assigned
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
