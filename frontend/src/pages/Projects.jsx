import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/dashboard.scss';
import '../styles/employees.scss';
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
    <div className="dashboard-shell">
      <div className="dashboard-card">
        <div className="dashboard-card__header">
          <div>
            <p className="dashboard-eyebrow">Staffly</p>
            <h1>Projects</h1>
            <p className="dashboard-subtitle">Manage company projects and team assignments.</p>
          </div>
          <Link to="/projects/add" className="primary-button" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            + Add Project
          </Link>
        </div>

        {loading ? (
          <div className="content-state">Loading projects...</div>
        ) : null}

        {!loading && error ? (
          <div className="content-state content-state--error">
            <h2>Unable to load projects.</h2>
            <button type="button" className="secondary-button" onClick={loadProjects}>
              Try Again
            </button>
          </div>
        ) : null}

        {!loading && !error && projects.length === 0 ? (
          <div className="content-state">
            <h2>No projects yet.</h2>
            <p>Create your first project to get started.</p>
            <Link to="/projects/add" className="primary-button" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              Add Project
            </Link>
          </div>
        ) : null}

        {!loading && !error && projects.length > 0 ? (
          <div className="project-grid">
            {projects.map((project) => (
              <div className="project-card" key={project._id}>
                <div className="project-card__header">
                  <div>
                    <h2>{project.name}</h2>
                    <p>{project.description || 'No description provided.'}</p>
                  </div>
                  <span className={`project-status project-status--${project.status}`}>{project.status}</span>
                </div>

                <div className="project-meta">
                  <span>Start: {formatDate(project.startDate)}</span>
                  <span>End: {formatDate(project.endDate)}</span>
                  <span>{project.assignedEmployees?.length || 0} assigned</span>
                </div>

                <div className="project-footer">
                  <div className="project-assignees">
                    {(project.assignedEmployees || []).slice(0, 5).map((employee) => (
                      <div key={employee._id} className="project-assignee" title={employee.fullName || 'Employee'}>
                        {employee.profileImage?.url ? (
                          <img className="project-assignee project-assignee--image" src={employee.profileImage.url} alt={employee.fullName || 'Employee'} />
                        ) : (
                          getInitials(employee.fullName || 'Employee')
                        )}
                      </div>
                    ))}
                  </div>
                  <Link to={`/projects/${project._id}`} className="secondary-button" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Projects;
