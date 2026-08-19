import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import '../styles/addEmployee.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (value instanceof Date) return value.toISOString();
  return String(value);
};

const EditEmployee = () => {
  const { id } = useParams();
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

  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadEmployee = async () => {
      setLoadingEmployee(true);
      setLoadError(false);
      setNotFound(false);
      setSelectedFile(null);
      setImageError('');

      try {
        const token = window.localStorage.getItem('peoplehub-auth-token');
        const response = await axios.get(`${API_BASE}/api/employees/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (!isMounted) return;

        const employee = response.data?.employee || null;
        if (!employee) {
          setNotFound(true);
          setInitialValues(null);
          setPreviewUrl('');
          setExistingImageUrl('');
          return;
        }

        const formValues = {
          employeeId: employee.employeeId || '',
          fullName: employee.fullName || '',
          email: employee.email || '',
          phone: employee.phone || '',
          city: employee.city || '',
          address: employee.address || '',
          role: employee.role || '',
          department: employee.department || '',
          joiningDate: toDateInputValue(employee.joiningDate),
          employmentStatus: employee.employmentStatus || 'active',
          reportingTo: employee.reportingTo || '',
          currentProject: employee.currentProject || '',
        };

        setInitialValues(formValues);
        reset(formValues);
        setExistingImageUrl(employee.profileImage?.url || '');
        setPreviewUrl(employee.profileImage?.url || '');
      } catch (error) {
        if (!isMounted) return;
        if (error?.response?.status === 404) {
          setNotFound(true);
        } else {
          setLoadError(true);
        }
      } finally {
        if (isMounted) {
          setLoadingEmployee(false);
        }
      }
    };

    loadEmployee();

    return () => {
      isMounted = false;
    };
  }, [id, reset]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
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
      setPreviewUrl(existingImageUrl || '');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError('Image must be 2MB or smaller.');
      setSelectedFile(null);
      setPreviewUrl(existingImageUrl || '');
      event.target.value = '';
      return;
    }

    setImageError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setPreviewUrl(existingImageUrl || '');
    setImageError('');
  };

  const onSubmit = async (values) => {
    if (imageError) return;

    const formData = new FormData();
    const changedFields = Object.entries(values).filter(([fieldName, value]) => {
      const previousValue = initialValues?.[fieldName];
      return !Object.is(normalizeValue(value), normalizeValue(previousValue));
    });

    if (selectedFile) {
      formData.append('profileImage', selectedFile);
    }

    if (changedFields.length === 0 && !selectedFile) {
      toast.error('No changes were made.');
      return;
    }

    changedFields.forEach(([fieldName, value]) => {
      formData.append(fieldName, value === undefined || value === null ? '' : value);
    });

    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      const response = await axios.put(`${API_BASE}/api/employees/${id}`, formData, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      if (response.data?.success) {
        toast.success('Employee updated successfully.');
        navigate(`/employees/${id}`);
      } else {
        toast.error(response.data?.message || 'Unable to update employee.');
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to update employee.';
      toast.error(message);
    }
  };

  if (loadingEmployee) {
    return (
      <div className="add-employee-page">
        <div className="form-header-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading employee record for editing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-employee-page">
      <Toaster position="top-right" />

      {/* Header Card */}
      <div className="form-header-card">
        <h1>Edit Employee Record</h1>
        <p>Update employee details, role, department, or profile image.</p>
      </div>

      {loadError ? (
        <div className="form-header-card" style={{ textAlign: 'center', padding: '32px' }}>
          <p style={{ color: '#dc2626', margin: '0 0 16px 0' }}>Unable to load employee information.</p>
          <button type="button" className="secondary-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : notFound ? (
        <div className="form-header-card" style={{ textAlign: 'center', padding: '32px' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Employee not found</h2>
          <p style={{ color: '#64748b', margin: '0 0 16px 0' }}>The employee record you are trying to edit does not exist.</p>
          <Link to="/employees" className="primary-button">
            Back to Employees
          </Link>
        </div>
      ) : (
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
                  <span>Change Photo</span>
                </label>

                {selectedFile && (
                  <button type="button" className="secondary-button" onClick={removeSelectedImage} style={{ padding: '6px 14px', fontSize: '13px', color: '#dc2626' }}>
                    Reset
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
                  placeholder="Full name"
                  {...register('fullName', { required: 'Full name is required.' })}
                />
                {errors.fullName && <p className="field-error">{errors.fullName.message}</p>}
              </div>

              <div className="field-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
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
                <input id="phone" type="tel" placeholder="Phone number" {...register('phone', { required: 'Phone is required.' })} />
                {errors.phone && <p className="field-error">{errors.phone.message}</p>}
              </div>

              <div className="field-group">
                <label htmlFor="city">City *</label>
                <input id="city" type="text" placeholder="City" {...register('city', { required: 'City is required.' })} />
                {errors.city && <p className="field-error">{errors.city.message}</p>}
              </div>

              <div className="field-group field-group--full">
                <label htmlFor="address">Full Address</label>
                <textarea id="address" rows="3" placeholder="Residential address" {...register('address')} />
              </div>
            </div>
          </section>

          {/* Employment Information Section */}
          <section className="form-section-card">
            <h2 className="form-section-card__title">Employment Information</h2>

            <div className="form-grid-two-col">
              <div className="field-group">
                <label htmlFor="employeeId">Employee ID *</label>
                <input id="employeeId" type="text" placeholder="Employee ID" {...register('employeeId', { required: 'Employee ID is required.' })} />
                {errors.employeeId && <p className="field-error">{errors.employeeId.message}</p>}
              </div>

              <div className="field-group">
                <label htmlFor="role">Job Title / Role *</label>
                <input id="role" type="text" placeholder="Job Role" {...register('role', { required: 'Role is required.' })} />
                {errors.role && <p className="field-error">{errors.role.message}</p>}
              </div>

              <div className="field-group">
                <label htmlFor="department">Department *</label>
                <input id="department" type="text" placeholder="Department" {...register('department', { required: 'Department is required.' })} />
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
                <input id="reportingTo" type="text" placeholder="Reporting Manager" {...register('reportingTo')} />
              </div>

              <div className="field-group field-group--full">
                <label htmlFor="currentProject">Current Assigned Project</label>
                <input id="currentProject" type="text" placeholder="Current Project" {...register('currentProject')} />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="form-actions-row">
            <Link to={`/employees/${id}`} className="secondary-button">
              Cancel
            </Link>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditEmployee;
