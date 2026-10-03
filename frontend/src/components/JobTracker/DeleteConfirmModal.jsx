// frontend/src/components/JobTracker/DeleteConfirmModal.jsx
import React from 'react';
import { Modal } from '../Common/Modal';
import { AlertTriangle, Trash2 } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, job, onConfirm, loading }) => {
  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Job Application">
      <div className="space-y-4">
        <div className="flex items-start gap-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200">
          <div className="p-2 rounded-lg bg-rose-100 text-rose-600 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs text-rose-900 leading-relaxed">
            <p className="font-semibold text-sm text-rose-950 mb-0.5">
              Confirm Deletion
            </p>
            <p>
              Are you sure you want to delete the job application for{' '}
              <span className="font-bold">{job.companyName}</span> ({job.jobTitle || job.positionTitle})?
            </p>
            <p className="mt-1 text-rose-700 text-[11px]">
              This action cannot be undone and will remove all interview history and notes associated with this role.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(job.id)}
            disabled={loading}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Application</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
