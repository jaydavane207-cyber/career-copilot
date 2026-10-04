// frontend/src/components/StudyPlanner/CreatePlan.jsx
import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { Select, Input } from '../UI/FormControls';
import { formatDateForInput } from '../../utils/formatters';
import { studyService } from '../../services/studyService';

export const CreatePlan = ({ onPlanCreated, onBack, initialRole = 'Frontend Developer' }) => {
  const [targetRole, setTargetRole] = useState(initialRole);
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  // Default target date: 8 weeks from now
  const defaultTargetDate = new Date();
  defaultTargetDate.setDate(defaultTargetDate.getDate() + 56);
  const [targetDate, setTargetDate] = useState(formatDateForInput(defaultTargetDate));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate weeks between now and target date
  const now = new Date();
  const target = new Date(targetDate);
  const diffDays = Math.max(7, Math.round((target - now) / (1000 * 3600 * 24)));
  const calculatedWeeks = Math.max(1, Math.round(diffDays / 7));
  const totalHours = hoursPerWeek * calculatedWeeks;

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const res = await studyService.createPlan({
        targetRole,
        hoursPerWeek,
        targetDate
      });

      if (res.success && res.plan) {
        if (onPlanCreated) onPlanCreated(res.plan);
      } else {
        setError(res.message || 'Failed to generate study plan.');
      }
    } catch (err) {
      console.error('Failed to create plan:', err);
      setError(err.response?.data?.message || 'Error occurred while generating plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[32px] leading-[40px] font-bold text-[#111827] tracking-[-0.5px]">
          Create Your Study Plan
        </h1>
        <p className="text-[14px] text-[#6B7280] mt-1">
          Let's design a personalized learning path for you backed by database persistence.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-5">
        {/* Target role dropdown */}
        <div>
          <Select
            id="targetRole"
            label="Target Role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          >
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Engineer">Backend Engineer</option>
            <option value="Fullstack Developer">Fullstack Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Cloud Architect">Cloud Architect</option>
            <option value="Data Engineer">Data Engineer</option>
            <option value="Machine Learning Engineer">Machine Learning Engineer</option>
            <option value="QA Automation Engineer">QA Automation Engineer</option>
          </Select>
        </div>

        {/* Hours per week slider (5-30 hours, default 15) */}
        <div>
          <div className="flex justify-between items-center mb-2 text-[14px]">
            <label htmlFor="hoursPerWeek" className="font-semibold text-[#374151]">
              Hours per week
            </label>
            <span className="font-bold text-[#3B82F6] text-[16px]">
              {hoursPerWeek} hrs/week
            </span>
          </div>
          <input
            id="hoursPerWeek"
            type="range"
            min="5"
            max="30"
            step="1"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(parseInt(e.target.value, 10))}
            className="w-full accent-[#3B82F6] cursor-pointer h-2 bg-[#E5E7EB] rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-[#9CA3AF] mt-1">
            <span>5 hrs (Part-time)</span>
            <span>15 hrs (Recommended)</span>
            <span>30 hrs (Intensive)</span>
          </div>
        </div>

        {/* Target date picker */}
        <div>
          <Input
            id="targetDate"
            type="date"
            label="Target Date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        {/* Summary display */}
        <div className="p-4 rounded-[8px] bg-[#EBF5FF] border border-[#BFDBFE] space-y-2">
          <p className="text-[14px] font-bold text-[#1E40AF]">
            Summary: {hoursPerWeek} hours/week for {calculatedWeeks} weeks = {totalHours} total hours
          </p>
          <div className="text-[12px] text-[#374151] space-y-1">
            <p className="font-semibold text-[#1E40AF]">Structured Plan Output:</p>
            <p className="leading-relaxed">
              Curriculum dynamically populated from database skill catalog, scheduled across 5 days/week with curated learning documentation.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          {onBack ? (
            <Button variant="secondary" onClick={onBack}>
              Back
            </Button>
          ) : <div />}

          <Button type="submit" variant="primary" loading={loading}>
            Create Plan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlan;
