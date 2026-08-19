import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/employees.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'EM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const normalizeStatus = (value = '') => {
  const normalized = String(value).toLowerCase();
  if (normalized === 'on-leave') return 'on leave';
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
    <div className="employees-page">
      {/* Header Row */}
      <div className="employees-header-row">
        <div className="employees-header-title">
          <h1>Employees Directory</h1>
          <p>Manage and view all employee records across departments.</p>
        </div>
        <Link to="/add-employee" className="primary-button">
          <span className="material-symbols-outlined">person_add</span>
          <span>Add Employee</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar Card */}
      <div className="employees-filter-card">
        <div className="employees-toolbar">
          <div className="search-input-wrapper">
            <span className="material-symbols-outlined">search</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, email, or role..."
            />
          </div>

          <select 
            className="filter-select" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="on leave">On Leave</option>
            <option value="archived">Archived</option>
          </select>

          <select 
            className="filter-select" 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            {availableRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select 
            className="filter-select" 
            value={projectFilter} 
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          {anyFilterActive() && (
            <button type="button" className="secondary-button" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="table-card" style={{ padding: '32px', textAlign: 'center' }}>
          <p>Loading employees directory...</p>
        </div>
      ) : error ? (
        <div className="table-card" style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: '#dc2626' }}>Unable to load employees.</p>
          <button type="button" className="secondary-button" onClick={loadEmployees} style={{ marginTop: '12px' }}>
            Retry
          </button>
        </div>
      ) : showEmptyState ? (
        <div className="table-card" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 6px 0' }}>No employees yet</h2>
          <p style={{ color: '#64748b', margin: '0 0 16px 0' }}>Start by adding your first employee to Staffly.</p>
          <Link to="/add-employee" className="primary-button">
            Add Employee
          </Link>
        </div>
      ) : showFilteredEmptyState ? (
        <div className="table-card" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 6px 0' }}>No matching employees</h2>
          <p style={{ color: '#64748b', margin: '0 0 16px 0' }}>Try adjusting your search criteria or clearing filters.</p>
          <button type="button" className="secondary-button" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="table-card">
            <div className="employees-table-wrapper">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>ID &amp; Role</th>
                    <th>Department &amp; City</th>
                    <th>Current Project</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEmployees.map((employee) => {
                    const statusLabel = normalizeStatus(employee.employmentStatus);
                    const profileImage = employee.profileImage?.url;

                    return (
                      <tr key={employee._id}>
                        <td>
                          <div className="employee-cell">
                            {profileImage ? (
                              <img className="employee-avatar" src={profileImage} alt={employee.fullName} />
                            ) : (
                              <div className="employee-avatar--fallback">{getInitials(employee.fullName)}</div>
                            )}
                            <div className="employee-info-stack">
                              <span className="employee-name">{employee.fullName}</span>
                              <span className="employee-email">{employee.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="employee-info-stack">
                            <span style={{ fontWeight: 600 }}>{employee.employeeId}</span>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>{employee.role || '—'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="employee-info-stack">
                            <span>{employee.department || '—'}</span>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>{employee.city || '—'}</span>
                          </div>
                        </td>
                        <td>{employee.currentProject || '—'}</td>
                        <td>
                          <span className={`status-badge status-badge--${statusLabel === 'active' ? 'active' : 'leave'}`}>
                            {statusLabel === 'active' ? 'Active' : 'On Leave'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                            <Link to={`/employees/${employee._id}`} className="secondary-button" style={{ padding: '6px 12px', fontSize: '13px' }}>
                              View
                            </Link>
                            <Link to={`/employees/${employee._id}/edit`} className="secondary-button" style={{ padding: '6px 12px', fontSize: '13px' }}>
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
          </div>

          {/* Mobile Card List View */}
          <div className="employees-mobile-list">
            {visibleEmployees.map((employee) => {
              const statusLabel = normalizeStatus(employee.employmentStatus);
              const profileImage = employee.profileImage?.url;

              return (
                <div className="employee-card-mobile" key={employee._id}>
                  <div className="employee-card-mobile__header">
                    {profileImage ? (
                      <img className="employee-avatar" src={profileImage} alt={employee.fullName} />
                    ) : (
                      <div className="employee-avatar--fallback">{getInitials(employee.fullName)}</div>
                    )}
                    <div>
                      <h3>{employee.fullName}</h3>
                      <p>{employee.role || '—'}</p>
                    </div>
                  </div>
                  <div className="employee-card-mobile__meta">
                    <div><strong>ID:</strong> {employee.employeeId}</div>
                    <div><strong>Dept:</strong> {employee.department || '—'}</div>
                    <div><strong>City:</strong> {employee.city || '—'}</div>
                    <div>
                      <span className={`status-badge status-badge--${statusLabel === 'active' ? 'active' : 'leave'}`}>
                        {statusLabel === 'active' ? 'Active' : 'On Leave'}
                      </span>
                    </div>
                  </div>
                  <div className="employee-card-mobile__actions">
                    <Link to={`/employees/${employee._id}`} className="secondary-button" style={{ padding: '6px 12px', fontSize: '13px' }}>
                      View Profile
                    </Link>
                    <Link to={`/employees/${employee._id}/edit`} className="primary-button" style={{ padding: '6px 12px', fontSize: '13px' }}>
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Employees;
