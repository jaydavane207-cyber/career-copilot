// frontend/src/components/JobTracker/AddJobModal.jsx
import React from 'react';
import JobModal from './JobModal';

export const AddJobModal = ({ isOpen, onClose, onJobCreated, onError }) => {
  return (
    <JobModal
      isOpen={isOpen}
      onClose={onClose}
      jobToEdit={null}
      onJobSaved={(newJob) => {
        if (onJobCreated) onJobCreated(newJob);
      }}
      onError={onError}
    />
  );
};

export default AddJobModal;
