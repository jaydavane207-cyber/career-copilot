// frontend/src/components/MockInterview/StartInterviewModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Mic,
  Play,
  Sparkles,
  Users,
  Code,
  Layers,
  Clock,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { mockInterviewService } from '../../services/mockInterviewService';

export const StartInterviewModal = ({ isOpen, onClose, onSessionStarted, existingDraft, onResumeDraft, onDiscardDraft }) => {
  const [interviewType, setInterviewType] = useState('Behavioral');
  const [role, setRole] = useState('Fullstack Developer');
  const [questionCount, setQuestionCount] = useState(5);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tracks = [
    {
      id: 'Behavioral',
      title: 'Behavioral Track',
      tagline: 'STAR Method & Culture Fit',
      description: 'Master leadership, conflict resolution, failure recovery, and communication scenarios.',
      icon: Users,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'Technical',
      title: 'Technical Fundamentals',
      tagline: 'Core CS & Framework Internals',
      description: 'Deep dive into REST, React Fiber, SQL/NoSQL, Docker, Node.js event loop, and web security.',
      icon: Code,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'System Design',
      title: 'System Architecture',
      tagline: 'High-Scale Distributed Systems',
      description: 'Architect Twitter feeds, TinyURL, distributed caching, real-time chat, and rate limiters.',
      icon: Layers,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  const handleStart = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const res = await mockInterviewService.getQuestions({
        type: interviewType,
        count: parseInt(questionCount, 10),
        role
      });

      if (res.success && res.questions?.length > 0) {
        const sessionConfig = {
          role,
          interviewType,
          timerEnabled,
          questions: res.questions,
          startedAt: Date.now()
        };
        if (onSessionStarted) {
          onSessionStarted(sessionConfig);
        }
        if (onClose) onClose();
      } else {
        setError('No questions returned for the selected filters. Please try another track.');
      }
    } catch (err) {
      console.error('Error starting interview session:', err);
      setError(err.response?.data?.message || 'Failed to initialize session. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl max-w-2xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Configure Mock Interview</h3>
            <p className="text-xs text-slate-500">Practice under timed simulation with instant rubric feedback.</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* In-Progress Draft Alert Banner */}
      {existingDraft && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              You have an unfinished <strong>{existingDraft.interviewType}</strong> interview session saved in draft.
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onResumeDraft}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resume
            </button>
            <button
              onClick={onDiscardDraft}
              className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-700 hover:bg-amber-100 font-semibold transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleStart} className="space-y-5">
        {/* Track Selection Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            1. Select Interview Track
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tracks.map((t) => {
              const Icon = t.icon;
              const isSelected = interviewType === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setInterviewType(t.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${t.badgeColor} border`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{t.tagline}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{t.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Question Count Dropdown (3, 5, 10) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Number of Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="3">3 Questions — Quick Sprint (6 mins)</option>
              <option value="5">5 Questions — Standard Interview (10 mins)</option>
              <option value="10">10 Questions — In-Depth Simulation (20 mins)</option>
            </select>
          </div>

          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Target Engineering Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Fullstack Developer">Fullstack Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Data Engineer">Data Engineer</option>
              <option value="QA Engineer">QA Engineer</option>
            </select>
          </div>
        </div>

        {/* Timer Toggle */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            <div>
              <span className="text-xs font-bold text-slate-800">2-Minute Question Countdown Timer</span>
              <p className="text-[10px] text-slate-400">Simulates real interview pacing with visual time alerts.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={timerEnabled}
              onChange={(e) => setTimerEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            {loading ? 'Fetching Questions & Initializing...' : `Start ${interviewType} Interview (${questionCount} Questions)`}
          </button>
        </div>
      </form>
    </div>
  );

  // If used as modal with isOpen prop
  if (isOpen !== undefined) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
        {modalContent}
      </div>
    );
  }

  // If embedded directly on page
  return modalContent;
};

export default StartInterviewModal;
