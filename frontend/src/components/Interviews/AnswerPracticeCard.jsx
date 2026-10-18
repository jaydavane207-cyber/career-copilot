// frontend/src/components/Interviews/AnswerPracticeCard.jsx
import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  Send,
  RotateCcw,
  Tag,
  Copy,
  Check
} from 'lucide-react';
import interviewService from '../../services/interviewService';

export const AnswerPracticeCard = ({
  question = 'Tell me about a complex technical challenge you solved and how you measured its success.',
  role = 'Software Engineer',
  company = '',
  onSaveAsNote = null
}) => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');
  const [isSuggestedOpen, setIsSuggestedOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [savedNote, setSavedNote] = useState(false);

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  const handleGetFeedback = async () => {
    if (!answer.trim()) {
      setError('Please type your answer before requesting AI feedback.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await interviewService.getAnswerFeedback(question, answer, role, company);
      if (res && res.data) {
        setFeedback(res.data);
      } else {
        throw new Error('Invalid feedback response');
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to analyze answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySuggested = () => {
    if (feedback?.suggestedBetterAnswer) {
      navigator.clipboard.writeText(feedback.suggestedBetterAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveNote = () => {
    if (onSaveAsNote && feedback) {
      onSaveAsNote(`Question: ${question}\nCandidate Answer: ${answer}\nAI Score: ${feedback.score}/100\nKey Improvements: ${feedback.improvements?.join('; ')}`);
      setSavedNote(true);
      setTimeout(() => setSavedNote(false), 2500);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (score >= 60) return 'text-blue-600 border-blue-500 bg-blue-50';
    if (score >= 40) return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-rose-600 border-rose-500 bg-rose-50';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border-b border-gray-100 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              AI Answer Evaluator
            </span>
            {company && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {company} Focus
              </span>
            )}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              {role}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug">
            "{question}"
          </h3>
        </div>

        {feedback && (
          <div className={`px-3 py-1.5 rounded-xl border flex flex-col items-center flex-shrink-0 ${getScoreColor(feedback.score)}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider">AI Score</span>
            <span className="text-xl font-black">{feedback.score}</span>
          </div>
        )}
      </div>

      {/* Answer Input Section */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              if (error) setError('');
            }}
            placeholder="Type your response using the STAR method: Situation, Task, Action taken, and measurable Result..."
            rows={4}
            className="w-full p-3.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 leading-relaxed"
          />
          <div className="flex items-center justify-between mt-1 px-1 text-[11px] text-gray-400">
            <span>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
            <span>Target: 60 - 150 words for optimal depth</span>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            {error}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGetFeedback}
              disabled={loading || !answer.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                  <span>Get AI Feedback</span>
                </>
              )}
            </button>

            {answer && !loading && (
              <button
                type="button"
                onClick={() => {
                  setAnswer('');
                  setFeedback(null);
                }}
                className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {onSaveAsNote && feedback && (
            <button
              type="button"
              onClick={handleSaveNote}
              className="px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              {savedNote ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Saved to Notes</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Save as Note</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* AI Feedback Results Card */}
      {feedback && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-5 space-y-4 animate-fade-in">
          {/* Summary Quote */}
          {feedback.feedbackSummary && (
            <p className="text-xs text-gray-700 font-semibold italic bg-blue-50/70 p-3 rounded-xl border border-blue-200/60 leading-relaxed">
              💡 {feedback.feedbackSummary}
            </p>
          )}

          {/* Tags */}
          {feedback.tags && feedback.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-gray-400">Evaluated on:</span>
              {feedback.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 shadow-2xs"
                >
                  #{tag.replace('_', ' ')}
                </span>
              ))}
            </div>
          )}

          {/* Strengths & Improvements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Strengths */}
            <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 shadow-2xs space-y-2">
              <h4 className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Key Strengths</span>
              </h4>
              <ul className="space-y-1.5">
                {(feedback.strengths || []).map((s, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-1.5 leading-relaxed">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
              <h4 className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>High-Impact Improvements</span>
              </h4>
              <ul className="space-y-1.5">
                {(feedback.improvements || []).map((imp, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-1.5 leading-relaxed">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Collapsible Suggested Better Answer */}
          {feedback.suggestedBetterAnswer && (
            <div className="bg-white rounded-xl border border-blue-200 shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setIsSuggestedOpen((prev) => !prev)}
                className="w-full px-4 py-2.5 bg-blue-50/60 hover:bg-blue-100/60 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-extrabold text-blue-900">
                    Suggested High-Scoring Model Answer (STAR Method)
                  </span>
                </div>
                {isSuggestedOpen ? (
                  <ChevronUp className="w-4 h-4 text-blue-700" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-blue-700" />
                )}
              </button>

              {isSuggestedOpen && (
                <div className="p-4 space-y-2.5">
                  <p className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed font-sans bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                    {feedback.suggestedBetterAnswer}
                  </p>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCopySuggested}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Model Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerPracticeCard;
