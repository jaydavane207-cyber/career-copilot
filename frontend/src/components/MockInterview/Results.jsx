// frontend/src/components/MockInterview/Results.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Clock,
  Star,
  Download,
  BookOpen,
  RotateCcw,
  LayoutDashboard,
  Check,
  AlertTriangle
} from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';
import { downloadInterviewPDF } from '../../utils/interviewPdfReport';
import { CircularProgress } from '../UI/ProgressIndicators';
import Button from '../UI/Button';

export const Results = ({ result, onRestart, onViewAnswers }) => {
  if (!result) return null;

  const score = Math.round(result.overallScore || 0);
  const stats = result.sessionStats || {};
  const answersList = result.answers || result.questions || [];
  const totalQuestions = stats.totalQuestions || answersList.length || 0;
  const timeSpentSec = stats.timeSpent || 0;
  const timeFormatted = timeSpentSec
    ? `${Math.floor(timeSpentSec / 60)}m ${timeSpentSec % 60}s`
    : `${result.durationMinutes || 10}m`;
  const avgConfidence = stats.avgConfidence !== undefined ? stats.avgConfidence : '3.8';

  // Performance message config
  let performanceConfig = {
    message: "Great job! You're interview ready",
    subtext: "Your responses demonstrate solid depth, clear articulation, and strong familiarity with key concepts.",
    containerClass: "bg-[#D1FAE5] border-l-4 border-[#10B981] text-[#065F46]",
    icon: CheckCircle2
  };

  if (score < 50) {
    performanceConfig = {
      message: "More practice needed in technical concepts",
      subtext: "Review sample answers and core fundamentals to strengthen your responses.",
      containerClass: "bg-[#FEF3C7] border-l-4 border-[#F59E0B] text-[#92400E]",
      icon: AlertTriangle
    };
  } else if (score <= 75) {
    performanceConfig = {
      message: "Good progress, keep practicing",
      subtext: "You have a solid foundation. Continue refining your structure and technical depth.",
      containerClass: "bg-[#DBEAFE] border-l-4 border-[#3B82F6] text-[#1E40AF]",
      icon: Check
    };
  }

  const PerformanceIcon = performanceConfig.icon;

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1)] max-w-[800px] w-full mx-auto space-y-8 animate-fade-in">
      {/* Header & Score Summary */}
      <div className="text-center space-y-3">
        <h2 className="text-[24px] font-bold text-[#374151] tracking-[-0.5px]">
          Interview Results Summary
        </h2>
        <p className="text-[14px] text-[#6B7280]">
          Completed {result.interviewType} Interview Simulation for {result.role || 'Software Engineer'}
        </p>

        {/* Circular Progress Gauge */}
        <div className="pt-2 flex justify-center">
          <CircularProgress
            value={score}
            size={140}
            strokeWidth={10}
            label="Estimated Score"
          />
        </div>
      </div>

      {/* Performance Message Banner */}
      <div className={`p-4 rounded-[8px] flex items-start gap-3 ${performanceConfig.containerClass}`}>
        <PerformanceIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[15px] font-bold leading-tight">
            {performanceConfig.message}
          </p>
          <p className="text-[13px] opacity-90 mt-1 leading-relaxed">
            {performanceConfig.subtext}
          </p>
        </div>
      </div>

      {/* Metrics Row (Time Spent, Questions Answered, Average Confidence, Estimated Score) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Time spent */}
        <div className="p-4 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[#6B7280] text-[12px]">
            <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Time Spent</span>
          </div>
          <p className="text-[20px] font-bold text-[#374151]">{timeFormatted}</p>
        </div>

        {/* Questions answered */}
        <div className="p-4 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[#6B7280] text-[12px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Questions</span>
          </div>
          <p className="text-[20px] font-bold text-[#374151]">{totalQuestions}</p>
        </div>

        {/* Average confidence */}
        <div className="p-4 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[#6B7280] text-[12px]">
            <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
            <span>Avg Confidence</span>
          </div>
          <p className="text-[20px] font-bold text-[#374151]">{avgConfidence} / 5</p>
        </div>

        {/* Estimated Score */}
        <div className="p-4 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[#6B7280] text-[12px]">
            <Award className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Score</span>
          </div>
          <p className="text-[20px] font-bold text-[#3B82F6]">{score} / 100</p>
        </div>
      </div>

      {/* Strengths & Improvement Areas */}
      {((result.strengths && result.strengths.length > 0) || (result.areasForImprovement && result.areasForImprovement.length > 0)) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-[8px] bg-[#D1FAE5]/30 border border-[#A7F3D0] space-y-2">
            <h4 className="text-[13px] font-bold text-[#065F46] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              Observed Strengths
            </h4>
            <ul className="text-[12px] text-[#064E3B] space-y-1">
              {(result.strengths || ['Good attempt across questions']).map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="font-bold text-[#10B981]">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-[8px] bg-[#FEF3C7]/40 border border-[#FDE68A] space-y-2">
            <h4 className="text-[13px] font-bold text-[#92400E] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              Areas to Improve
            </h4>
            <ul className="text-[12px] text-[#78350F] space-y-1">
              {(result.areasForImprovement || ['Practice pacing and quantitative depth']).map((a, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="font-bold text-[#F59E0B]">•</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Actions: Review Answers, Take Another Interview, Back to Dashboard */}
      <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {onViewAnswers && (
            <Button
              variant="primary"
              onClick={onViewAnswers}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Review Answers
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={onRestart}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Take Another Interview
          </Button>

          <button
            onClick={() => downloadInterviewPDF(result)}
            className="btn-text flex items-center gap-1.5 text-[13px]"
            title="Download PDF Report"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>

        <Link
          to="/dashboard"
          className="text-[14px] font-semibold text-[#3B82F6] hover:text-[#2563EB] flex items-center gap-1.5 transition-colors py-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Results;
