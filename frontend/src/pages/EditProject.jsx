import { useNavigate, useParams, Link } from 'react-router-dom';
import '../styles/addEmployee.scss';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="add-employee-page">
      <div className="form-header-card">
        <h1>Edit Project</h1>
        <p>Update project details and team assignments.</p>
      </div>
      <div className="form-section-card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#64748b', margin: '0 0 16px 0' }}>Project editing for ID #{id} will be supported in upcoming system updates.</p>
        <Link to={`/projects/${id}`} className="primary-button">
          Back to Project Profile
        </Link>
      </div>
    </div>
  );
};

export default EditProject;
