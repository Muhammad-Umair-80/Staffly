import React from 'react';
import { Table } from '../Table';

export const ArchiveScreen: React.FC = () => {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'archivedAt', header: 'Archived' }
  ];
  const data = [];

  return (
    <div className="p-container-padding">
      <h2 className="font-headline-md text-headline-md mb-4">Archive</h2>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default ArchiveScreen;
