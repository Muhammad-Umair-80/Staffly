import React from 'react';
import { Table } from '../Table';
import { Button } from '../Button';

export const AdminsScreen: React.FC = () => {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' }
  ];
  const data = [];

  return (
    <div className="p-container-padding">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline-md text-headline-md text-on-surface">Admins</h2>
        <Button variant="primary">Add Admin</Button>
      </div>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default AdminsScreen;
