// frontend/src/components/JobTracker/JobModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { jobService } from '../../services/jobService';
import { formatDateForInput } from '../../utils/formatters';
import { Building2, Briefcase, Link as LinkIcon, Calendar, CalendarCheck2, DollarSign, FileText } from 'lucide-react';

export const JobModal = ({ isOpen, onClose, jobToEdit = null, onJobSaved, onError }) => {
  const isEdit = Boolean(jobToEdit);

  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobLink: '',
    stage: 'applied',
    dateApplied: formatDateForInput(new Date()),
    interviewDate: '',
    salary: '',
    notes: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Populate form data when modal opens or jobToEdit changes
  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        companyName: jobToEdit.companyName || '',
        jobTitle: jobToEdit.jobTitle || jobToEdit.positionTitle || '',
        jobLink: jobToEdit.jobLink || jobToEdit.jobUrl || '',
        stage: jobToEdit.stage || 'applied',
        dateApplied: formatDateForInput(jobToEdit.dateApplied) || formatDateForInput(new Date()),
        interviewDate: formatDateForInput(jobToEdit.interviewDate) || '',
        salary: jobToEdit.salary || jobToEdit.salaryRange || '',
        notes: jobToEdit.notes || ''
      });
    } else {
      setFormData({
        companyName: '',
        jobTitle: '',
        jobLink: '',
        stage: 'applied',
        dateApplied: formatDateForInput(new Date()),
        interviewDate: '',
        salary: '',
        notes: ''
      });
    }
    setValidationErrors({});
    setServerError('');
  }, [jobToEdit, isOpen]);

  const validate = () => {
    const errors = {};
    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    if (!formData.jobTitle.trim()) {
      errors.jobTitle = 'Job title is required';
    }
    if (formData.jobLink && !formData.jobLink.startsWith('http://') && !formData.jobLink.startsWith('https://')) {
      errors.jobLink = 'URL should start with http:// or https://';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setServerError('');

      const payload = {
        companyName: formData.companyName.trim(),
        jobTitle: formData.jobTitle.trim(),
        jobLink: formData.jobLink.trim() || null,
        stage: formData.stage,
        dateApplied: formData.dateApplied || null,
        interviewDate: formData.interviewDate || null,
        salary: formData.salary.trim() || null,
        notes: formData.notes.trim() || ''
      };

      let res;
      if (isEdit && jobToEdit?.id) {
        res = await jobService.updateJob(jobToEdit.id, payload);
      } else {
        res = await jobService.createJob(payload);
      }

      if (res.success) {
        onJobSaved(res.job, isEdit);
        onClose();
      } else {
        setServerError(res.message || 'Failed to save job application.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save job application.';
      setServerError(msg);
      if (onError) onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Job Application' : 'Add Job Application'}
    >
      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name & Job Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Google, Stripe, Razorpay"
              className={`input-field ${validationErrors.companyName ? 'border-rose-300 ring-1 ring-rose-200' : ''}`}
            />
            {validationErrors.companyName && (
              <p className="text-[11px] text-rose-500 mt-1">{validationErrors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Job Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Full Stack Engineer"
              className={`input-field ${validationErrors.jobTitle ? 'border-rose-300 ring-1 ring-rose-200' : ''}`}
            />
            {validationErrors.jobTitle && (
              <p className="text-[11px] text-rose-500 mt-1">{validationErrors.jobTitle}</p>
            )}
          </div>
        </div>

        {/* Stage & Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pipeline Stage
            </label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="input-field"
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              Salary (optional)
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. ₹35 LPA or $140,000"
              className="input-field"
            />
          </div>
        </div>

        {/* Date Applied & Interview Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Date Applied
            </label>
            <input
              type="date"
              name="dateApplied"
              value={formData.dateApplied}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <CalendarCheck2 className="w-3.5 h-3.5 text-slate-400" />
              Interview Date (optional)
            </label>
            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        {/* Job Link */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
            Job Link (optional)
          </label>
          <input
            type="url"
            name="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
            placeholder="https://company.com/careers/job-id"
            className={`input-field ${validationErrors.jobLink ? 'border-rose-300 ring-1 ring-rose-200' : ''}`}
          />
          {validationErrors.jobLink && (
            <p className="text-[11px] text-rose-500 mt-1">{validationErrors.jobLink}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Notes & Feedback
          </label>
          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Recruiter contact, interview questions asked, referral names..."
            className="input-field resize-none"
          />
        </div>

        {/* Actions */}
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
            type="submit"
            disabled={loading}
            className="btn-primary text-xs flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEdit ? 'Update Application' : 'Submit Application'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default JobModal;
