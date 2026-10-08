// frontend/src/components/Stories/ShareStoryModal.jsx
import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Trophy,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Share2,
  Eye,
  Plus,
  Trash2,
  Building2,
  Calendar,
  Code,
  Mic,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { storyService } from '../../services/storyService';

const POPULAR_COMPANIES = [
  'Google',
  'Microsoft',
  'Amazon',
  'Meta',
  'Apple',
  'Netflix',
  'Uber',
  'Stripe',
  'Airbnb',
  'Salesforce',
  'Adobe',
  'Other'
];

const POPULAR_ROLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Product Manager',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps / Cloud Engineer',
  'Engineering Manager'
];

const PREPARATION_AREAS = [
  'Data Structures & Algorithms',
  'System Design (HLD)',
  'Low-Level Design (LLD)',
  'Behavioral & STAR Stories',
  'Company Leadership Principles',
  'Mock Interviews',
  'Domain Architecture',
  'Resume Polishing'
];

export const ShareStoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    story_title: '',
    company_name: 'Google',
    custom_company: '',
    role: 'Software Engineer',
    experience_level: 'Mid',
    years_experience: 3,
    job_type: 'Full-time',
    location: 'Mountain View, CA',
    starting_salary: 160000,
    final_salary: 180000,
    interview_duration: 21,
    preparation_weeks: 4,
    mock_interviews_done: 12,
    coding_problems_logged: 120,
    study_plan_followed: true,
    key_preparation: ['System Design (HLD)', 'Behavioral & STAR Stories', 'Mock Interviews'],
    story_text: '',
    key_tips: [
      'Practice verbal mock interviews with instant feedback 3x per week',
      'Frame every behavioral example around measurable business impact'
    ],
    what_helped_most: 'AI Mock Interviews & Structured Study Roadmap',
    what_hindered: 'Overthinking edge cases in the initial phone screening',
    advice_for_others: 'Consistency is everything. Trust the preparation process!',
    is_anonymous: false
  });

  const [newTip, setNewTip] = useState('');

  // Salary calculations
  const salaryDiff = useMemo(() => {
    const start = Number(formData.starting_salary) || 0;
    const final = Number(formData.final_salary) || 0;
    const diff = final - start;
    const pct = start > 0 ? ((diff / start) * 100).toFixed(1) : 0;
    return { diff, pct };
  }, [formData.starting_salary, formData.final_salary]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePrepArea = (area) => {
    setFormData((prev) => {
      const exists = prev.key_preparation.includes(area);
      return {
        ...prev,
        key_preparation: exists
          ? prev.key_preparation.filter((a) => a !== area)
          : [...prev.key_preparation, area]
      };
    });
  };

  const handleAddTip = () => {
    if (!newTip.trim()) return;
    setFormData((prev) => ({
      ...prev,
      key_tips: [...prev.key_tips, newTip.trim()]
    }));
    setNewTip('');
  };

  const handleRemoveTip = (index) => {
    setFormData((prev) => ({
      ...prev,
      key_tips: prev.key_tips.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.story_title.trim()) {
      setError('Please provide an inspiring title for your story.');
      return;
    }

    if (!formData.story_text.trim() || formData.story_text.trim().length < 50) {
      setError('Please share at least 50 characters describing your journey.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        company_name:
          formData.company_name === 'Other' && formData.custom_company
            ? formData.custom_company
            : formData.company_name,
        starting_salary: parseInt(formData.starting_salary, 10),
        final_salary: parseInt(formData.final_salary, 10),
        negotiation_amount: salaryDiff.diff > 0 ? salaryDiff.diff : 0,
        salary_percentage_increase: parseFloat(salaryDiff.pct),
        years_experience: parseInt(formData.years_experience, 10),
        interview_duration: parseInt(formData.interview_duration, 10),
        preparation_weeks: parseInt(formData.preparation_weeks, 10),
        mock_interviews_done: parseInt(formData.mock_interviews_done, 10),
        coding_problems_logged: parseInt(formData.coding_problems_logged, 10)
      };

      const res = await storyService.createStory(payload);
      if (res.success) {
        setSubmittedData(res);
        if (onSuccess) onSuccess(res);
      } else {
        throw new Error(res.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Failed to publish story:', err);
      setError(err?.response?.data?.message || err?.message || 'Could not save success story.');
    } finally {
      setSubmitting(false);
    }
  };

  const companyResolved =
    formData.company_name === 'Other' ? formData.custom_company || 'Tech Company' : formData.company_name;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {submittedData ? 'Story Published!' : 'Share Your Success Story'}
              </h3>
              <p className="text-xs text-blue-100">
                {submittedData
                  ? 'Your offer journey is now inspiring hundreds of job seekers'
                  : 'Inspire peers with your journey, negotiation win, and key tips'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submittedData ? (
          /* SUCCESS SCREEN */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                🎉 Congratulations on Your Achievement!
              </h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Your story has been published to the Career Copilot community. Real-world insights like yours empower candidates to aim higher and negotiate with confidence!
              </p>
            </div>

            {/* Badges / Points Earned Card */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/80 rounded-2xl p-5 max-w-md mx-auto shadow-xs text-left">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-amber-600" />
                <span className="text-sm font-black text-amber-950">Achievements Unlocked!</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs bg-white/80 p-2.5 rounded-xl border border-amber-200">
                  <span className="font-bold text-slate-800">🎖️ First Success Story</span>
                  <span className="font-extrabold text-amber-700">+50 Points</span>
                </div>
                {salaryDiff.diff >= 20000 && (
                  <div className="flex items-center justify-between text-xs bg-white/80 p-2.5 rounded-xl border border-amber-200">
                    <span className="font-bold text-slate-800">💰 Negotiation Wizard (+$20k)</span>
                    <span className="font-extrabold text-amber-700">+300 Points</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Share with your network
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(
                      `I just shared how I landed my offer at ${companyResolved} on Career Copilot!`
                    );
                    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-black transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on X / Twitter</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.open('https://www.linkedin.com/feed/', '_blank');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0077b5] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#005f93] transition-all"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Share on LinkedIn</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all cursor-pointer"
              >
                Close & View Feed
              </button>
            </div>
          </div>
        ) : (
          /* FORM & LIVE PREVIEW MODES */
          <div className="p-6">
            {/* Tabs for Edit vs Preview */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'edit'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Story Details Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'preview'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Story Preview</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {activeTab === 'preview' ? (
              /* LIVE PREVIEW */
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                        {companyResolved} • {formData.role}
                      </span>
                      <h4 className="text-xl font-black text-slate-900 mt-2">
                        {formData.story_title || 'Untitled Offer Story'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        By {formData.is_anonymous ? 'Anonymous Achiever' : 'You'} • {formData.experience_level} Level • {formData.job_type}
                      </p>
                    </div>
                  </div>

                  {/* Salary Highlight Badge */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                        Compensation Negotiated
                      </span>
                      <div className="text-lg font-black text-emerald-700">
                        ${Number(formData.starting_salary).toLocaleString()} → $
                        {Number(formData.final_salary).toLocaleString()}
                      </div>
                    </div>
                    {salaryDiff.diff > 0 && (
                      <div className="text-right">
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900">
                          +${salaryDiff.diff.toLocaleString()} (+{salaryDiff.pct}%)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="font-black text-slate-900">{formData.interview_duration} Days</div>
                      <div className="text-[10px] text-slate-500">Duration</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="font-black text-slate-900">{formData.preparation_weeks} Wks</div>
                      <div className="text-[10px] text-slate-500">Prep Time</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="font-black text-slate-900">{formData.mock_interviews_done} Mocks</div>
                      <div className="text-[10px] text-slate-500">Sessions</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="font-black text-slate-900">{formData.coding_problems_logged} Solved</div>
                      <div className="text-[10px] text-slate-500">Problems</div>
                    </div>
                  </div>

                  {/* Story Text */}
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200">
                    {formData.story_text || 'Your detailed journey will appear here...'}
                  </div>

                  {/* Key Tips */}
                  {formData.key_tips.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-slate-800">Actionable Tips:</div>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {formData.key_tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* FORM FIELDS */
              <form onSubmit={handleSubmit} className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
                {/* 1. Basic Info */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Story Title *
                    </label>
                    <input
                      type="text"
                      name="story_title"
                      value={formData.story_title}
                      onChange={handleChange}
                      placeholder="e.g. How I Negotiated +$30k for Google L5 Software Engineer"
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                      <select
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      >
                        {POPULAR_COMPANIES.map((comp) => (
                          <option key={comp} value={comp}>
                            {comp}
                          </option>
                        ))}
                      </select>
                      {formData.company_name === 'Other' && (
                        <input
                          type="text"
                          name="custom_company"
                          value={formData.custom_company}
                          onChange={handleChange}
                          placeholder="Enter company name..."
                          className="w-full text-xs mt-2 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                          required
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      >
                        {POPULAR_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Level</label>
                      <select
                        name="experience_level"
                        value={formData.experience_level}
                        onChange={handleChange}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      >
                        <option value="Junior">Junior</option>
                        <option value="Mid">Mid-Level</option>
                        <option value="Senior">Senior / Staff</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Job Type</label>
                      <select
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleChange}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Seattle, WA"
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Salary & Negotiation Section */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Compensation & Salary Negotiation
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Starting Initial Offer ($)
                      </label>
                      <input
                        type="number"
                        name="starting_salary"
                        value={formData.starting_salary}
                        onChange={handleChange}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Final Accepted Offer ($)
                      </label>
                      <input
                        type="number"
                        name="final_salary"
                        value={formData.final_salary}
                        onChange={handleChange}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  {salaryDiff.diff > 0 && (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-300">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>
                        You negotiated +${salaryDiff.diff.toLocaleString()} (+{salaryDiff.pct}%)! That's a huge win!
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Prep Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      name="interview_duration"
                      value={formData.interview_duration}
                      onChange={handleChange}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Prep Weeks</label>
                    <input
                      type="number"
                      name="preparation_weeks"
                      value={formData.preparation_weeks}
                      onChange={handleChange}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mocks Done</label>
                    <input
                      type="number"
                      name="mock_interviews_done"
                      value={formData.mock_interviews_done}
                      onChange={handleChange}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Problems Solved</label>
                    <input
                      type="number"
                      name="coding_problems_logged"
                      value={formData.coding_problems_logged}
                      onChange={handleChange}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                {/* Preparation Areas Focus */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Key Areas Focused On
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PREPARATION_AREAS.map((area) => {
                      const selected = formData.key_preparation.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => togglePrepArea(area)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                            selected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Story Narrative */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Your Journey & Narrative * (min 50 chars)
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {formData.story_text.length} characters
                    </span>
                  </div>
                  <textarea
                    name="story_text"
                    value={formData.story_text}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe how you studied, how rounds were conducted, challenges you overcame, and your negotiation strategy..."
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                    required
                  />
                </div>

                {/* 5. Key Actionable Tips */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Key Actionable Tips for Peers (3-5 tips)
                  </label>
                  <div className="space-y-1.5">
                    {formData.key_tips.map((tip, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={tip}
                          readOnly
                          className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTip(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {formData.key_tips.length < 5 && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={newTip}
                        onChange={(e) => setNewTip(e.target.value)}
                        placeholder="Add another actionable tip..."
                        className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-xl focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddTip}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 6. What Helped & Advice */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      What Helped Most?
                    </label>
                    <input
                      type="text"
                      name="what_helped_most"
                      value={formData.what_helped_most}
                      onChange={handleChange}
                      placeholder="e.g. AI Mock Interviews"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Advice for Someone Starting Today
                    </label>
                    <input
                      type="text"
                      name="advice_for_others"
                      value={formData.advice_for_others}
                      onChange={handleChange}
                      placeholder="e.g. Practice out loud daily"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Share Anonymously</span>
                    <span className="text-[10px] text-slate-500">
                      Hide your name and avatar from community members
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    name="is_anonymous"
                    checked={formData.is_anonymous}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Publishing Story...</span>
                    ) : (
                      <>
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Publish Success Story</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareStoryModal;
