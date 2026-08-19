import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import '../styles/addEmployee.scss';
import '../styles/projects.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const AddProject = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      const response = await axios.get(`${API_BASE}/api/employees`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      setEmployees(response.data?.employees || []);
    } catch (err) {
      toast.error('Unable to load employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const toggleEmployee = (employeeId) => {
    setSelectedEmployees((current) =>
      current.includes(employeeId) ? current.filter((id) => id !== employeeId) : [...current, employeeId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (!name.trim()) {
      toast.error('Project name is required.');
      return;
    }

    if (!startDate) {
      toast.error('Start date is required.');
      return;
    }

    setSubmitting(true);
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      await axios.post(
        `${API_BASE}/api/projects`,
        {
          name: name.trim(),
          description: description.trim(),
          status,
          startDate,
          endDate: endDate || null,
          assignedEmployees: selectedEmployees,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      toast.success('Project created successfully.');
      navigate('/projects');
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to create project.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-employee-page">
      <Toaster position="top-right" />

      {/* Header Card */}
      <div className="form-header-card">
        <h1>Create New Project</h1>
        <p>Define project scope, timelines, status, and assign team members.</p>
      </div>

      <form className="add-employee-form" onSubmit={handleSubmit}>
        <section className="form-section-card">
          <h2 className="form-section-card__title">Project Information</h2>

          <div className="form-grid-two-col">
            <div className="field-group field-group--full">
              <label htmlFor="project-name">Project Name *</label>
              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Staffly SaaS Mobile App"
                required
              />
            </div>

            <div className="field-group field-group--full">
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe project key deliverables and scope..."
              />
            </div>

            <div className="field-group">
              <label htmlFor="project-status">Project Status *</label>
              <select id="project-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="project-start-date">Start Date *</label>
              <input
                id="project-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="field-group field-group--full">
              <label htmlFor="project-end-date">Estimated End Date</label>
              <input
                id="project-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Team Assignments Section */}
        <section className="form-section-card">
          <h2 className="form-section-card__title">Assign Team Members</h2>

          {loading ? (
            <p style={{ color: '#64748b' }}>Loading employees...</p>
          ) : employees.length === 0 ? (
            <p style={{ color: '#64748b' }}>No employees available to assign.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
              {employees.map((employee) => {
                const checked = selectedEmployees.includes(employee._id);
                return (
                  <label
                    key={employee._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      border: checked ? '1px solid var(--primary, #2563eb)' : '1px solid #e2e8f0',
                      backgroundColor: checked ? '#eff6ff' : '#ffffff',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleEmployee(employee._id)}
                      style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {employee.profileImage?.url ? (
                        <img src={employee.profileImage.url} alt={employee.fullName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div className="profile-avatar profile-avatar--fallback" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                          {(employee.fullName || 'EM').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{employee.fullName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{employee.role || 'Employee'}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <div className="form-actions-row">
          <Link to="/projects" className="secondary-button">
            Cancel
          </Link>
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? 'Creating Project...' : 'Create & Launch Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
