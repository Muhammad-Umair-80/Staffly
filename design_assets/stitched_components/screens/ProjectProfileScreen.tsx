import React from 'react';
import { Avatar } from '../Avatar';

export const ProjectProfileScreen: React.FC = () => {
  return (
    <div className="p-container-padding">
      <div className="bg-surface-container-lowest rounded-xl p-6">
        <div className="flex items-center gap-4">
          <Avatar size={64} />
          <div>
            <h2 className="font-headline-md text-headline-md">Project Name</h2>
            <p className="text-body-sm text-on-surface-variant">Project description and details</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProfileScreen;
