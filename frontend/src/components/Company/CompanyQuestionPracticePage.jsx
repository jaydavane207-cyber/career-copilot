// frontend/src/components/Company/CompanyQuestionPracticePage.jsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Clock,
  Send,
  HelpCircle,
  ThumbsUp,
  RotateCcw,
  Star,
  Award
} from 'lucide-react';
import companyService from '../../services/companyService';

export const CompanyQuestionPracticePage = ({ company, question, onBack, prepId, onProgressUpdated }) => {
  const [answer, setAnswer] = useState('');
  const [confidence, setConfidence] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  if (!question) return null;

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const tips = question.tips || [];
  const followUps = question.follow_up_questions || question.followUpQuestions || [];

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!answer.trim()) return;

    try {
      setSubmitting(true);
      const res = await companyService.submitPracticeAnswer(
        question.id,
        answer,
        confidence,
        prepId
      );

      if (res.evaluation) {
        setEvaluation(res.evaluation);
        if (onProgressUpdated && res.updatedPreparation) {
          onProgressUpdated(res.updatedPreparation);
        }
      }
    } catch (err) {
      console.error('Failed to evaluate practice answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setEvaluation(null);
    setAnswer('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {company?.name || 'Company'} Prep</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white border border-gray-200 p-0.5 flex items-center justify-center">
            {company?.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <span className="text-xs font-bold text-gray-800">{company?.name} Interview Practice</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-5">
        
        {/* Meta badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200">
              {question.category}
            </span>
            <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 font-semibold">
              {question.difficulty}
            </span>
            <span className="text-gray-400">• {question.role}</span>
          </div>

          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Asked ~{question.frequency || 8}x in real loops
          </span>
        </div>

        {/* Question Text */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
          {question.question}
        </h1>

        {/* Why this matters & tips */}
        {tips.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
            <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wide">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Tips from Candidates Who Got Hired at {company?.name}:
            </span>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-1">
              {tips.map((t, idx) => (
                <li key={idx} className="leading-relaxed">{t}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Practice Input Form or Evaluation Screen */}
        {!evaluation ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Your Answer & Structural Approach:
                </label>
                <span className="text-xs text-gray-400">{wordCount} words</span>
              </div>
              <textarea
                rows={8}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your structured solution, architectural trade-offs, or STAR behavioral breakdown here..."
                className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed font-sans shadow-xs"
              />
            </div>

            {/* Confidence Slider */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="font-bold text-gray-700">Self-Confidence Level:</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">Low</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-32 sm:w-44 accent-blue-600"
                />
                <span className="text-gray-400">High</span>
                <span className="font-bold text-blue-600 w-6 text-center">{confidence}/5</span>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !answer.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                {submitting ? (
                  <span>Evaluating Response...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for Company-Specific Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Evaluation & Comparison Results */
          <div className="space-y-6 pt-4 border-t border-gray-100 animate-fade-in">
            
            {/* Feedback Scorecard */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Answer Evaluation ({evaluation.quality})
                </span>
                <span className="text-xs text-emerald-700 font-semibold">
                  {evaluation.wordCount} words submitted
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {evaluation.feedback}
              </p>
              <div className="pt-2 text-xs text-emerald-900 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {evaluation.cultureAlignment}
              </div>
            </div>

            {/* Model Sample Answer */}
            <div className="space-y-2">
              <span className="font-bold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                Reference Answer (Successful Candidate Standard)
              </span>
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line font-sans">
                {evaluation.sampleAnswer}
              </div>
            </div>

            {/* Follow Up Questions */}
            {followUps.length > 0 && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Interviewer Follow-ups to Prepare:
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 pl-1">
                  {followUps.map((fu, idx) => (
                    <li key={idx}>{fu}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Answering Again</span>
              </button>

              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                Done & Return to Questions
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default CompanyQuestionPracticePage;
