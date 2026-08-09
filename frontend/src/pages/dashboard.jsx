import { Link } from 'react-router-dom';
import '../styles/dashboard.scss';

const Dashboard = () => (
  <div className="dashboard-shell">
    <div className="dashboard-card">
      <div className="dashboard-card__header">
        <div>
          <p className="dashboard-eyebrow">Staffly</p>
          <h1>Admin Dashboard</h1>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/add-employee" className="dashboard-action-card">
          <h2>Add employee</h2>
          <p>Create a new employee profile and upload a profile image.</p>
        </Link>
        <Link to="/employees" className="dashboard-action-card">
          <h2>Employees</h2>
          <p>View the employee directory and manage employee records.</p>
        </Link>
      </div>
    </div>
  </div>
);

export default Dashboard;
