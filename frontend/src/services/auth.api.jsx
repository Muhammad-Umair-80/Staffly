import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_BASE}/api/auth/admin`,
      { email, password },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    const errMessage =
      error?.response?.data?.message || error.message || 'Network error';
    throw new Error(errMessage);
  }
};

export const getMe = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/auth/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    const errMessage =
      error?.response?.data?.message || error.message || 'Network error';
    throw new Error(errMessage);
  }
};
