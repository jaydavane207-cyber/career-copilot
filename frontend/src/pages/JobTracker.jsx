// frontend/src/pages/JobTracker.jsx
import React from 'react';
import KanbanBoard from '../components/JobTracker/KanbanBoard';

export const JobTracker = () => {
  return (
    <div className="space-y-6">
      <KanbanBoard />
    </div>
  );
};

export default JobTracker;
