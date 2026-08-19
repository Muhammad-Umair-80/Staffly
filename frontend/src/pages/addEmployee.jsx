import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
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

    if (!file) return;

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
    if (imageError) return;

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
    <div className="add-employee-page">
      <Toaster position="top-right" />

      {/* Header Card */}
      <div className="form-header-card">
        <h1>Add New Employee</h1>
        <p>Create a new employee profile with personal details, role, department, and profile image.</p>
      </div>

      <form className="add-employee-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Details Section */}
        <section className="form-section-card">
          <h2 className="form-section-card__title">Personal Details</h2>

          {/* Profile Image Dropzone */}
          <div className="image-upload-area">
            {previewUrl ? (
              <img src={previewUrl} alt="Selected preview" className="image-upload-preview" />
            ) : (
              <div className="image-upload-placeholder">
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>account_circle</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label htmlFor="profileImage" className="secondary-button" style={{ padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>upload</span>
                <span>{previewUrl ? 'Change Photo' : 'Upload Photo'}</span>
              </label>

              {previewUrl && (
                <button type="button" className="secondary-button" onClick={removeSelectedImage} style={{ padding: '6px 14px', fontSize: '13px', color: '#dc2626' }}>
                  Remove
                </button>
              )}
            </div>

            <input id="profileImage" type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageSelection} style={{ display: 'none' }} />
            {imageError && <p className="field-error">{imageError}</p>}
          </div>

          <div className="form-grid-two-col">
            <div className="field-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Muhammad Umair"
                {...register('fullName', { required: 'Full name is required.' })}
              />
              {errors.fullName && <p className="field-error">{errors.fullName.message}</p>}
            </div>

            <div className="field-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                placeholder="e.g. umair@staffly.com"
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address.',
                  },
                })}
              />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            <div className="field-group">
              <label htmlFor="phone">Phone Number *</label>
              <input id="phone" type="tel" placeholder="+92 300 1234567" {...register('phone', { required: 'Phone is required.' })} />
              {errors.phone && <p className="field-error">{errors.phone.message}</p>}
            </div>

            <div className="field-group">
              <label htmlFor="city">City *</label>
              <input id="city" type="text" placeholder="Lahore" {...register('city', { required: 'City is required.' })} />
              {errors.city && <p className="field-error">{errors.city.message}</p>}
            </div>

            <div className="field-group field-group--full">
              <label htmlFor="address">Full Address</label>
              <textarea id="address" rows="3" placeholder="Enter residential address" {...register('address')} />
            </div>
          </div>
        </section>

        {/* Employment Information Section */}
        <section className="form-section-card">
          <h2 className="form-section-card__title">Employment Information</h2>

          <div className="form-grid-two-col">
            <div className="field-group">
              <label htmlFor="employeeId">Employee ID *</label>
              <input id="employeeId" type="text" placeholder="EMP-001" {...register('employeeId', { required: 'Employee ID is required.' })} />
              {errors.employeeId && <p className="field-error">{errors.employeeId.message}</p>}
            </div>

            <div className="field-group">
              <label htmlFor="role">Job Title / Role *</label>
              <input id="role" type="text" placeholder="Software Engineer" {...register('role', { required: 'Role is required.' })} />
              {errors.role && <p className="field-error">{errors.role.message}</p>}
            </div>

            <div className="field-group">
              <label htmlFor="department">Department *</label>
              <input id="department" type="text" placeholder="Engineering" {...register('department', { required: 'Department is required.' })} />
              {errors.department && <p className="field-error">{errors.department.message}</p>}
            </div>

            <div className="field-group">
              <label htmlFor="joiningDate">Joining Date *</label>
              <input id="joiningDate" type="date" {...register('joiningDate', { required: 'Joining date is required.' })} />
              {errors.joiningDate && <p className="field-error">{errors.joiningDate.message}</p>}
            </div>

            <div className="field-group">
              <label htmlFor="employmentStatus">Employment Status *</label>
              <select id="employmentStatus" {...register('employmentStatus', { required: 'Status is required.' })}>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="archived">Archived</option>
              </select>
              {errors.employmentStatus && <p className="field-error">{errors.employmentStatus.message}</p>}
            </div>

            <div className="field-group">
              <label htmlFor="reportingTo">Reporting Manager / Supervisor</label>
              <input id="reportingTo" type="text" placeholder="Engineering Lead" {...register('reportingTo')} />
            </div>

            <div className="field-group field-group--full">
              <label htmlFor="currentProject">Current Assigned Project</label>
              <input id="currentProject" type="text" placeholder="Internal Portal V2" {...register('currentProject')} />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="form-actions-row">
          <Link to="/employees" className="secondary-button">
            Cancel
          </Link>
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Employee...' : 'Save & Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
