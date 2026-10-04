// frontend/src/components/MockInterview/AnswerReview.jsx
import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Download,
  ArrowLeft,
  Filter,
  Lightbulb,
  Check,
  Star,
  RotateCcw
} from 'lucide-react';
import { downloadInterviewPDF } from '../../utils/interviewPdfReport';

const IMPROVE_KEY = 'career_copilot_improve_questions';

export const AnswerReview = ({ session, onBackToResults, onRestart }) => {
  const [expandedIndices, setExpandedIndices] = useState(() => {
    // Default open the first question accordion
    return { 0: true };
  });

  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'improve'
  const [improveList, setImproveList] = useState(() => {
    try {
      const saved = localStorage.getItem(IMPROVE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const questions = session?.answers || session?.questions || [];

  // Toggle individual question accordion
  const toggleAccordion = (index) => {
    setExpandedIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Toggle "Mark as Improve This"
  const toggleImproveFlag = (qId) => {
    setImproveList(prev => {
      let updated;
      if (prev.includes(qId)) {
        updated = prev.filter(id => id !== qId);
      } else {
        updated = [...prev, qId];
      }
      try {
        localStorage.setItem(IMPROVE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save improve list to localStorage:', e);
      }
      return updated;
    });
  };

  const filteredQuestions = questions.filter(q => {
    if (filterMode === 'improve') {
      const qId = q.questionId || q.id;
      return improveList.includes(qId);
    }
    return true;
  });

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
        No question answers available for review.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header / Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">
            Detailed Rubric & Sample Solutions
          </span>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Answer Review & Key Takeaways
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare your response with high-scoring strong answer models and coaching frameworks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Filter Toggle: All vs Marked to Improve */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === 'all' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilterMode('improve')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                filterMode === 'improve' ? 'bg-white text-amber-600 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              Flagged ({improveList.length})
            </button>
          </div>

          <button
            onClick={() => downloadInterviewPDF(session)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            PDF
          </button>

          {onBackToResults && (
            <button
              onClick={onBackToResults}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Scorecard
            </button>
          )}
        </div>
      </div>

      {/* Questions Review List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400 space-y-2">
            <p>No questions currently marked as "Improve This".</p>
            <button
              onClick={() => setFilterMode('all')}
              className="text-indigo-600 font-bold hover:underline"
            >
              View all questions
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const qId = q.questionId || q.id;
            const isExpanded = Boolean(expandedIndices[idx]);
            const isFlagged = improveList.includes(qId);
            const sample = q.sampleAnswer || {};

            return (
              <div
                key={qId || idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Question Summary Bar */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
                        Question {idx + 1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                        {q.category || 'General'}
                      </span>
                      {q.difficulty && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200">
                          {q.difficulty}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Confidence Star Display */}
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>Confidence: {q.confidence || 3}/5</span>
                      </div>

                      {/* "Mark as Improve This" Button */}
                      <button
                        onClick={() => toggleImproveFlag(qId)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                          isFlagged
                            ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                        title={isFlagged ? 'Remove from review list' : 'Mark to practice later'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-white' : ''}`} />
                        <span>{isFlagged ? 'Marked for Review' : 'Improve This'}</span>
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h4>

                  {/* Your Answer Box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Your Submitted Answer
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                      {q.userAnswer || q.userResponse || (
                        <span className="italic text-slate-400">(No answer was written for this question)</span>
                      )}
                    </p>
                    <div className="pt-1 flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                      <span>Length: {q.answerLength || (q.userAnswer || '').length} characters</span>
                      {q.feedback && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-600 font-semibold">{q.feedback}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sample Answer Accordion Header */}
                <div
                  onClick={() => toggleAccordion(idx)}
                  className="px-5 sm:px-6 py-3.5 bg-indigo-50/40 border-t border-slate-200/80 hover:bg-indigo-50/70 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-900">
                      {isExpanded ? 'Hide Sample Solution & Rubric' : 'Show Strong Answer, Key Points & Coaching Tips'}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-indigo-700" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-indigo-700" />
                  )}
                </div>

                {/* Sample Answer Accordion Body */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-slate-50/40 border-t border-indigo-100/60 space-y-5 animate-fadeIn">
                    {/* Strong Answer Model */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Strong Answer Example</span>
                      </div>
                      <div className="p-4 rounded-xl bg-white border border-emerald-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans shadow-2xs">
                        {sample.strongAnswer || 'Practice structuring your thoughts clearly using concrete metrics and relevant terminology.'}
                      </div>
                    </div>

                    {/* Key Points Checklist */}
                    {sample.keyPoints && sample.keyPoints.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                          <Check className="w-4 h-4 text-indigo-600" />
                          <span>Key Concepts Checklist to Cover</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {sample.keyPoints.map((point, pIdx) => (
                            <div
                              key={pIdx}
                              className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2 shadow-2xs"
                            >
                              <div className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
                                ✓
                              </div>
                              <span className="leading-snug">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Coaching Tips */}
                    {sample.tips && (
                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
                        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider block">
                            Interviewer Coaching Tip
                          </span>
                          <p className="leading-relaxed">{sample.tips}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AnswerReview;
