import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import '../styles/employeeProfile.scss';
import FeedbackList from '../components/feedback/FeedbackList';
import AddFeedbackModal from '../components/feedback/AddFeedbackModal';
import DocumentList from '../components/documents/DocumentList';
import UploadDocumentModal from '../components/documents/UploadDocumentModal';

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

export const EmployeeEditPlaceholder = () => {
  const { id } = useParams();
  return (
    <div className="employee-profile-page">
      <div className="profile-card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ margin: '0 0 16px 0', color: '#64748b' }}>Editing for employee {id} will be available soon.</p>
        <Link to="/employees" className="primary-button">
          Back to Employees
        </Link>
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

  // Documents UI
  const [showUploadDocument, setShowUploadDocument] = useState(false);
  const [refreshDocumentsKey, setRefreshDocumentsKey] = useState(0);
  const openUploadDocument = () => setShowUploadDocument(true);
  const closeUploadDocument = () => setShowUploadDocument(false);
  const onDocumentUploaded = () => setRefreshDocumentsKey((k) => k + 1);

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

    if (archiving || !employee) return;

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

    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      await axios.patch(
        `${API_BASE}/api/employees/${employee._id}/archive`,
        {
          leavingDate: archiveDate,
          leavingReason: normalizedReason,
          leavingDetails: archiveDetails?.trim() || '',
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
      { label: 'Email', value: employee?.email || 'Not provided' },
      { label: 'Phone', value: employee?.phone || 'Not provided' },
      { label: 'City', value: employee?.city || 'Not provided' },
      { label: 'Address', value: employee?.address || 'Not provided' },
    ],
    [employee]
  );

  const employmentItems = useMemo(() => {
    const items = [
      { label: 'Employee ID', value: employee?.employeeId || 'Not provided' },
      { label: 'Role', value: employee?.role || 'Not provided' },
      { label: 'Department', value: employee?.department || 'Not provided' },
      { label: 'Joining Date', value: formatDate(employee?.joiningDate) },
      { label: 'Reporting To', value: employee?.reportingTo || 'Not provided' },
      { label: 'Current Project', value: employee?.currentProject || 'Not provided' },
      { label: 'Employment Status', value: statusLabel },
    ];

    if (isArchived) {
      items.push({ label: 'Leaving Date', value: formatDate(employee?.leavingDate) });
      items.push({ label: 'Leaving Reason', value: employee?.leavingReason || 'Not provided' });
      items.push({ label: 'Leaving Details', value: employee?.leavingDetails || 'Not provided' });
    }

    return items;
  }, [employee, isArchived, statusLabel]);

  return (
    <div className="employee-profile-page">
      <Toaster position="top-right" />

      {loading ? (
        <div className="profile-card" style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading employee profile...</p>
        </div>
      ) : notFound ? (
        <div className="profile-card" style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Employee not found</h2>
          <p style={{ color: '#64748b', margin: '0 0 16px 0' }}>The employee record you are looking for does not exist.</p>
          <button type="button" className="primary-button" onClick={() => navigate('/employees')}>
            Back to Employees
          </button>
        </div>
      ) : error ? (
        <div className="profile-card" style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#dc2626' }}>Unable to load employee information</h2>
          <button type="button" className="secondary-button" onClick={loadEmployee}>
            Try Again
          </button>
        </div>
      ) : employee ? (
        <>
          {/* Header Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-header__identity">
                {profileImage ? (
                  <img className="profile-avatar" src={profileImage} alt={employee.fullName} />
                ) : (
                  <div className="profile-avatar profile-avatar--fallback">{getInitials(employee.fullName)}</div>
                )}
                <div>
                  <h1>{employee.fullName || 'Employee'}</h1>
                  <p className="profile-role">{employee.role || 'Role not specified'}</p>
                  <div className="profile-meta-row">
                    <span className="profile-pill">{employee.employeeId || 'No ID'}</span>
                    <span className={`status-badge status-badge--${employmentStatus === 'active' ? 'active' : 'leave'}`}>
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
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>archive</span>
                  <span>{isArchived ? 'Archived' : archiving ? 'Archiving...' : 'Archive Employee'}</span>
                </button>
                <Link to={`/employees/${employee._id}/edit`} className="primary-button">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                  <span>Edit Employee</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Info Grids */}
          <div className="profile-grid-two-col">
            <div className="profile-section-card">
              <div className="profile-section-card__heading">
                <h2>Personal Details</h2>
              </div>
              <div className="info-list-stack">
                {infoItems.map((row) => (
                  <div className="info-row-item" key={row.label}>
                    <span className="info-row-label">{row.label}</span>
                    <span className="info-row-value">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-section-card">
              <div className="profile-section-card__heading">
                <h2>Employment Details</h2>
              </div>
              <div className="info-list-stack">
                {employmentItems.map((row) => (
                  <div className="info-row-item" key={row.label}>
                    <span className="info-row-label">{row.label}</span>
                    <span className="info-row-value">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assigned Projects Section */}
          <div className="profile-grid-full">
            <div className="profile-section-card">
              <div className="profile-section-card__heading">
                <h2>Assigned Projects</h2>
              </div>
              {employeeProjectsLoading ? (
                <p style={{ color: '#64748b' }}>Loading assigned projects...</p>
              ) : employeeProjects.length === 0 ? (
                <p style={{ color: '#64748b' }}>No projects currently assigned to this employee.</p>
              ) : (
                <div className="profile-projects-grid">
                  {employeeProjects.map((project) => (
                    <div 
                      key={project._id} 
                      className="profile-project-item"
                      onClick={() => navigate(`/projects/${project._id}`)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 className="profile-project-title">{project.name}</h3>
                        <span className="status-badge status-badge--in-progress">{project.status}</span>
                      </div>
                      <p className="profile-project-desc">{project.description || 'No description provided.'}</p>
                      <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '12px' }}>
                        <span>Start: {formatDate(project.startDate)}</span>
                        <span>End: {formatDate(project.endDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="profile-grid-full">
            <div className="profile-section-card">
              <div className="profile-section-card__heading">
                <h2>Admin Feedback</h2>
                <button type="button" className="primary-button" onClick={openAddFeedback} style={{ padding: '6px 12px', fontSize: '13px' }}>
                  + Add Feedback
                </button>
              </div>
              <FeedbackList key={refreshFeedbackKey} employeeId={employee._id} />
            </div>
          </div>

          {showAddFeedback && (
            <AddFeedbackModal 
              employeeId={employee._id} 
              onClose={closeAddFeedback} 
              onAdded={onFeedbackAdded} 
            />
          )}

          {/* Documents Section */}
          <div className="profile-grid-full">
            <div className="profile-section-card">
              <div className="profile-section-card__heading">
                <h2>Documents &amp; Files</h2>
                <button type="button" className="primary-button" onClick={openUploadDocument} style={{ padding: '6px 12px', fontSize: '13px' }}>
                  + Upload Document
                </button>
              </div>
              <DocumentList key={refreshDocumentsKey} employeeId={employee._id} />
            </div>
          </div>

          {showUploadDocument && (
            <UploadDocumentModal 
              employeeId={employee._id} 
              onClose={closeUploadDocument} 
              onUploaded={onDocumentUploaded} 
            />
          )}
        </>
      ) : null}

      {/* Archive Modal */}
      {showArchiveModal && employee && (
        <div className="archive-modal-backdrop" onClick={() => !archiving && setShowArchiveModal(false)}>
          <div className="archive-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>Archive Employee</h2>
            <p className="archive-modal__copy">
              Are you sure you want to archive <strong>{employee.fullName}</strong>?
            </p>

            <form className="archive-modal__form" onSubmit={handleArchiveSubmit}>
              <label className="archive-modal__field">
                <span>Reason</span>
                <select value={archiveReason} onChange={(e) => setArchiveReason(e.target.value)}>
                  <option value="Resigned">Resigned</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Contract Ended">Contract Ended</option>
                  <option value="Laid Off">Laid Off</option>
                  <option value="Retired">Retired</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              {archiveReason === 'Other' && (
                <label className="archive-modal__field">
                  <span>Custom Reason</span>
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter custom reason"
                  />
                </label>
              )}

              <label className="archive-modal__field">
                <span>Leaving Date</span>
                <input type="date" value={archiveDate} onChange={(e) => setArchiveDate(e.target.value)} required />
              </label>

              <label className="archive-modal__field">
                <span>Additional Details (optional)</span>
                <textarea
                  rows="3"
                  value={archiveDetails}
                  onChange={(e) => setArchiveDetails(e.target.value)}
                  placeholder="Add notes about departure..."
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
      )}
    </div>
  );
};

export default EmployeeProfile;
