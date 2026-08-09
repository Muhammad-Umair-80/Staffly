import { useContext } from 'react';
import { addEmployeeContext } from '../context/addEmpoyee.context.jsx';

export function useAddEmployee() {
  const context = useContext(addEmployeeContext);

  if (!context) {
    throw new Error('useAddEmployee must be used inside an AddEmployeeProvider');
  }

  return context;
}