import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { BriefcaseBusiness, Building2, CalendarDays, MapPin, UploadCloud, UserRound, XCircle } from 'lucide-react';
import '../styles/addEmployee.scss';
import '../styles/employees.scss';
import '../styles/employeeProfile.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const toDateInputValue = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const normalizeValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

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

        if (!isMounted) {
          return;
        }

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
        if (!isMounted) {
          return;
        }

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

    if (!file) {
      return;
    }

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
    if (imageError) {
      return;
    }

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
      <div className="add-employee-shell">
        <div className="add-employee-card">
          <div className="profile-loading" aria-live="polite">
            <div className="profile-loading__header" />
            <div className="profile-loading__content" />
            <div className="profile-loading__content" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-employee-shell">
      <Toaster position="top-right" />
      <div className="add-employee-card">
        <div className="add-employee-header">
          <div>
            <p className="add-employee-eyebrow">PeopleHub</p>
            <h1>Edit Employee</h1>
            <p className="add-employee-subtitle">Update employee information while keeping the existing experience consistent.</p>
          </div>
        </div>

        {loadError ? (
          <div className="content-state content-state--error">
            <p>Unable to load employee information.</p>
            <button type="button" className="secondary-button" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        ) : null}

        {notFound ? (
          <div className="content-state">
            <h2>Employee not found</h2>
            <p>The employee you are trying to edit does not exist.</p>
            <Link to="/employees" className="primary-button" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              Back to Employees
            </Link>
          </div>
        ) : null}

        {!loadError && !notFound ? (
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
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default EditEmployee;
