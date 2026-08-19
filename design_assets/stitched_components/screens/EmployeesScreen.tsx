import React from 'react';
import { Button } from '../Button';
import { Table } from '../Table';

export const EmployeesScreen: React.FC = () => {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' }
  ];
  const data = [
    { name: 'Alice Johnson', role: 'Developer', status: 'Active' },
    { name: 'Bob Smith', role: 'Designer', status: 'Active' }
  ];

  return (
    <div className="p-container-padding">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline-md text-headline-md text-on-surface">Employees</h2>
        <Button variant="primary">Add Employee</Button>
      </div>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default EmployeesScreen;
