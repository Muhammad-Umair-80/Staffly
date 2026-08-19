import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
  if (!parts.length) return 'EM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
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
    <div className="projects-page">
      {loading ? (
        <div className="project-profile-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#64748b' }}>Loading project details...</p>
        </div>
      ) : null}

      {!loading && notFound ? (
        <div className="project-profile-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Project not found</h2>
          <p style={{ color: '#64748b', margin: '0 0 16px 0' }}>The requested project does not exist.</p>
          <button type="button" className="primary-button" onClick={() => navigate('/projects')}>
            Back to Projects
          </button>
        </div>
      ) : null}

      {!loading && error ? (
        <div className="project-profile-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#dc2626' }}>Unable to load project</h2>
          <button type="button" className="secondary-button" onClick={loadProject}>
            Try Again
          </button>
        </div>
      ) : null}

      {!loading && !error && !notFound && project ? (
        <>
          {/* Header Card */}
          <div className="project-profile-card">
            <div className="project-profile-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <h1>{project.name}</h1>
                  <span className={`project-status-pill project-status-pill--${project.status}`}>
                    {project.status}
                  </span>
                </div>
                <p>{project.description || 'No description provided.'}</p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="secondary-button" onClick={() => navigate('/projects')}>
                  Back to Projects
                </button>
                <Link to={`/projects/${project._id}/edit`} className="primary-button">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                  <span>Edit Project</span>
                </Link>
              </div>
            </div>

            {/* Timeline Meta Row */}
            <div className="project-meta-pills" style={{ margin: 0 }}>
              <div className="project-meta-pill-item">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_today</span>
                <span>Start Date: <strong>{formatDate(project.startDate)}</strong></span>
              </div>
              <div className="project-meta-pill-item">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>event</span>
                <span>End Date: <strong>{formatDate(project.endDate)}</strong></span>
              </div>
            </div>
          </div>

          {/* Assigned Team Members Section */}
          <div className="project-profile-card">
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              Assigned Team Members ({project.assignedEmployees?.length || 0})
            </h2>

            {project.assignedEmployees?.length ? (
              <div className="project-assigned-grid">
                {project.assignedEmployees.map((employee) => (
                  <div 
                    key={employee._id} 
                    className="project-assigned-item"
                    onClick={() => navigate(`/employees/${employee._id}`)}
                  >
                    {employee.profileImage?.url ? (
                      <img 
                        src={employee.profileImage.url} 
                        alt={employee.fullName} 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="profile-avatar profile-avatar--fallback" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                        {getInitials(employee.fullName || 'EM')}
                      </div>
                    )}
                    <div>
                      <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{employee.fullName || 'Employee'}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{employee.role || 'Role not provided'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b' }}>No team members assigned to this project yet.</p>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProjectProfile;
