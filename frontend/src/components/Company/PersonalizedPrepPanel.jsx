// frontend/src/components/Company/PersonalizedPrepPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  Zap,
  Clock,
  CheckCircle2,
  Play,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import companyService from '../../services/companyService';

export const PersonalizedPrepPanel = ({ company, prepData, onPracticeQuestion, onTabChange }) => {
  const [recommendedQuestions, setRecommendedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const prep = prepData || {
    role: 'Senior Software Engineer',
    interview_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    questions_practiced: 5,
    mock_interviews_done: 1,
    readiness_score: 47
  };

  const readinessScore = prep.readiness_score || prep.readinessScore || 45;
  const questionsPracticed = prep.questions_practiced || prep.questionsPracticed || 0;
  const mockInterviewsDone = prep.mock_interviews_done || prep.mockInterviewsDone || 0;

  const targetQuestions = 15;
  const targetMocks = 3;

  // Calculate days remaining
  const calculateDays = () => {
    if (!prep.interview_date && !prep.interviewDate) return 30;
    const target = new Date(prep.interview_date || prep.interviewDate);
    const today = new Date();
    return Math.max(1, Math.ceil((target - today) / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = calculateDays();

  useEffect(() => {
    if (company?.id) {
      loadRecommended();
    }
  }, [company?.id, prep.role]);

  const loadRecommended = async () => {
    try {
      setLoading(true);
      const data = await companyService.getCompanyQuestions(company.id, {
        role: prep.role || 'Senior Software Engineer'
      });
      if (data.questions && data.questions.length > 0) {
        setRecommendedQuestions(data.questions.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to load recommended questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = recommendedQuestions[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
      
      {/* Top Header & Readiness Indicator */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Active Personalized Prep Plan
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            Preparing for {company?.name} • {prep.role || 'Software Engineer'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            Interview target: {prep.interview_date || prep.interviewDate} ({daysRemaining} days away)
          </p>
        </div>

        {/* Circular / Scorecard Readiness Meter */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex-shrink-0">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600 transition-all duration-700 ease-out"
                strokeDasharray={`${readinessScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-extrabold text-base text-gray-900">
              {readinessScore}%
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs font-bold text-gray-900 block">Interview Readiness</span>
            <span className="text-[11px] text-gray-500">
              {readinessScore >= 80 ? 'Peak readiness condition' : readinessScore >= 50 ? 'Steady progress' : 'Ramping up'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Breakdown Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Questions Practiced */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-gray-700">Questions Practiced</span>
            <span className="text-blue-600 font-bold">{questionsPracticed} / {targetQuestions}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (questionsPracticed / targetQuestions) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400">Target: {targetQuestions} high-frequency company questions</p>
        </div>

        {/* Mock Interviews Done */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-gray-700">Mock Loops Completed</span>
            <span className="text-indigo-600 font-bold">{mockInterviewsDone} / {targetMocks}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (mockInterviewsDone / targetMocks) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400">Target: {targetMocks} timed mock sessions before your loop</p>
        </div>

      </div>

      {/* Recommended Next Question to Practice */}
      {nextQuestion && (
        <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Recommended Next Practice Question
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Asked ~{nextQuestion.frequency}x at {company?.name}
            </span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-snug">
            {nextQuestion.question}
          </h3>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 font-semibold text-gray-700">
                {nextQuestion.category}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 font-semibold text-gray-700">
                {nextQuestion.difficulty}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onPracticeQuestion && onPracticeQuestion(nextQuestion)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Practice Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Suggested Fast Actions */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Suggested Action Items:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            type="button"
            onClick={() => onTabChange && onTabChange('process')}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-left transition-colors flex items-center justify-between"
          >
            <span className="font-semibold text-gray-800">Review 4-Step Process</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>
          <button
            type="button"
            onClick={() => onTabChange && onTabChange('stories')}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-left transition-colors flex items-center justify-between"
          >
            <span className="font-semibold text-gray-800">Read Success Stories</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>
          <button
            type="button"
            onClick={() => onTabChange && onTabChange('salary')}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-left transition-colors flex items-center justify-between"
          >
            <span className="font-semibold text-gray-800">Check Salary Bands</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default PersonalizedPrepPanel;
