import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import '../styles/employeeProfile.scss';
import '../styles/ArchivedEmployee.scss';
import '../styles/employees.scss';
import '../styles/projects.scss';
import FeedbackList from '../components/feedback/FeedbackList';
import AddFeedbackModal from '../components/feedback/AddFeedbackModal';

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
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveReason, setArchiveReason] = useState('Resigned');
  const [archiveDate, setArchiveDate] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [archiveDetails, setArchiveDetails] = useState('');
  const [archiving, setArchiving] = useState(false);
  const [employeeProjects, setEmployeeProjects] = useState([]);
  const [employeeProjectsLoading, setEmployeeProjectsLoading] = useState(false);

  // Feedback UI
  const [showAddFeedback, setShowAddFeedback] = useState(false);
  const [refreshFeedbackKey, setRefreshFeedbackKey] = useState(0);
  const openAddFeedback = () => setShowAddFeedback(true);
  const closeAddFeedback = () => setShowAddFeedback(false);
  const onFeedbackAdded = () => setRefreshFeedbackKey((k) => k + 1);


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

  useEffect(() => {
    const loadEmployeeProjects = async () => {
      if (!employee?._id) {
        setEmployeeProjects([]);
        return;
      }

      setEmployeeProjectsLoading(true);
      try {
        const token = window.localStorage.getItem('peoplehub-auth-token');
        const response = await axios.get(`${API_BASE}/api/projects`, {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        const projects = response.data?.projects || [];
        const assignedProjects = projects.filter((project) =>
          (project.assignedEmployees || []).some((assignedEmployee) => assignedEmployee._id === employee._id)
        );
        setEmployeeProjects(assignedProjects);
      } catch (err) {
        setEmployeeProjects([]);
      } finally {
        setEmployeeProjectsLoading(false);
      }
    };

    loadEmployeeProjects();
  }, [employee?._id]);

  const openArchiveModal = () => {
    setArchiveReason('Resigned');
    setCustomReason('');
    setArchiveDetails('');
    setArchiveDate(new Date().toISOString().split('T')[0]);
    setShowArchiveModal(true);
  };

  const handleArchiveSubmit = async (event) => {
    event.preventDefault();

    if (archiving || !employee) {
      return;
    }

    if (!archiveDate) {
      toast.error('Please provide a leaving date.');
      return;
    }

    const normalizedReason = archiveReason === 'Other' ? customReason.trim() : archiveReason;
    if (!normalizedReason) {
      toast.error('Please provide a leaving reason.');
      return;
    }

    setArchiving(true);

    const finalReason = archiveDetails.trim() ? `${normalizedReason} — ${archiveDetails.trim()}` : normalizedReason;

    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      await axios.patch(
        `${API_BASE}/api/employees/${employee._id}/archive`,
        {
          leavingDate: archiveDate,
          leavingReason: finalReason,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      toast.success('Employee archived successfully.');
      setShowArchiveModal(false);
      navigate('/employees');
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to archive employee.';
      toast.error(message);
    } finally {
      setArchiving(false);
    }
  };

  const profileImage = employee?.profileImage?.url;
  const employmentStatus = employee?.employmentStatus || 'active';
  const isArchived = employmentStatus === 'archived';
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

  const employmentItems = useMemo(() => {
    const items = [
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
    ];

    if (isArchived) {
      items.push({
        label: 'Leaving Date',
        value: formatDate(employee?.leavingDate),
      });
      items.push({
        label: 'Leaving Reason',
        value: employee?.leavingReason || 'Not provided',
      });
    }

    return items;
  }, [employee, isArchived, statusLabel]);

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card employee-profile-card">
        <Toaster position="top-right" />
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
              <div className="profile-actions">
                <button
                  type="button"
                  className="danger-button"
                  onClick={openArchiveModal}
                  disabled={isArchived || archiving}
                >
                  {isArchived ? 'Archived' : archiving ? 'Archiving...' : 'Archive Employee'}
                </button>
                <Link to={`/employees/${employee._id}/edit`} className="primary-button" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                  Edit Employee
                </Link>
              </div>
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

            <div className="profile-grid">
              <section className="profile-section">
                <div className="profile-section__heading">
                  <h2>Projects</h2>
                </div>
                {employeeProjectsLoading ? (
                  <div className="content-state">Loading projects...</div>
                ) : employeeProjects.length === 0 ? (
                  <div className="content-state">
                    <p>No projects assigned.</p>
                  </div>
                ) : (
                  <div className="project-grid">
                    {employeeProjects.map((project) => (
                      <div key={project._id} className="project-card">
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Admin Feedback Section */}
            <div className="profile-grid">
              <section className="profile-section">
                <div className="profile-section__heading">
                  <h2>Admin Feedback</h2>
                  <div style={{ marginLeft: 'auto' }}>
                    <button type="button" className="primary-button" onClick={openAddFeedback}>
                      + Add Feedback
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <FeedbackList key={refreshFeedbackKey} employeeId={employee._id} />
                </div>
              </section>
            </div>

            {showAddFeedback && employee ? (
              <AddFeedbackModal employeeId={employee._id} onClose={closeAddFeedback} onAdded={() => {
                onFeedbackAdded();
              }} />
            ) : null}
          </>
        ) : null}

        {showArchiveModal && employee ? (
          <div className="archive-modal-backdrop" onClick={() => !archiving && setShowArchiveModal(false)}>
            <div className="archive-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
              <h2>Archive Employee?</h2>
              <p className="archive-modal__copy">
                Are you sure you want to archive
                <br />
                <strong>{employee.fullName || 'this employee'}?</strong>
              </p>

              <form className="archive-modal__form" onSubmit={handleArchiveSubmit}>
                <label className="archive-modal__field">
                  <span>Reason</span>
                  <select value={archiveReason} onChange={(event) => setArchiveReason(event.target.value)}>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                    <option value="Contract Ended">Contract Ended</option>
                    <option value="Laid Off">Laid Off</option>
                    <option value="Retired">Retired</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                {archiveReason === 'Other' ? (
                  <label className="archive-modal__field">
                    <span>Custom Reason</span>
                    <input
                      type="text"
                      value={customReason}
                      onChange={(event) => setCustomReason(event.target.value)}
                      placeholder="Enter a custom reason"
                    />
                  </label>
                ) : null}

                <label className="archive-modal__field">
                  <span>Leaving Date</span>
                  <input type="date" value={archiveDate} onChange={(event) => setArchiveDate(event.target.value)} required />
                </label>

                <label className="archive-modal__field">
                  <span>Additional Details (optional)</span>
                  <textarea
                    rows="4"
                    value={archiveDetails}
                    onChange={(event) => setArchiveDetails(event.target.value)}
                    placeholder="Add any notes about the departure"
                  />
                </label>

                <div className="archive-modal__actions">
                  <button type="button" className="secondary-button" onClick={() => setShowArchiveModal(false)} disabled={archiving}>
                    Cancel
                  </button>
                  <button type="submit" className="danger-button" disabled={archiving}>
                    {archiving ? 'Archiving...' : 'Archive Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EmployeeProfile;
