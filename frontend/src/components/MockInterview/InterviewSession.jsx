// frontend/src/components/MockInterview/InterviewSession.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Send,
  Clock,
  Pause,
  Play,
  RotateCcw,
  Star,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  X,
  Save,
  CheckCircle2
} from 'lucide-react';

const DRAFT_KEY = 'career_copilot_interview_draft';
const QUESTION_TIME_SECONDS = 120; // 2 minutes per question

export const InterviewSession = ({ session, onSubmitAnswers, onExitSession }) => {
  const [currentIndex, setCurrentIndex] = useState(session.draftCurrentIndex || 0);
  const [answers, setAnswers] = useState(() => {
    if (session.draftAnswers && Array.isArray(session.draftAnswers)) {
      return session.draftAnswers;
    }
    return session.questions.map(q => ({
      questionId: q.id || q.questionId,
      id: q.id || q.questionId,
      question: q.question,
      category: q.category || 'Core',
      type: q.type || session.interviewType || 'Technical',
      expectedKeywords: q.expectedKeywords || [],
      userAnswer: '',
      confidence: 3,
      answerLength: 0
    }));
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    return session.draftTimeLeft !== undefined ? session.draftTimeLeft : QUESTION_TIME_SECONDS;
  });
  const [timerRunning, setTimerRunning] = useState(Boolean(session.timerEnabled !== false));
  const [totalElapsedTime, setTotalElapsedTime] = useState(session.draftTotalElapsedTime || 0);
  const [submitting, setSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [autoSavedNotice, setAutoSavedNotice] = useState(false);

  const currentQ = answers[currentIndex] || {};
  const isLastQuestion = currentIndex === answers.length - 1;

  // Persist draft progress to localStorage
  useEffect(() => {
    const draftPayload = {
      role: session.role,
      interviewType: session.interviewType,
      timerEnabled: session.timerEnabled,
      questions: session.questions,
      draftAnswers: answers,
      draftCurrentIndex: currentIndex,
      draftTimeLeft: timeLeft,
      draftTotalElapsedTime: totalElapsedTime,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftPayload));
      setAutoSavedNotice(true);
      const timer = setTimeout(() => setAutoSavedNotice(false), 1800);
      return () => clearTimeout(timer);
    } catch (e) {
      console.warn('Failed to save interview draft to localStorage:', e);
    }
  }, [answers, currentIndex, timeLeft, totalElapsedTime, session]);

  // Total elapsed timer & question countdown timer
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTotalElapsedTime(prev => prev + 1);

      if (session.timerEnabled !== false) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0; // timer reached zero
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, session.timerEnabled]);

  // When changing questions, reset the 2-minute timer if countdown is enabled
  const resetQuestionTimer = () => {
    if (session.timerEnabled !== false) {
      setTimeLeft(QUESTION_TIME_SECONDS);
    }
  };

  const handleResponseChange = (text) => {
    const updated = [...answers];
    updated[currentIndex] = {
      ...updated[currentIndex],
      userAnswer: text,
      answerLength: text.trim().length
    };
    setAnswers(updated);
  };

  const handleConfidenceChange = (val) => {
    const updated = [...answers];
    updated[currentIndex] = {
      ...updated[currentIndex],
      confidence: val
    };
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < answers.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetQuestionTimer();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetQuestionTimer();
    }
  };

  const executeSubmission = async () => {
    try {
      setSubmitting(true);
      const formattedAnswers = answers.map(a => ({
        questionId: a.questionId || a.id,
        question: a.question,
        category: a.category,
        userAnswer: a.userAnswer,
        confidence: a.confidence,
        answerLength: a.userAnswer ? a.userAnswer.trim().length : 0
      }));

      const avgConfidence = Number(
        (answers.reduce((acc, a) => acc + (a.confidence || 3), 0) / answers.length).toFixed(1)
      );

      const payload = {
        role: session.role || 'Fullstack Developer',
        interviewType: session.interviewType || 'Technical',
        answers: formattedAnswers,
        sessionStats: {
          totalQuestions: answers.length,
          timeSpent: totalElapsedTime,
          avgConfidence
        },
        durationMinutes: Math.max(1, Math.round(totalElapsedTime / 60))
      };

      // Clear the local draft upon final submission
      localStorage.removeItem(DRAFT_KEY);

      await onSubmitAnswers(payload);
    } catch (err) {
      console.error('Failed to submit answers:', err);
    } finally {
      setSubmitting(false);
      setShowFinishConfirm(false);
    }
  };

  const handleFinishClick = () => {
    const unansweredCount = answers.filter(a => !a.userAnswer || a.userAnswer.trim().length === 0).length;
    if (unansweredCount > 0) {
      setShowFinishConfirm(true);
    } else {
      executeSubmission();
    }
  };

  const handleExitDiscard = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowExitConfirm(false);
    if (onExitSession) onExitSession();
  };

  // Timer format helpers
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatTotalTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const confidenceLabels = {
    1: '1 - Low Confidence / Need Revision',
    2: '2 - Basic Familiarity',
    3: '3 - Moderate Understanding',
    4: '4 - Strong & Confident',
    5: '5 - Mastered & Thorough'
  };

  const progressPercent = Math.round(((currentIndex + 1) / answers.length) * 100);
  const wordCount = currentQ.userAnswer ? currentQ.userAnswer.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Session Ribbon */}
      <div className="bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[11px] uppercase tracking-wider border border-indigo-400/30">
            {session.interviewType} Track
          </span>
          <span className="text-xs text-slate-300 font-medium">
            Role: <strong>{session.role}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {/* Autosaved Indicator */}
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Save className={`w-3.5 h-3.5 ${autoSavedNotice ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className={autoSavedNotice ? 'text-emerald-300' : 'text-slate-400'}>
              {autoSavedNotice ? 'Draft Autosaved' : 'Progress Saved'}
            </span>
          </div>

          {/* Total Session Time */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Session: {formatTotalTime(totalElapsedTime)}</span>
          </div>

          {/* Exit Button */}
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-slate-400 hover:text-white transition-colors p-1"
            title="Exit Session"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5">
        <div
          className="bg-indigo-600 h-1.5 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question & Answer Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Question Header & Countdown Timer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                Question {currentIndex + 1} of {answers.length}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {currentQ.category || 'Core Competency'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* 2-Minute Per-Question Countdown Timer */}
          {session.timerEnabled !== false && (
            <div className="flex-shrink-0 flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                  timeLeft <= 30
                    ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                    : timeLeft <= 60
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title={timerRunning ? 'Pause Timer' : 'Resume Timer'}
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Large Mobile-Friendly Textarea for Answer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <label htmlFor="interview-answer" className="flex items-center gap-1.5">
              <span>Your Answer</span>
              <span className="text-[11px] font-normal text-slate-400">
                (Structure clearly with STAR framework, metrics, or architecture)
              </span>
            </label>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{(currentQ.userAnswer || '').length} chars</span>
            </div>
          </div>

          <textarea
            id="interview-answer"
            rows={8}
            value={currentQ.userAnswer || ''}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder="Type your comprehensive response here... For behavioral questions, detail Situation, Task, Action, and Result. For technical/system design, explain core trade-offs, protocols, caching, and throughput considerations."
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all leading-relaxed resize-y font-sans"
          />
        </div>

        {/* Interactive Confidence Rating Slider (1-5 Stars) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
            <div>
              <span className="text-xs font-bold text-slate-800">Rate Your Confidence in this Answer</span>
              <p className="text-[10px] text-slate-500">Helps algorithm detect knowledge gaps and tailor practice drills.</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
              {confidenceLabels[currentQ.confidence || 3]}
            </span>
          </div>

          {/* Star selector buttons + range slider */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((starVal) => {
              const isActive = (currentQ.confidence || 3) >= starVal;
              return (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => handleConfidenceChange(starVal)}
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? 'text-amber-500 hover:text-amber-600 scale-105'
                      : 'text-slate-300 hover:text-slate-400'
                  }`}
                  title={`Set confidence to ${starVal} of 5`}
                >
                  <Star className={`w-5 h-5 ${isActive ? 'fill-amber-400 text-amber-500' : ''}`} />
                </button>
              );
            })}

            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={currentQ.confidence || 3}
              onChange={(e) => handleConfidenceChange(parseInt(e.target.value, 10))}
              className="ml-3 flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Navigation & Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {isLastQuestion ? (
              <button
                onClick={handleFinishClick}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-100 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Submitting & Evaluating...' : 'Finish Interview & View Feedback'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all flex items-center gap-2"
              >
                Next Question
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-amber-600">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h4 className="font-bold text-slate-900 text-base">Leave Interview Session?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your typed answers are saved in your browser draft. You can resume later, or discard your draft to start fresh.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
              >
                Continue Interview
              </button>
              <button
                onClick={handleExitDiscard}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs"
              >
                Discard & Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finish with Unanswered Questions Confirm Modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-amber-600">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h4 className="font-bold text-slate-900 text-base">Unanswered Questions Remaining</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Some questions do not have an answer written yet. Empty questions will be scored as 0. Are you ready to submit your session for evaluation?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
              >
                Go Back & Complete
              </button>
              <button
                onClick={executeSubmission}
                disabled={submitting}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
              >
                {submitting ? 'Submitting...' : 'Submit Anyway'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
