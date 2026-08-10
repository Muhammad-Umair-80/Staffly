import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import '../styles/dashboard.scss';
import '../styles/employees.scss';
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
    <div className="dashboard-shell">
      <Toaster position="top-right" />
      <div className="dashboard-card">
        <div className="dashboard-card__header">
          <div>
            <p className="dashboard-eyebrow">Staffly</p>
            <h1>Add Project</h1>
            <p className="dashboard-subtitle">Create a new project and assign employees.</p>
          </div>
        </div>

        <form className="add-project-form" onSubmit={handleSubmit}>
          <div className="add-project-field">
            <label htmlFor="project-name">Project Name</label>
            <input id="project-name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="PeopleHub" />
          </div>

          <div className="add-project-field">
            <label htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              rows="4"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the project"
            />
          </div>

          <div className="add-project-field">
            <label htmlFor="project-status">Status</label>
            <select id="project-status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On hold</option>
            </select>
          </div>

          <div className="add-project-field">
            <label htmlFor="project-start-date">Start Date</label>
            <input id="project-start-date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </div>

          <div className="add-project-field">
            <label htmlFor="project-end-date">End Date</label>
            <input id="project-end-date" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </div>

          <div className="add-project-field">
            <label>Assign Employees</label>
            {loading ? <p>Loading employees...</p> : null}
            {!loading && employees.length === 0 ? <p>No employees found.</p> : null}
            {!loading && employees.length > 0 ? (
              <div className="employee-select-list">
                {employees.map((employee) => {
                  const checked = selectedEmployees.includes(employee._id);
                  return (
                    <label key={employee._id} className="employee-select-item">
                      <input type="checkbox" checked={checked} onChange={() => toggleEmployee(employee._id)} />
                      <div className="employee-select-meta">
                        {employee.profileImage?.url ? <img src={employee.profileImage.url} alt={employee.fullName} /> : null}
                        <span>{employee.fullName || employee.email}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="archive-modal__actions">
            <button type="button" className="secondary-button" onClick={() => navigate('/projects')}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Creating Project...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
