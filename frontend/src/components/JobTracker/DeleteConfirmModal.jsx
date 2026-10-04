// frontend/src/components/JobTracker/DeleteConfirmModal.jsx
import React from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { AlertTriangle } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, job, onConfirm, loading }) => {
  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Job Application" size="small">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-[8px] bg-[#FEF2F2] border border-[#EF4444]/30">
          <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-[14px]">
            <h3 className="font-bold text-[#7F1D1D] text-[16px]">
              Are you sure?
            </h3>
            <p className="text-[#374151]">
              This action cannot be undone. You are about to permanently delete{' '}
              <span className="font-semibold text-[#111827]">
                {job.companyName} - {job.jobTitle || 'Role'}
              </span>
              .
            </p>
          </div>
        </div>

        {/* Two buttons: Cancel (gray) | Delete (red) */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => onConfirm(job.id)}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
