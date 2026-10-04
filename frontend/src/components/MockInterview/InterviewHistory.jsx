// frontend/src/components/MockInterview/InterviewHistory.jsx
import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Star,
  Award,
  ChevronRight,
  BookOpen,
  Filter,
  Users,
  Code,
  Layers
} from 'lucide-react';
import { formatDate, formatPercentage } from '../../utils/formatters';

export const InterviewHistory = ({ history = [], onSelectSession, onStartNew }) => {
  const [filterType, setFilterType] = useState('All');

  const filteredHistory = history.filter(item => {
    if (filterType === 'All') return true;
    return (item.interviewType || '').toLowerCase() === filterType.toLowerCase();
  });

  const getTrackIcon = (type) => {
    const lower = (type || '').toLowerCase();
    if (lower.includes('behav')) return Users;
    if (lower.includes('system')) return Layers;
    return Code;
  };

  const getScoreBadge = (score) => {
    if (score >= 75) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  };

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-sm">No Mock Interviews Taken Yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Simulate your first real-world technical, behavioral, or system design interview to build confidence and view historical trends.
          </p>
        </div>
        {onStartNew && (
          <button
            onClick={onStartNew}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Start Your First Interview
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fadeIn">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-base font-black text-slate-900 tracking-tight">
            Past Interview Attempts ({history.length})
          </h4>
          <p className="text-xs text-slate-500">
            Click any session to review answers, strong sample solutions, and coaching rubrics.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          {['All', 'Behavioral', 'Technical', 'System Design'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                filterType === type ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No interview records found for track "{filterType}".
          </div>
        ) : (
          filteredHistory.map((item) => {
            const TrackIcon = getTrackIcon(item.interviewType);
            const stats = item.sessionStats || {};
            const answers = item.answers || item.questions || [];
            const qCount = stats.totalQuestions || answers.length || 0;
            const avgConf = stats.avgConfidence !== undefined ? stats.avgConfidence : '3.8';
            const timeSpentSec = stats.timeSpent || 0;
            const timeDisplay = timeSpentSec ? `${Math.floor(timeSpentSec / 60)}m ${timeSpentSec % 60}s` : `${item.durationMinutes || 10}m`;
            const score = Math.round(item.overallScore || 0);

            return (
              <div
                key={item.id}
                onClick={() => onSelectSession && onSelectSession(item)}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group shadow-2xs"
              >
                {/* Left: Icon & Meta */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-600 text-slate-600 flex items-center justify-center flex-shrink-0 transition-colors">
                    <TrackIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.interviewType} Interview
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {item.role || 'Fullstack Developer'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.completedAt || item.date || item.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeDisplay}
                      </span>
                      <span>•</span>
                      <span>{qCount} Questions</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {avgConf} / 5.0
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Score Badge & Arrow */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className={`px-3 py-1 rounded-xl border text-xs font-black ${getScoreBadge(score)}`}>
                    {formatPercentage(score)}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
