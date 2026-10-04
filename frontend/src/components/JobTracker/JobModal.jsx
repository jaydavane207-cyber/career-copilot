// frontend/src/components/JobTracker/JobModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { Input, Textarea, Select, Label } from '../UI/FormControls';
import { jobService } from '../../services/jobService';
import { formatDateForInput } from '../../utils/formatters';

export const JobModal = ({ isOpen, onClose, jobToEdit = null, onJobSaved, onError }) => {
  const isEdit = Boolean(jobToEdit && jobToEdit.id);

  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobLink: '',
    stage: 'applied',
    interviewDate: '',
    notes: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        companyName: jobToEdit.companyName || '',
        jobTitle: jobToEdit.jobTitle || jobToEdit.positionTitle || '',
        jobLink: jobToEdit.jobLink || jobToEdit.jobUrl || '',
        stage: jobToEdit.stage || 'applied',
        interviewDate: formatDateForInput(jobToEdit.interviewDate) || '',
        notes: jobToEdit.notes || ''
      });
    } else {
      setFormData({
        companyName: '',
        jobTitle: '',
        jobLink: '',
        stage: 'applied',
        interviewDate: '',
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
        interviewDate: formData.interviewDate || null,
        notes: formData.notes.trim() || ''
      };

      let res;
      if (isEdit) {
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
      size="small"
    >
      {serverError && (
        <div className="mb-4 p-3 rounded-[8px] bg-[#FEF2F2] border border-[#EF4444]/30 text-[#7F1D1D] text-[13px]">
          {serverError}
        </div>
      )}

      {/* Form fields (stacked) */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company name input (required) */}
        <div>
          <Input
            id="companyName"
            name="companyName"
            label="Company Name"
            required
            value={formData.companyName}
            onChange={handleChange}
            error={validationErrors.companyName}
            placeholder="e.g. Google, Stripe, Microsoft"
          />
        </div>

        {/* Job title input (required) */}
        <div>
          <Input
            id="jobTitle"
            name="jobTitle"
            label="Job Title"
            required
            value={formData.jobTitle}
            onChange={handleChange}
            error={validationErrors.jobTitle}
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>

        {/* Job link input (optional) */}
        <div>
          <Input
            id="jobLink"
            name="jobLink"
            type="url"
            label="Job Link (optional)"
            value={formData.jobLink}
            onChange={handleChange}
            error={validationErrors.jobLink}
            placeholder="https://company.com/careers/role"
          />
        </div>

        {/* Stage dropdown (Applied/Interview/Offer) */}
        <div>
          <Select
            id="stage"
            name="stage"
            label="Stage"
            value={formData.stage}
            onChange={handleChange}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
          </Select>
        </div>

        {/* Interview date picker (optional, date type) */}
        <div>
          <Input
            id="interviewDate"
            name="interviewDate"
            type="date"
            label="Interview Date (optional)"
            value={formData.interviewDate}
            onChange={handleChange}
          />
        </div>

        {/* Notes textarea (optional) */}
        <div>
          <Textarea
            id="notes"
            name="notes"
            label="Notes (optional)"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Recruiter contact, preparation notes, referral details..."
            rows={3}
          />
        </div>

        {/* Buttons: Primary "Add Job" (blue), Secondary "Cancel" (gray) */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? 'Save Changes' : 'Add Job'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JobModal;
