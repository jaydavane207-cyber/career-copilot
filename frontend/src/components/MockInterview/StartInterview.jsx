// frontend/src/components/MockInterview/StartInterview.jsx
import React, { useState } from 'react';
import { Mic, Play, Sparkles } from 'lucide-react';
import { mockInterviewService } from '../../services/dashboardService';

export const StartInterview = ({ onSessionStarted }) => {
  const [role, setRole] = useState('Fullstack Developer');
  const [interviewType, setInterviewType] = useState('Technical');
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleStart = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await mockInterviewService.startSession({
        role,
        interviewType,
        questionCount: parseInt(questionCount, 10)
      });
      if (res.success && onSessionStarted) {
        onSessionStarted(res.session);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Mic className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-slate-900 text-base">Launch Simulated Mock Interview</h3>
      </div>
      <p className="text-xs text-slate-500">
        Practice targeted technical, system design, or behavioral interview questions under timed simulation with instant rubric evaluation.
      </p>

      <form onSubmit={handleStart} className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Target Engineering Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field">
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Fullstack Developer">Fullstack Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Data Engineer">Data Engineer</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Interview Track</label>
            <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)} className="input-field">
              <option value="Technical">Technical Fundamentals</option>
              <option value="Behavioral">Behavioral (STAR Method)</option>
              <option value="System Design">System Architecture</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Question Count</label>
            <select value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} className="input-field">
              <option value="3">3 Questions (Express)</option>
              <option value="5">5 Questions (Standard)</option>
              <option value="8">8 Questions (In-depth)</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full btn-primary text-xs py-2.5">
          <Play className="w-4 h-4" />
          {loading ? 'Initializing Session...' : 'Start Interview Session'}
        </button>
      </form>
    </div>
  );
};

export default StartInterview;
