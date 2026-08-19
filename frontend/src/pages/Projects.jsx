import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/projects.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const formatDate = (value) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not set';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'PR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    setError(false);
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      const response = await axios.get(`${API_BASE}/api/projects`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      setProjects(response.data?.projects || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="projects-page">
      {/* Header Row */}
      <div className="projects-header-row">
        <div>
          <h1>Projects Directory</h1>
          <p>Track active projects, deadlines, and assigned team members.</p>
        </div>
        <Link to="/projects/add" className="primary-button">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          <span>Add Project</span>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading projects...</div>
      ) : null}

      {!loading && error ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
          <h2>Unable to load projects</h2>
          <button type="button" className="secondary-button" onClick={loadProjects} style={{ marginTop: '12px' }}>
            Try Again
          </button>
        </div>
      ) : null}

      {!loading && !error && projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h2>No projects created yet</h2>
          <p style={{ color: '#64748b', margin: '8px 0 16px 0' }}>Get started by adding your first project.</p>
          <Link to="/projects/add" className="primary-button">
            Add Project
          </Link>
        </div>
      ) : null}

      {!loading && !error && projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <div 
              className="project-card" 
              key={project._id}
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <div>
                <div className="project-card__top">
                  <h2 className="project-card__title">{project.name}</h2>
                  <span className={`project-status-pill project-status-pill--${project.status}`}>
                    {project.status}
                  </span>
                </div>
                <p className="project-card__desc">{project.description || 'No description provided.'}</p>

                <div className="project-meta-pills">
                  <div className="project-meta-pill-item">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_today</span>
                    <span>Start: {formatDate(project.startDate)}</span>
                  </div>
                  <div className="project-meta-pill-item">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>event</span>
                    <span>End: {formatDate(project.endDate)}</span>
                  </div>
                </div>
              </div>

              <div className="project-card__footer">
                <div className="assignees-avatar-stack">
                  {(project.assignedEmployees || []).slice(0, 4).map((employee) => (
                    employee.profileImage?.url ? (
                      <img 
                        key={employee._id} 
                        className="assignee-avatar-bubble" 
                        src={employee.profileImage.url} 
                        alt={employee.fullName || 'Employee'} 
                        title={employee.fullName || 'Employee'}
                      />
                    ) : (
                      <div 
                        key={employee._id} 
                        className="assignee-avatar-bubble" 
                        title={employee.fullName || 'Employee'}
                      >
                        {getInitials(employee.fullName || 'EM')}
                      </div>
                    )
                  ))}
                  {(project.assignedEmployees?.length || 0) > 4 && (
                    <span className="assignee-count-badge">+{project.assignedEmployees.length - 4} more</span>
                  )}
                </div>

                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary, #2563eb)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  View details
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Projects;
