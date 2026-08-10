import { useNavigate, useParams } from 'react-router-dom';
import '../styles/dashboard.scss';
import '../styles/employees.scss';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card">
        <div className="dashboard-card__header">
          <div>
            <p className="dashboard-eyebrow">Staffly</p>
            <h1>Edit Project</h1>
            <p className="dashboard-subtitle">Editing is not implemented yet for this step.</p>
          </div>
        </div>
        <div className="content-state">
          <p>Project editing will be added in a future step.</p>
          <button type="button" className="primary-button" onClick={() => navigate(`/projects/${id}`)}>
            Back to Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
