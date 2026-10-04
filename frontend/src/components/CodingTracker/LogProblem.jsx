// frontend/src/components/CodingTracker/LogProblem.jsx
import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { Select, Input, Textarea } from '../UI/FormControls';
import { codingService } from '../../services/codingService';

const TOPIC_OPTIONS = [
  'Array',
  'String',
  'Tree',
  'Dynamic Programming',
  'Graph',
  'Binary Search',
  'Linked List',
  'Two Pointers',
  'Stack / Queue',
  'Heap / Priority Queue',
  'Backtracking',
  'Trie',
  'Bit Manipulation',
  'Greedy'
];

export const LogProblem = ({ onProblemLogged, showToast }) => {
  const [formData, setFormData] = useState({
    topic: 'Array',
    difficulty: 'Medium',
    problemName: '',
    timeTaken: 25,
    selfRatingLevel: 'Solved easily', // 'Solved easily', 'Struggled', 'Failed'
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.problemName.trim()) {
      errs.problemName = 'Problem name is required';
    }
    if (!formData.timeTaken || formData.timeTaken <= 0) {
      errs.timeTaken = 'Time taken must be > 0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const ratingMap = {
        'Solved easily': 5,
        'Struggled': 3,
        'Failed': 1
      };

      const payload = {
        problemName: formData.problemName.trim(),
        topic: formData.topic,
        difficulty: formData.difficulty,
        timeTaken: parseInt(formData.timeTaken, 10),
        selfRating: ratingMap[formData.selfRatingLevel] || 4,
        solved: formData.selfRatingLevel !== 'Failed',
        notes: formData.notes.trim()
      };

      const res = await codingService.logProblem(payload);
      if (res.success) {
        showToast('Problem successfully logged to your practice history!', 'success');
        setFormData({
          topic: 'Array',
          difficulty: 'Medium',
          problemName: '',
          timeTaken: 25,
          selfRatingLevel: 'Solved easily',
          notes: ''
        });
        if (onProblemLogged) onProblemLogged();
      } else {
        showToast(res.message || 'Failed to log problem', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error occurred while logging problem.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Form in light gray background card */
    <div className="bg-[#F9FAFB] rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-4">
      {/* H2: "Log Your Practice" */}
      <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px]">
        Log Your Practice
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Topic dropdown */}
        <div>
          <Select
            id="topic"
            label="Topic"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          >
            {TOPIC_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>

        {/* Difficulty radios (Easy/Medium/Hard) */}
        <div>
          <label className="block text-[14px] font-semibold text-[#374151] mb-2">
            Difficulty
          </label>
          <div className="flex items-center gap-3">
            {['Easy', 'Medium', 'Hard'].map((diff) => {
              const diffColors = {
                Easy: 'text-[#10B981] border-[#10B981]/30 bg-[#D1FAE5]/40',
                Medium: 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#FEF3C7]/40',
                Hard: 'text-[#EF4444] border-[#EF4444]/30 bg-[#FEF2F2]/40'
              };
              const isSelected = formData.difficulty === diff;

              return (
                <label
                  key={diff}
                  className={`flex-1 flex items-center justify-center p-2 rounded-[8px] border text-[13px] font-semibold cursor-pointer transition-all ${
                    isSelected
                      ? `${diffColors[diff]} ring-2 ring-[#3B82F6]/30`
                      : 'border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={diff}
                    checked={isSelected}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="sr-only"
                  />
                  <span>{diff}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Problem name input */}
        <div>
          <Input
            id="problemName"
            label="Problem Name"
            required
            value={formData.problemName}
            onChange={(e) => setFormData({ ...formData, problemName: e.target.value })}
            placeholder="e.g. 200. Number of Islands"
            error={errors.problemName}
          />
        </div>

        {/* Time taken input (number, in minutes) */}
        <div>
          <Input
            id="timeTaken"
            type="number"
            min="1"
            max="300"
            label="Time Taken (in minutes)"
            required
            value={formData.timeTaken}
            onChange={(e) => setFormData({ ...formData, timeTaken: e.target.value })}
            error={errors.timeTaken}
          />
        </div>

        {/* Self-rating radios (Solved easily/Struggled/Failed with emoji) */}
        <div>
          <label className="block text-[14px] font-semibold text-[#374151] mb-2">
            Self-Rating
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { label: 'Solved easily', emoji: '🟢' },
              { label: 'Struggled', emoji: '🟡' },
              { label: 'Failed', emoji: '🔴' }
            ].map((rating) => {
              const isSelected = formData.selfRatingLevel === rating.label;
              return (
                <label
                  key={rating.label}
                  className={`flex items-center gap-2 p-2 rounded-[8px] border text-[12px] font-semibold cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#3B82F6] bg-[#EBF5FF] text-[#1E40AF]'
                      : 'border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <input
                    type="radio"
                    name="selfRatingLevel"
                    value={rating.label}
                    checked={isSelected}
                    onChange={() => setFormData({ ...formData, selfRatingLevel: rating.label })}
                    className="sr-only"
                  />
                  <span>{rating.emoji}</span>
                  <span className="truncate">{rating.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Notes textarea (optional) */}
        <div>
          <Textarea
            id="notes"
            label="Notes (optional)"
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Key edge cases, time/space complexity notes..."
          />
        </div>

        {/* Submit button: "Log Problem" (blue) */}
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full"
        >
          Log Problem
        </Button>
      </form>
    </div>
  );
};

export default LogProblem;
