// frontend/src/components/MockInterview/InterviewSession.jsx
import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Send,
  Clock,
  Star,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
  Check
} from 'lucide-react';
import { LinearProgress } from '../UI/ProgressIndicators';
import Badge from '../UI/Badge';

const DRAFT_KEY = 'career_copilot_interview_draft';

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

  const [totalElapsedTime, setTotalElapsedTime] = useState(session.draftTotalElapsedTime || 0);
  const [submitting, setSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved'); // 'Saving...' | 'Saved'

  const currentQ = answers[currentIndex] || {};
  const isLastQuestion = currentIndex === answers.length - 1;

  // Persist draft progress to localStorage with saving indicator
  useEffect(() => {
    setSaveStatus('Saving...');
    const draftPayload = {
      role: session.role,
      interviewType: session.interviewType,
      timerEnabled: session.timerEnabled,
      questions: session.questions,
      draftAnswers: answers,
      draftCurrentIndex: currentIndex,
      draftTotalElapsedTime: totalElapsedTime,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftPayload));
      const timeout = setTimeout(() => {
        setSaveStatus('Saved');
      }, 400);
      return () => clearTimeout(timeout);
    } catch (e) {
      console.warn('Failed to save interview draft to localStorage:', e);
      setSaveStatus('Saved');
    }
  }, [answers, currentIndex, totalElapsedTime, session]);

  // Total elapsed timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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

  // Timer format: "Elapsed: X mins Y secs"
  const formatElapsedTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `Elapsed: ${mins} mins ${secs} secs`;
  };

  const progressPercent = Math.round(((currentIndex + 1) / answers.length) * 100);
  const charCount = (currentQ.userAnswer || '').length;

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden max-w-[1000px] mx-auto pb-24 relative">
      {/* 1. Header Bar */}
      <div className="p-6 border-b border-[#E5E7EB] bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[14px] font-bold text-[#3B82F6]">
              Question {currentIndex + 1} of {answers.length}
            </span>
            <span className="text-[12px] text-[#6B7280] ml-3">
              ({session.interviewType} Track)
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Auto-save Indicator */}
            <div className="flex items-center gap-1.5 text-[12px]">
              {saveStatus === 'Saving...' ? (
                <Save className="w-3.5 h-3.5 text-[#3B82F6] animate-pulse" />
              ) : (
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
              )}
              <span className={saveStatus === 'Saving...' ? 'text-[#3B82F6] font-medium' : 'text-[#10B981] font-medium'}>
                {saveStatus}
              </span>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#F3F4F6] text-[#374151] text-[12px] font-semibold">
              <Clock className="w-4 h-4 text-[#3B82F6]" />
              <span>{formatElapsedTimer(totalElapsedTime)}</span>
            </div>

            {/* Exit Button */}
            <button
              onClick={() => setShowExitConfirm(true)}
              className="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
              title="Exit Session"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <LinearProgress value={progressPercent} />
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* 2. Question Card: Background #EBF5FF, padding 32px, border radius 12px, Large font 20px bold */}
        <div className="bg-[#EBF5FF] p-8 rounded-[12px] border border-[#BFDBFE] space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="info">
              {currentQ.category || 'Technical Assessment'}
            </Badge>
            <span className="text-[12px] font-medium text-[#1E40AF]">
              Target: {session.role}
            </span>
          </div>
          <h2 className="text-[20px] font-bold text-[#1E3A8A] leading-[28px] tracking-[-0.5px]">
            {currentQ.question}
          </h2>
        </div>

        {/* 3. Answer Area: Large textarea (min height 300px), Character count, Auto-save indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[14px]">
            <label htmlFor="interview-answer" className="font-semibold text-[#374151]">
              Your Answer
            </label>
            <span className="text-[12px] text-[#6B7280]">
              {charCount} characters
            </span>
          </div>

          <textarea
            id="interview-answer"
            value={currentQ.userAnswer || ''}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder="Type your response here... Use structured communication (STAR format for behavioral, system principles and trade-offs for technical/architecture)."
            className="w-full min-h-[300px] p-4 text-[14px] text-[#374151] bg-white border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 leading-[21px] transition-all resize-y"
          />
        </div>

        {/* 4. Confidence Rating: 5-star or 1-5 slider: "How confident are you in this answer?" */}
        <div className="p-5 rounded-[12px] bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-[14px] font-semibold text-[#374151]">
                How confident are you in this answer?
              </p>
              <p className="text-[12px] text-[#6B7280]">
                Rating: Level {currentQ.confidence || 3} of 5
              </p>
            </div>

            {/* 5-Star Selection */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isActive = (currentQ.confidence || 3) >= starVal;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => handleConfidenceChange(starVal)}
                    className="p-1 text-[#F59E0B] hover:scale-110 transition-transform"
                    title={`Rate ${starVal} out of 5 stars`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        isActive
                          ? 'fill-[#F59E0B] text-[#F59E0B]'
                          : 'text-[#E5E7EB]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1-5 Slider */}
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={currentQ.confidence || 3}
            onChange={(e) => handleConfidenceChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-[#E5E7EB] rounded-[4px] appearance-none cursor-pointer accent-[#3B82F6]"
          />
        </div>
      </div>

      {/* 5. Navigation Buttons (Fixed / Sticky at bottom): Previous (gray), Next (blue), Finish Interview (orange, on last question) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-4 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <div>
          {isLastQuestion ? (
            <button
              type="button"
              onClick={handleFinishClick}
              disabled={submitting}
              className="px-6 py-2.5 rounded-[8px] bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold text-[14px] transition-all flex items-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Finish Interview'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-[12px] p-6 max-w-[440px] w-full shadow-xl space-y-4 animate-scale-up">
            <div className="flex items-center gap-2.5 text-[#F59E0B]">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-bold text-[#374151] text-[18px]">Leave Interview Session?</h3>
            </div>
            <p className="text-[14px] text-[#6B7280] leading-[21px]">
              Your typed answers are autosaved in your draft. You can resume later or discard to start fresh.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="btn-secondary"
              >
                Continue
              </button>
              <button
                onClick={handleExitDiscard}
                className="btn-danger"
              >
                Discard & Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finish with Unanswered Questions Confirm Modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-[12px] p-6 max-w-[440px] w-full shadow-xl space-y-4 animate-scale-up">
            <div className="flex items-center gap-2.5 text-[#F59E0B]">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-bold text-[#374151] text-[18px]">Unanswered Questions</h3>
            </div>
            <p className="text-[14px] text-[#6B7280] leading-[21px]">
              Some questions do not have an answer yet. Are you sure you want to finish and evaluate the interview now?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="btn-secondary"
              >
                Go Back
              </button>
              <button
                onClick={executeSubmission}
                disabled={submitting}
                className="btn-primary"
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
