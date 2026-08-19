import React from 'react';
import { Table } from '../Table';
import { Button } from '../Button';

export const ProjectsScreen: React.FC = () => {
  const columns = [
    { key: 'name', header: 'Project' },
    { key: 'owner', header: 'Owner' },
    { key: 'status', header: 'Status' }
  ];
  const data = [{ name: 'Website Redesign', owner: 'Alice', status: 'Active' }];

  return (
    <div className="p-container-padding">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline-md text-headline-md text-on-surface">Projects</h2>
        <Button variant="primary">Add Project</Button>
      </div>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default ProjectsScreen;
