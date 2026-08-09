import { createContext, useEffect, useMemo, useState } from 'react';

import {addEmployee as addEmployeeApi} from '../services/employee.api.jsx';

export const addEmployeeContext = createContext(null);

export function AddEmployeeProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const handleAddEmployee = async (employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await addEmployeeApi(employeeData);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to add employee');
      throw err;
    } finally {
      setLoading(false);
    }
    };
    