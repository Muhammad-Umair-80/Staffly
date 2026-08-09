import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { BriefcaseBusiness, Building2, CalendarDays, MapPin, UploadCloud, UserRound, XCircle } from 'lucide-react';
import { addEmployee } from '../services/addEmployee.api.jsx';
import '../styles/addEmployee.scss';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const AddEmployee = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      employeeId: '',
      fullName: '',
      email: '',
      phone: '',
      city: '',
      address: '',
      role: '',
      department: '',
      joiningDate: '',
      employmentStatus: 'active',
      reportingTo: '',
      currentProject: '',
    },
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageSelection = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Please choose a JPG, JPEG, PNG, or WEBP image.');
      setSelectedFile(null);
      setPreviewUrl('');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError('Image must be 2MB or smaller.');
      setSelectedFile(null);
      setPreviewUrl('');
      event.target.value = '';
      return;
    }

    setImageError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setImageError('');
  };

  const onSubmit = async (values) => {
    if (imageError) {
      return;
    }

    setImageError('');

    const formData = new FormData();

    if (selectedFile) {
      formData.append('profileImage', selectedFile);
    }

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    try {
      await addEmployee(formData);
      toast.success('Employee added successfully.');
      reset();
      removeSelectedImage();
      navigate('/employees');
    } catch (error) {
      const message = error.message || 'Unable to create employee.';
      toast.error(message);
    }
  };

  return (
    <div className="add-employee-shell">
      <Toaster position="top-right" />
      <div className="add-employee-card">
        <div className="add-employee-header">
          <div>
            <p className="add-employee-eyebrow">PeopleHub</p>
            <h1>Add Employee</h1>
            <p className="add-employee-subtitle">Create a new employee profile with professional details and a profile image.</p>
          </div>
        </div>

        <form className="add-employee-form" onSubmit={handleSubmit(onSubmit)}>
          <section className="form-section">
            <div className="section-heading">
              <UserRound size={18} />
              <h2>Personal Information</h2>
            </div>

            <div className="image-upload-card">
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Selected employee preview" className="image-preview" />
                  <div className="image-upload-actions">
                    <label className="image-action-button" htmlFor="profileImage">
                      <UploadCloud size={16} />
                      Change image
                    </label>
                    <button type="button" className="image-action-button image-action-button--secondary" onClick={removeSelectedImage}>
                      <XCircle size={16} />
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <div className="image-upload-placeholder">
                  <UploadCloud size={20} />
                  <p>Upload a profile picture</p>
                  <label className="primary-button primary-button--small" htmlFor="profileImage">
                    Choose image
                  </label>
                </div>
              )}
              <input id="profileImage" type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageSelection} />
              {imageError ? <p className="field-error">{imageError}</p> : null}
            </div>

            <div className="form-grid">
              <div className="field-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Jordan Lee"
                  {...register('fullName', { required: 'Full name is required.' })}
                />
                {errors.fullName ? <p className="field-error">{errors.fullName.message}</p> : null}
              </div>

              <div className="field-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="jordan.lee@peoplehub.com"
                  {...register('email', {
                    required: 'Email is required.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address.',
                    },
                  })}
                />
                {errors.email ? <p className="field-error">{errors.email.message}</p> : null}
              </div>

              <div className="field-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" type="tel" placeholder="+1 555 0100" {...register('phone', { required: 'Phone is required.' })} />
                {errors.phone ? <p className="field-error">{errors.phone.message}</p> : null}
              </div>

              <div className="field-group">
                <label htmlFor="city">City</label>
                <input id="city" type="text" placeholder="Chicago" {...register('city', { required: 'City is required.' })} />
                {errors.city ? <p className="field-error">{errors.city.message}</p> : null}
              </div>

              <div className="field-group field-group--full">
                <label htmlFor="address">Address</label>
                <textarea id="address" rows="3" placeholder="Enter office address" {...register('address')} />
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="section-heading">
              <BriefcaseBusiness size={18} />
              <h2>Employment Information</h2>
            </div>

            <div className="form-grid">
              <div className="field-group">
                <label htmlFor="employeeId">Employee ID</label>
                <input id="employeeId" type="text" placeholder="EMP-1042" {...register('employeeId', { required: 'Employee ID is required.' })} />
                {errors.employeeId ? <p className="field-error">{errors.employeeId.message}</p> : null}
              </div>

              <div className="field-group">
                <label htmlFor="role">Role</label>
                <input id="role" type="text" placeholder="Software Engineer" {...register('role', { required: 'Role is required.' })} />
                {errors.role ? <p className="field-error">{errors.role.message}</p> : null}
              </div>

              <div className="field-group">
                <label htmlFor="department">Department</label>
                <input id="department" type="text" placeholder="Engineering" {...register('department', { required: 'Department is required.' })} />
                {errors.department ? <p className="field-error">{errors.department.message}</p> : null}
              </div>

              <div className="field-group">
                <label htmlFor="joiningDate">Joining Date</label>
                <div className="icon-input">
                  <CalendarDays size={16} />
                  <input id="joiningDate" type="date" {...register('joiningDate', { required: 'Joining date is required.' })} />
                </div>
                {errors.joiningDate ? <p className="field-error">{errors.joiningDate.message}</p> : null}
              </div>

              <div className="field-group">
                <label htmlFor="employmentStatus">Employment Status</label>
                <div className="icon-input">
                  <Building2 size={16} />
                  <select id="employmentStatus" {...register('employmentStatus', { required: 'Employment status is required.' })}>
                    <option value="active">Active</option>
                    <option value="on-leave">On leave</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                {errors.employmentStatus ? <p className="field-error">{errors.employmentStatus.message}</p> : null}
              </div>

              <div className="field-group">
                <label htmlFor="reportingTo">Reporting To</label>
                <input id="reportingTo" type="text" placeholder="VP of Engineering" {...register('reportingTo')} />
              </div>

              <div className="field-group field-group--full">
                <label htmlFor="currentProject">Current Project</label>
                <div className="icon-input">
                  <MapPin size={16} />
                  <input id="currentProject" type="text" placeholder="Customer Portal" {...register('currentProject')} />
                </div>
              </div>
            </div>
          </section>

          <div className="submit-row">
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Employee...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
