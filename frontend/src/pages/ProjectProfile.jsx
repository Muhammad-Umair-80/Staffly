import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

const ProjectProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const loadProject = async () => {
    setLoading(true);
    setError(false);
    setNotFound(false);
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      const response = await axios.get(`${API_BASE}/api/projects/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      setProject(response.data?.project || null);
      setNotFound(!response.data?.project);
    } catch (err) {
      if (err?.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(true);
      }
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card">
        {loading ? <div className="content-state">Loading project...</div> : null}

        {!loading && notFound ? (
          <div className="content-state">
            <h2>Project not found</h2>
            <p>The project you're looking for does not exist.</p>
            <button type="button" className="primary-button" onClick={() => navigate('/projects')}>
              Back to Projects
            </button>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="content-state content-state--error">
            <h2>Unable to load project.</h2>
            <button type="button" className="secondary-button" onClick={loadProject}>
              Try Again
            </button>
          </div>
        ) : null}

        {!loading && !error && !notFound && project ? (
          <>
            <div className="dashboard-card__header">
              <div>
                <p className="dashboard-eyebrow">Staffly</p>
                <h1>{project.name}</h1>
                <p className="dashboard-subtitle">Project overview and assigned employees.</p>
              </div>
              <div className="profile-actions">
                <button type="button" className="secondary-button" onClick={() => navigate('/projects')}>
                  Back to Projects
                </button>
                <button type="button" className="primary-button" onClick={() => navigate(`/projects/${project._id}/edit`)}>
                  Edit Project
                </button>
              </div>
            </div>

            <div className="project-detail-card">
              <div className="project-detail-row">
                <span>Description</span>
                <strong>{project.description || 'No description provided.'}</strong>
              </div>
              <div className="project-detail-row">
                <span>Status</span>
                <strong>{project.status}</strong>
              </div>
              <div className="project-detail-row">
                <span>Start Date</span>
                <strong>{formatDate(project.startDate)}</strong>
              </div>
              <div className="project-detail-row">
                <span>End Date</span>
                <strong>{formatDate(project.endDate)}</strong>
              </div>
            </div>

            <div className="project-detail-card" style={{ marginTop: 16 }}>
              <div className="dashboard-card__header" style={{ marginBottom: 12 }}>
                <h2 style={{ margin: 0 }}>Assigned Employees</h2>
              </div>
              {project.assignedEmployees?.length ? (
                <div className="project-grid">
                  {project.assignedEmployees.map((employee) => (
                    <div key={employee._id} className="project-card">
                      <div className="project-card__header" style={{ marginBottom: 0 }}>
                        <div>
                          <h2>{employee.fullName || 'Employee'}</h2>
                          <p>{employee.role || 'Role not provided'}</p>
                        </div>
                        <span className="project-list-chip">{employee.employeeId || 'Employee'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No employees assigned.</p>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectProfile;
