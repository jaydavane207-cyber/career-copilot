// frontend/src/components/JobTracker/AddJobModal.jsx
import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { jobService } from '../../services/jobService';

export const AddJobModal = ({ isOpen, onClose, onJobCreated }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    positionTitle: '',
    jobUrl: '',
    location: '',
    workType: 'Remote',
    salaryRange: '',
    status: 'Wishlist',
    deadline: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.positionTitle) {
      setError('Company and Position Title are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await jobService.createJob(formData);
      if (res.success) {
        onJobCreated(res.job);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Track New Job Application">
      {error && <p className="text-xs text-rose-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Netflix, Stripe"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Position Title *</label>
            <input
              type="text"
              name="positionTitle"
              required
              value={formData.positionTitle}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="input-field">
              <option value="Wishlist">Wishlist</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Work Type</label>
            <select name="workType" value={formData.workType} onChange={handleChange} className="input-field">
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Range</label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              placeholder="$120k - $150k"
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Job Post URL</label>
            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              placeholder="https://company.com/careers/..."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline Date</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Notes & Follow-ups</label>
          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Recruiter contact, referral names, interview tips..."
            className="input-field"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="btn-secondary text-xs">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary text-xs">
            {loading ? 'Adding...' : 'Add Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddJobModal;
