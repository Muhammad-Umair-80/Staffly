import axios from 'axios';


const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post(
      `${API_BASE}/api/employees`,
      employeeData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding employee:', error);
    const errMessage =
      error?.response?.data?.message || error.message || 'Network error';
    throw new Error(errMessage);
  }
};
