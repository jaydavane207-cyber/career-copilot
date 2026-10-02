// frontend/src/components/CodingTracker/LogProblem.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { codingService } from '../../services/codingService';

export const LogProblem = ({ onProblemLogged }) => {
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    difficulty: 'Medium',
    topic: 'Arrays',
    status: 'Solved',
    timeSpentMinutes: 30,
    solutionNotes: '',
    problemUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      setSubmitting(true);
      const res = await codingService.logProblem({
        ...formData,
        timeSpentMinutes: parseInt(formData.timeSpentMinutes, 10)
      });
      if (res.success) {
        onProblemLogged(res.problem);
        setFormData({
          title: '',
          platform: 'LeetCode',
          difficulty: 'Medium',
          topic: 'Arrays',
          status: 'Solved',
          timeSpentMinutes: 30,
          solutionNotes: '',
          problemUrl: ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-900 text-sm">Log Coding Practice Problem</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Problem Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. 3Sum, Number of Islands"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Platform</label>
            <select name="platform" value={formData.platform} onChange={handleChange} className="input-field">
              <option value="LeetCode">LeetCode</option>
              <option value="HackerRank">HackerRank</option>
              <option value="Codeforces">Codeforces</option>
              <option value="NeetCode">NeetCode</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Difficulty</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="input-field">
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">DSA Topic</label>
            <select name="topic" value={formData.topic} onChange={handleChange} className="input-field">
              <option value="Arrays">Arrays & Hashing</option>
              <option value="Two Pointers">Two Pointers</option>
              <option value="Sliding Window">Sliding Window</option>
              <option value="Stack">Stack / Monotonic</option>
              <option value="Binary Search">Binary Search</option>
              <option value="Trees">Trees & BST</option>
              <option value="Graphs">Graphs & BFS/DFS</option>
              <option value="Dynamic Programming">Dynamic Programming</option>
              <option value="Backtracking">Backtracking</option>
              <option value="Trie">Trie</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="input-field">
              <option value="Solved">Solved</option>
              <option value="Attempted">Attempted</option>
              <option value="Review">Needs Review</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Solution Notes / Takeaways</label>
          <textarea
            name="solutionNotes"
            rows={2}
            value={formData.solutionNotes}
            onChange={handleChange}
            placeholder="Time complexity O(N), used two pointers from both ends..."
            className="input-field"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-primary text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          {submitting ? 'Saving...' : 'Log Problem'}
        </button>
      </form>
    </div>
  );
};

export default LogProblem;
