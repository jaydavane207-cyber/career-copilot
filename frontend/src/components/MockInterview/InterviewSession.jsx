// frontend/src/components/MockInterview/InterviewSession.jsx
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Send, Clock, HelpCircle } from 'lucide-react';

export const InterviewSession = ({ session, onSubmitAnswers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(
    session.questions.map(q => ({ ...q, userResponse: '' }))
  );
  const [submitting, setSubmitting] = useState(false);

  const currentQ = answers[currentIndex];

  const handleResponseChange = (text) => {
    const updated = [...answers];
    updated[currentIndex].userResponse = text;
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

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await onSubmitAnswers({
        role: session.role,
        interviewType: session.interviewType,
        answers
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
            {session.interviewType} • {session.role}
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Question {currentIndex + 1} of {answers.length}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Active Simulation</span>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        <p className="text-sm font-semibold text-slate-800 leading-relaxed">
          {currentQ.question}
        </p>
        <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
          Category: {currentQ.category}
        </span>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Your Response (Type or dictate your structured explanation)
        </label>
        <textarea
          rows={6}
          value={currentQ.userResponse}
          onChange={(e) => handleResponseChange(e.target.value)}
          placeholder="Structure your answer clearly with core concepts, practical tradeoffs, and relevant metrics..."
          className="input-field"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Words: {currentQ.userResponse.trim().split(/\s+/).filter(Boolean).length}
        </p>
      </div>

      {/* Navigation & Submission */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="btn-secondary text-xs disabled:opacity-40"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Previous
        </button>

        {currentIndex === answers.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? 'Submitting & Evaluating...' : 'Finish & View Rubric Feedback'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-primary text-xs"
          >
            Next Question
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;
