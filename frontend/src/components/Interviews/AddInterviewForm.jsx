// frontend/src/components/Interviews/AddInterviewForm.jsx
import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Video,
  Building2,
  Briefcase,
  Layers,
  MapPin,
  FileText,
  Sparkles,
  Link2
} from 'lucide-react';
import interviewService from '../../services/interviewService';

const STAGE_OPTIONS = [
  'Recruiter Screen',
  'Technical Screen (Round 1)',
  'Coding & Algorithms (Round 2)',
  'System Design (Round 3)',
  'Behavioral & Culture Fit',
  'Hiring Manager / Team Lead',
  'Final Round / Onsite Loop',
  'HR / Offer Discussion'
];

const TYPE_OPTIONS = [
  { value: 'technical', label: 'Technical / Coding' },
  { value: 'system_design', label: 'System Design / Architecture' },
  { value: 'behavioral', label: 'Behavioral & Leadership' },
  { value: 'hr', label: 'HR & Screening' }
];

const MODE_OPTIONS = [
  { value: 'online', label: 'Online Video (Google Meet / Zoom)' },
  { value: 'onsite', label: 'Onsite / In-Person' },
  { value: 'phone', label: 'Phone Call' }
];

const POPULAR_COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Apple', 'Uber', 'Stripe', 'Flipkart'];

export const AddInterviewForm = ({
  isOpen,
  onClose,
  onSuccess,
  initialData = null
}) => {
  const isEdit = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    companyName: '',
    roleTitle: '',
    stage: 'Technical Screen (Round 1)',
    interviewType: 'technical',
    mode: 'online',
    location: '',
    interviewDatetime: '',
    durationMinutes: 60,
    meetLink: '',
    notes: '',
    status: 'upcoming',
    jobId: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Format a Date object to YYYY-MM-DDTHH:mm for datetime-local input
  const formatDatetimeForInput = (d) => {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || initialData.company_name || '',
        roleTitle: initialData.roleTitle || initialData.role_title || initialData.jobTitle || '',
        stage: initialData.stage || 'Technical Screen (Round 1)',
        interviewType: initialData.interviewType || initialData.interview_type || 'technical',
        mode: initialData.mode || 'online',
        location: initialData.location || '',
        interviewDatetime: formatDatetimeForInput(initialData.interviewDatetime || initialData.interview_datetime || initialData.interviewDate),
        durationMinutes: initialData.durationMinutes || initialData.duration_minutes || 60,
        meetLink: initialData.meetLink || initialData.meet_link || '',
        notes: initialData.notes || '',
        status: initialData.status || 'upcoming',
        jobId: initialData.jobId || initialData.job_id || initialData.id && initialData.companyName && !initialData.stage ? initialData.id : null
      });
    } else {
      // Default to 2 days from now at 14:00
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 2);
      defaultDate.setHours(14, 0, 0, 0);
      setFormData((prev) => ({
        ...prev,
        interviewDatetime: formatDatetimeForInput(defaultDate)
      }));
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const setQuickDate = (daysAhead) => {
    const target = new Date();
    target.setDate(target.getDate() + daysAhead);
    target.setHours(14, 0, 0, 0);
    setFormData((prev) => ({
      ...prev,
      interviewDatetime: formatDatetimeForInput(target)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return;
    }
    if (!formData.roleTitle.trim()) {
      setError('Role title is required');
      return;
    }
    if (!formData.interviewDatetime) {
      setError('Interview date and time is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        ...formData,
        durationMinutes: parseInt(formData.durationMinutes, 10) || 60,
        interviewDatetime: new Date(formData.interviewDatetime).toISOString()
      };

      let result;
      if (isEdit) {
        result = await interviewService.updateInterview(initialData.id, payload);
      } else {
        result = await interviewService.createInterview(payload);
      }

      if (onSuccess) {
        onSuccess(result?.data || result);
      }
      onClose();
    } catch (err) {
      console.error('Failed to save interview:', err);
      setError(err?.message || 'Failed to save interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden border border-[#E5E7EB]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {isEdit ? 'Edit Interview' : 'Schedule New Interview'}
              </h3>
              <p className="text-xs text-gray-500">
                Track interview date, video meet link, and automated prep plan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Google, Amazon, Stripe"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Quick company pills */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {POPULAR_COMPANIES.slice(0, 5).map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, companyName: comp }))}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 transition-colors"
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Role Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="roleTitle"
                  value={formData.roleTitle}
                  onChange={handleChange}
                  placeholder="e.g. Senior Frontend Engineer"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Stage & Interview Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Interview Stage
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {STAGE_OPTIONS.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Type / Format
              </label>
              <select
                name="interviewType"
                value={formData.interviewType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time Picker + Quick Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">
                Date & Time <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400">Quick set:</span>
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  className="text-[11px] px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(3)}
                  className="text-[11px] px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                >
                  +3 Days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(7)}
                  className="text-[11px] px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                >
                  +1 Week
                </button>
              </div>
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="datetime-local"
                name="interviewDatetime"
                value={formData.interviewDatetime}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Mode, Duration & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mode
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {MODE_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Duration (mins)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="number"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  min="15"
                  max="480"
                  step="15"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Location / Time Zone
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote (PST)"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Meeting Link */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Video Meeting Link (Google Meet / Zoom / Teams)
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="url"
                name="meetLink"
                value={formData.meetLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status (if editing) */}
          {isEdit && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Preparation Notes & Tips
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Interviewer is Principal Engineer. Focus on distributed databases, cache eviction, and STAR questions about team conflict."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>{isEdit ? 'Save Changes' : 'Schedule Interview'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInterviewForm;
