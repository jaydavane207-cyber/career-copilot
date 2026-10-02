// frontend/src/components/StudyPlanner/CreatePlan.jsx
import React, { useState } from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { studyService } from '../../services/studyService';

export const CreatePlan = ({ onPlanCreated }) => {
  const [targetRole, setTargetRole] = useState('Fullstack Developer');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setGenerating(true);
      const res = await studyService.generatePlan({
        targetRole,
        durationWeeks: parseInt(durationWeeks, 10),
        hoursPerWeek: parseInt(hoursPerWeek, 10)
      });
      if (res.success && onPlanCreated) {
        onPlanCreated(res.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-slate-900 text-sm">Generate Custom Study Plan</h3>
      </div>
      <p className="text-xs text-slate-500">
        AI algorithm structures milestones and daily tasks based on missing technical skills.
      </p>

      <form onSubmit={handleGenerate} className="space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Target Role</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="input-field"
          >
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Fullstack Developer">Fullstack Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Data Engineer">Data Engineer</option>
            <option value="Machine Learning Engineer">Machine Learning Engineer</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Duration (Weeks)</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                min="1"
                max="12"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(e.target.value)}
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Hours / Week</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                min="2"
                max="40"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="input-field pl-9"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={generating}
          className="w-full btn-primary text-xs"
        >
          {generating ? 'Synthesizing Roadmap...' : 'Generate New Study Plan'}
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;
