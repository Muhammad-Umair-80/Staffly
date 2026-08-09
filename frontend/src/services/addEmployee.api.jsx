import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export const addEmployee = async (employeeFormData) => {
  try {
    const token = window.localStorage.getItem('peoplehub-auth-token');
    const response = await axios.post(`${API_BASE}/api/employees`, employeeFormData, {
      withCredentials: true,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error adding employee:', error);
    const errMessage =
      error?.response?.data?.message || error.message || 'Network error';
    throw new Error(errMessage);
  }
};
