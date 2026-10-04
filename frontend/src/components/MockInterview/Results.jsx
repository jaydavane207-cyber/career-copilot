// frontend/src/components/MockInterview/Results.jsx
import React from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Star,
  Download,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';
import { downloadInterviewPDF } from '../../utils/interviewPdfReport';

export const Results = ({ result, onRestart, onViewAnswers }) => {
  if (!result) return null;

  const score = Math.round(result.overallScore || 0);
  const stats = result.sessionStats || {};
  const answersList = result.answers || result.questions || [];
  const totalQuestions = stats.totalQuestions || answersList.length || 0;
  const timeSpentSec = stats.timeSpent || 0;
  const timeFormatted = timeSpentSec ? `${Math.floor(timeSpentSec / 60)}m ${timeSpentSec % 60}s` : `${result.durationMinutes || 10}m`;
  const avgConfidence = stats.avgConfidence !== undefined ? stats.avgConfidence : '3.8';

  // Unique topics covered
  const topicsCovered = [...new Set(answersList.map(a => a.category).filter(Boolean))];

  // Badge colors
  const badgeColor = score >= 75
    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
    : score >= 50
    ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-indigo-700 bg-indigo-50 border-indigo-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8 animate-fadeIn">
      {/* Top Banner / Evaluation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">
              Performance Scorecard
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
              {result.interviewType}
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Interview Simulation Completed
          </h3>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            {result.feedbackSummary || 'Evaluation complete based on structured keyword matching and conceptual depth.'}
          </p>
        </div>

        {/* Big Score Card */}
        <div className={`flex items-center gap-4 px-5 py-3 rounded-2xl border ${badgeColor} shadow-sm`}>
          <div className="p-2.5 rounded-xl bg-white/80 shadow-xs">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-3xl font-black tracking-tight">{formatPercentage(score)}</span>
            <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">
              Rubric Score
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Row (Time, Questions, Avg Confidence, Performance) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Time Spent */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Time Spent</span>
          </div>
          <p className="text-lg font-black text-slate-900">{timeFormatted}</p>
          <span className="text-[10px] text-slate-400 font-medium">Active simulation</span>
        </div>

        {/* Questions Answered */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Questions Answered</span>
          </div>
          <p className="text-lg font-black text-slate-900">{totalQuestions} / {totalQuestions}</p>
          <span className="text-[10px] text-slate-400 font-medium">100% completion</span>
        </div>

        {/* Average Confidence */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Avg Confidence</span>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-lg font-black text-slate-900">{avgConfidence}</p>
            <span className="text-xs text-slate-400 font-bold">/ 5.0</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Self assessment</span>
        </div>

        {/* Target Role */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
            <span>Tracked Role</span>
          </div>
          <p className="text-sm font-black text-slate-900 truncate">{result.role || 'Fullstack Developer'}</p>
          <span className="text-[10px] text-slate-400 font-medium">Profile matched</span>
        </div>
      </div>

      {/* Topics Covered Badges */}
      {topicsCovered.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag className="w-3.5 h-3.5 text-indigo-600" />
            <span>Topics & Categories Covered in this Session</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {topicsCovered.map((topic, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Improvement Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Observed Strengths</h4>
          </div>
          <ul className="text-xs text-emerald-950 space-y-1.5">
            {result.strengths && result.strengths.length > 0 ? (
              result.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">•</span>
                  <span>{s}</span>
                </li>
              ))
            ) : (
              <li className="italic text-slate-500">Good attempt across questions.</li>
            )}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Target Improvement Areas</h4>
          </div>
          <ul className="text-xs text-amber-950 space-y-1.5">
            {result.areasForImprovement && result.areasForImprovement.length > 0 ? (
              result.areasForImprovement.map((a, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-amber-600">•</span>
                  <span>{a}</span>
                </li>
              ))
            ) : (
              <li className="italic text-slate-500">Practice pacing and quantitative metrics.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => downloadInterviewPDF(result)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            Export Answers as PDF
          </button>
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            Start Another Session
          </button>
        </div>

        {onViewAnswers && (
          <button
            onClick={onViewAnswers}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            View Sample Answers & Rubric
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Results;
