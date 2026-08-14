import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/dashboard.scss';
import '../styles/employees.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

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

const normalizeStatus = (value = '') => {
  const normalized = String(value).toLowerCase();

  if (normalized === 'on-leave') {
    return 'on leave';
  }

  return normalized || 'active';
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    setError(false);

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
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      const resp = await axios.get(`${API_BASE}/api/projects`, {
        withCredentials: true,
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      setProjects(resp.data?.projects || []);
    } catch (err) {
      setProjects([]);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadProjects();
  }, []);

  const availableRoles = useMemo(() => {
    const set = new Set();
    employees.forEach((e) => e.role && set.add(e.role));
    return Array.from(set).sort();
  }, [employees]);

  const visibleEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      // Handle archived filter: if archived selected show only archived, otherwise hide archived by default
      if (statusFilter === 'archived') {
        if (employee.employmentStatus !== 'archived') return false;
      } else {
        if (employee.employmentStatus === 'archived') return false;
      }

      const empStatusNormalized = normalizeStatus(employee.employmentStatus);
      const matchesStatus = statusFilter === 'all' || empStatusNormalized === statusFilter;

      const matchesRole = roleFilter === 'all' || (employee.role && employee.role === roleFilter);

      const projectNameForEmp = employee.currentProject || '';
      const matchesProject = projectFilter === 'all' || (projectFilter && projectFilter === projectNameForEmp);

      const searchableText = [
        employee.fullName,
        employee.employeeId,
        employee.email,
        employee.role,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesQuery = !query || searchableText.includes(query);

      return matchesStatus && matchesRole && matchesProject && matchesQuery;
    });
  }, [employees, search, statusFilter, roleFilter, projectFilter]);

  const showEmptyState = !loading && !error && employees.length === 0;
  const showFilteredEmptyState = !loading && !error && employees.length > 0 && visibleEmployees.length === 0;

  const anyFilterActive = () => {
    return (
      search.trim() !== '' ||
      statusFilter !== 'all' ||
      roleFilter !== 'all' ||
      projectFilter !== 'all'
    );
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setRoleFilter('all');
    setProjectFilter('all');
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card employees-card">
        <div className="dashboard-card__header employees-card__header">
          <div>
            <p className="dashboard-eyebrow">Staffly</p>
            <h1>Employees</h1>
            <p className="dashboard-subtitle">Manage all employees in one place.</p>
          </div>
          <Link to="/add-employee" className="primary-button" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            + Add Employee
          </Link>
        </div>

        <div className="employees-toolbar">
          <label className="employees-search">
            <span className="visually-hidden">Search employees</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employees..."
            />
          </label>

          <label className="employees-select">
            <span className="visually-hidden">Filter by status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="on leave">On Leave</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="employees-select">
            <span className="visually-hidden">Filter by role</span>
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="all">All Roles</option>
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="employees-select">
            <span className="visually-hidden">Filter by project</span>
            <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)}>
              <option value="all">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {anyFilterActive() ? (
            <button type="button" className="secondary-button" onClick={clearFilters}>
              Clear Filters
            </button>
          ) : null}
        </div>

        {loading ? (
          <div className="list-loading" aria-live="polite">
            <div className="list-loading__row" />
            <div className="list-loading__row" />
            <div className="list-loading__row" />
          </div>
        ) : null}

        {!loading && error ? (
          <div className="content-state content-state--error">
            <p>Unable to load employees.</p>
            <button type="button" className="secondary-button" onClick={loadEmployees}>
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !error && showEmptyState ? (
          <div className="content-state">
            <h2>No employees yet</h2>
            <p>Start by adding your first employee.</p>
            <Link to="/add-employee" className="primary-button" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              Add Employee
            </Link>
          </div>
        ) : null}

        {!loading && !error && showFilteredEmptyState ? (
          <div className="content-state">
            <h2>No employees found</h2>
            <p>Try a different search or filter.</p>
            <button type="button" className="secondary-button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : null}

        {!loading && !error && !showEmptyState && !showFilteredEmptyState ? (
          <>
            <div className="employees-table-wrapper">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Employee ID</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>City</th>
                    <th>Current Project</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEmployees.map((employee) => {
                    const statusLabel = normalizeStatus(employee.employmentStatus);
                    const profileImage = employee.profileImage?.url;

                    return (
                      <tr key={employee._id}>
                        <td>
                          {profileImage ? (
                            <img className="employee-avatar" src={profileImage} alt={employee.fullName} />
                          ) : (
                            <div className="employee-avatar employee-avatar--fallback">{getInitials(employee.fullName)}</div>
                          )}
                        </td>
                        <td>
                          <div className="employee-name-block">
                            <strong>{employee.fullName}</strong>
                            <span>{employee.email}</span>
                          </div>
                        </td>
                        <td>{employee.employeeId}</td>
                        <td>{employee.role}</td>
                        <td>{employee.department}</td>
                        <td>{employee.city}</td>
                        <td>{employee.currentProject || '—'}</td>
                        <td>
                          <span className={`employee-status employee-status--${statusLabel === 'active' ? 'active' : 'neutral'}`}>
                            {statusLabel === 'active' ? 'Active' : 'On Leave'}
                          </span>
                        </td>
                        <td>
                          <div className="employee-actions">
                            <Link to={`/employees/${employee._id}`} className="text-link">
                              View
                            </Link>
                            <Link to={`/employees/${employee._id}/edit`} className="text-link">
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="employees-mobile-list">
              {visibleEmployees.map((employee) => {
                const statusLabel = normalizeStatus(employee.employmentStatus);
                const profileImage = employee.profileImage?.url;

                return (
                  <div className="employee-card" key={employee._id}>
                    <div className="employee-card__top">
                      {profileImage ? (
                        <img className="employee-avatar" src={profileImage} alt={employee.fullName} />
                      ) : (
                        <div className="employee-avatar employee-avatar--fallback">{getInitials(employee.fullName)}</div>
                      )}
                      <div>
                        <h3>{employee.fullName}</h3>
                        <p>{employee.role}</p>
                      </div>
                    </div>
                    <div className="employee-card__meta">
                      <span><strong>ID:</strong> {employee.employeeId}</span>
                      <span><strong>Department:</strong> {employee.department}</span>
                      <span><strong>City:</strong> {employee.city}</span>
                      <span><strong>Status:</strong> {statusLabel === 'active' ? 'Active' : 'On Leave'}</span>
                    </div>
                    <div className="employee-card__actions">
                      <Link to={`/employees/${employee._id}`} className="text-link">
                        View
                      </Link>
                      <Link to={`/employees/${employee._id}/edit`} className="text-link">
                        Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Employees;
