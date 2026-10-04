// frontend/src/components/CodingTracker/LogProblem.jsx
import React, { useState } from 'react';
import {
  Plus,
  Clock,
  Sparkles,
  AlertCircle,
  Star,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Smile,
  Meh,
  Frown
} from 'lucide-react';
import { codingService } from '../../services/codingService';

const TOPIC_OPTIONS = [
  'Array',
  'String',
  'Two Pointers',
  'Sliding Window',
  'Stack / Monotonic',
  'Binary Search',
  'Linked List',
  'Tree',
  'Binary Search Tree',
  'Heap / Priority Queue',
  'Graph / BFS / DFS',
  'Dynamic Programming',
  'Backtracking',
  'Trie',
  'Greedy',
  'Bit Manipulation',
  'Math & Geometry'
];

export const LogProblem = ({ onProblemLogged, showToast }) => {
  const [formData, setFormData] = useState({
    problemName: '',
    topic: 'Array',
    difficulty: 'Medium',
    timeTaken: 30,
    selfRating: 4,
    solved: true,
    notes: '',
    platform: 'LeetCode'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.problemName.trim()) {
      newErrors.problemName = 'Problem name is required';
    }
    const time = parseInt(formData.timeTaken, 10);
    if (isNaN(time) || time <= 0) {
      newErrors.timeTaken = 'Time taken must be > 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Quick rating preset handler: Solved easily (5), Struggled (3), Failed (1)
  const handleQuickRating = (rating) => {
    setFormData(prev => ({
      ...prev,
      selfRating: rating,
      solved: rating >= 3 // If failed, default solved to false
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const res = await codingService.logProblem({
        problemName: formData.problemName.trim(),
        topic: formData.topic,
        difficulty: formData.difficulty,
        timeTaken: parseInt(formData.timeTaken, 10),
        selfRating: parseInt(formData.selfRating, 10),
        solved: Boolean(formData.solved),
        notes: formData.notes.trim(),
        platform: formData.platform
      });

      if (res.success) {
        if (showToast) {
          showToast(`Logged "${res.problem?.problemName || 'Problem'}" successfully!`, 'success');
        }
        onProblemLogged(res.problem);
        // Reset form
        setFormData({
          problemName: '',
          topic: 'Array',
          difficulty: 'Medium',
          timeTaken: 30,
          selfRating: 4,
          solved: true,
          notes: '',
          platform: 'LeetCode'
        });
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to log problem. Please check inputs.';
      if (showToast) showToast(msg, 'error');
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Log Solved Problem</h3>
          <p className="text-[11px] text-slate-400">Record algorithmic practice for spaced repetition</p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
          Auto Spaced Repetition
        </span>
      </div>

      {errors.form && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Problem Name Input */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Problem Name *
          </label>
          <input
            type="text"
            name="problemName"
            value={formData.problemName}
            onChange={handleChange}
            placeholder="e.g. Trapping Rain Water, Course Schedule"
            className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 transition-all ${
              errors.problemName
                ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.problemName && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.problemName}</p>
          )}
        </div>

        {/* Topic Dropdown & Difficulty Radio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Topic Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Topic *
            </label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none bg-white transition-all"
            >
              {TOPIC_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Time Taken */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Time Taken (mins) *
            </label>
            <div className="relative">
              <input
                type="number"
                name="timeTaken"
                min="1"
                max="300"
                value={formData.timeTaken}
                onChange={handleChange}
                className={`w-full px-3 py-2 pr-12 text-xs rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                  errors.timeTaken
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              <span className="absolute right-3 top-2 text-[10px] font-semibold text-slate-400">
                mins
              </span>
            </div>
            {errors.timeTaken && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.timeTaken}</p>
            )}
          </div>
        </div>

        {/* Difficulty Radio Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Difficulty *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 'Easy', label: 'Easy', activeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-300' },
              { val: 'Medium', label: 'Medium', activeClass: 'bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-300' },
              { val: 'Hard', label: 'Hard', activeClass: 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-300' }
            ].map((d) => (
              <label
                key={d.val}
                className={`cursor-pointer border rounded-xl p-2 text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  formData.difficulty === d.val
                    ? d.activeClass
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={d.val}
                  checked={formData.difficulty === d.val}
                  onChange={handleChange}
                  className="sr-only"
                />
                {d.label}
              </label>
            ))}
          </div>
        </div>

        {/* Self-Rating (Solved easily / Struggled / Failed) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Self-Rating *
            </label>
            <span className="text-[11px] font-bold text-indigo-600">
              {formData.selfRating === 5 && 'Solved easily (5/5)'}
              {formData.selfRating === 4 && 'Solved smoothly (4/5)'}
              {formData.selfRating === 3 && 'Struggled (3/5)'}
              {formData.selfRating === 2 && 'Needed hints (2/5)'}
              {formData.selfRating === 1 && 'Failed (1/5)'}
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <button
              type="button"
              onClick={() => handleQuickRating(5)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                formData.selfRating >= 4
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 ring-1 ring-emerald-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Smile className="w-3.5 h-3.5 text-emerald-600" />
              Solved easily
            </button>
            <button
              type="button"
              onClick={() => handleQuickRating(3)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                formData.selfRating === 3
                  ? 'bg-amber-50 border-amber-300 text-amber-700 ring-1 ring-amber-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Meh className="w-3.5 h-3.5 text-amber-600" />
              Struggled
            </button>
            <button
              type="button"
              onClick={() => handleQuickRating(1)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                formData.selfRating <= 2
                  ? 'bg-rose-50 border-rose-300 text-rose-700 ring-1 ring-rose-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Frown className="w-3.5 h-3.5 text-rose-600" />
              Failed
            </button>
          </div>

          {/* Star selector */}
          <div className="flex items-center gap-1 px-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(p => ({ ...p, selfRating: star }))}
                className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
              >
                <Star
                  className={`w-4 h-4 ${
                    star <= formData.selfRating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Solved Status Toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            {formData.solved ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-500" />
            )}
            <span className="text-xs font-semibold text-slate-800">
              {formData.solved ? 'Marked as Solved' : 'Unsolved / Needs Practice'}
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="solved"
              checked={formData.solved}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
          </label>
        </div>

        {/* Notes Textarea (Optional) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Notes & Solution Approach (Optional)
          </label>
          <textarea
            name="notes"
            rows={2}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Key patterns, complexity (O(N) time, O(1) space), edge cases..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {submitting ? 'Logging Problem...' : 'Submit & Schedule Review'}
        </button>
      </form>
    </div>
  );
};

export default LogProblem;
