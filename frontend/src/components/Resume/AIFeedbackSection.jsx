// frontend/src/components/Resume/AIFeedbackSection.jsx
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  SpellCheck,
  MessageSquare,
  Award,
  Zap,
  BarChart2,
  Layout,
  ListOrdered,
  Download,
  Copy,
  ChevronRight,
  ShieldAlert,
  Wand2,
  FileText
} from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import FeedbackCard from './FeedbackCard';
import ImprovedResumeModal from './ImprovedResumeModal';

/**
 * AIFeedbackSection Component
 * Comprehensive AI-powered resume analysis with Google Gemini
 */
export const AIFeedbackSection = ({ resumeId }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [improvedResume, setImprovedResume] = useState('');
  const [generatingImproved, setGeneratingImproved] = useState(false);

  // Attempt to load existing/cached feedback on mount if resumeId is provided
  useEffect(() => {
    let isMounted = true;
    const fetchExistingFeedback = async () => {
      if (!resumeId) return;
      try {
        const res = await resumeService.getAIFeedback(resumeId);
        if (isMounted && res.success && res.data) {
          setFeedback(res.data);
        }
      } catch (err) {
        // Cached feedback not yet generated, silenty ignore initial 404
      }
    };

    fetchExistingFeedback();
    return () => {
      isMounted = false;
    };
  }, [resumeId]);

  const handleGenerateFeedback = async () => {
    if (!resumeId) {
      setError('Please upload or select a resume first to run AI feedback.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await resumeService.generateAIFeedback(resumeId);
      if (res.success && res.data) {
        setFeedback(res.data);
      } else {
        setError(res.message || 'Failed to generate AI feedback.');
      }
    } catch (err) {
      console.error('Error generating AI feedback:', err);
      const msg = err.response?.data?.message || err.message || 'Error occurred while contacting Gemini AI.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGetImprovedResume = async () => {
    if (!resumeId) return;

    try {
      setGeneratingImproved(true);
      setError('');
      const res = await resumeService.getImprovedResume(resumeId);
      if (res.success && res.data?.improvedResume) {
        setImprovedResume(res.data.improvedResume);
        setModalOpen(true);
      } else {
        setError(res.message || 'Failed to generate improved resume.');
      }
    } catch (err) {
      console.error('Error generating improved resume:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to generate improved resume with AI.';
      setError(msg);
    } finally {
      setGeneratingImproved(false);
    }
  };

  // Helper for overall score circular progress color
  const getOverallColor = (score = 0) => {
    if (score >= 67) return { stroke: '#16A34A', text: 'text-green-600', label: 'Strong Quality' };
    if (score >= 34) return { stroke: '#EA580C', text: 'text-orange-600', label: 'Average Quality' };
    return { stroke: '#DC2626', text: 'text-red-600', label: 'Needs Immediate Attention' };
  };

  // Helper for readability label
  const getReadabilityLabel = (score = 0) => {
    if (score >= 80) return { label: 'Excellent', text: 'text-green-600', desc: 'Highly scannable and easy for recruiters to digest.' };
    if (score >= 60) return { label: 'Good', text: 'text-blue-600', desc: 'Readable overall with minor formatting clutter.' };
    return { label: 'Needs Improvement', text: 'text-orange-600', desc: 'Dense blocks of text may hinder recruiter scanning.' };
  };

  const overallScore = feedback?.overallScore !== undefined ? feedback.overallScore : 0;
  const overallConfig = getOverallColor(overallScore);
  const readabilityScore = feedback?.readabilityScore !== undefined ? feedback.readabilityScore : 0;
  const readabilityConfig = getReadabilityLabel(readabilityScore);

  // SVG Circular progress math (120px diameter, radius = 50, circumference = 2 * PI * 50 = 314.159)
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  // Sorted improvements by priority
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sortedImprovements = (feedback?.topImprovements || []).slice().sort((a, b) => {
    const pA = priorityOrder[(a.priority || '').toLowerCase()] || 4;
    const pB = priorityOrder[(b.priority || '').toLowerCase()] || 4;
    return pA - pB;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
      {/* Top Banner / Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
              <Sparkles className="w-3.5 h-3.5" />
              Gemini AI Powered
            </span>
            <span className="text-xs text-gray-400">• Free Tier</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
            AI Resume Feedback & Optimization
          </h3>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Detailed 360° AI review assessing grammar, impact metrics, action verbs, executive tone, and recruiter readability.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleGenerateFeedback}
            disabled={loading || !resumeId}
            className="w-full md:w-auto px-5 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing with AI...</span>
              </>
            ) : feedback ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Re-Analyze with AI</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Get AI Feedback</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">AI Analysis Notice</p>
            <p className="mt-0.5 text-xs text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Initial Empty State before generation */}
      {!feedback && !loading && (
        <div className="text-center py-12 px-4 rounded-xl bg-gray-50 border border-dashed border-gray-300">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Wand2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">
            Ready to receive expert AI coaching?
          </h4>
          <p className="text-sm text-gray-600 max-w-md mx-auto mt-1 mb-6">
            Click <strong>"Get AI Feedback"</strong> above to evaluate spelling, quantifiable metrics, power verbs, and generate an improved resume rewrite with Gemini.
          </p>
          <button
            type="button"
            onClick={handleGenerateFeedback}
            disabled={!resumeId}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Resume Now</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton / Spinner State */}
      {loading && !feedback && (
        <div className="py-16 text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            <Sparkles className="w-6 h-6 text-blue-600 absolute inset-0 m-auto" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-900">
              Analyzing your resume with Gemini AI...
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Evaluating metrics, grammar, tone, action verbs, and ATS formatting standards.
            </p>
          </div>
        </div>
      )}

      {/* Feedback Results */}
      {feedback && (
        <div className="space-y-8 animate-fade-in">
          {/* Executive Summary Cards (Overall Score & Readability Score) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* a) Overall Score Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="relative w-[120px] h-[120px] flex-shrink-0">
                <svg className="w-[120px] h-[120px] -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke="#E5E7EB"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke={overallConfig.stroke}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className={`text-3xl font-extrabold ${overallConfig.text}`}>
                    {overallScore}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">
                    Score
                  </span>
                </div>
              </div>

              <div className="text-center sm:text-left flex-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Overall Score
                </span>
                <h4 className={`text-xl font-bold mt-0.5 ${overallConfig.text}`}>
                  {overallConfig.label}
                </h4>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                  Composite rating calculated across grammar, active voice, quantifiable impact, and recruiter readability.
                </p>
              </div>
            </div>

            {/* b) Readability Score Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Readability Score
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${readabilityConfig.text} bg-blue-50 border border-blue-200`}>
                    {readabilityConfig.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {readabilityScore}
                  </span>
                  <span className="text-gray-500 text-sm font-semibold">/100</span>
                </div>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {readabilityConfig.desc}
                </p>
              </div>

              {feedback.improvementSummary && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs italic text-gray-600">
                    "{feedback.improvementSummary}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* c) 6 Feedback Cards in 2-Column Grid */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">
              Detailed Category Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Grammar & Spelling */}
              <FeedbackCard
                title="Grammar & Spelling"
                icon={SpellCheck}
                score={feedback.grammar?.score}
                issues={feedback.grammar?.issues}
                suggestions={feedback.grammar?.suggestions}
              />

              {/* 2. Professional Tone */}
              <FeedbackCard
                title="Professional Tone"
                icon={MessageSquare}
                score={feedback.tone?.score}
                feedback={feedback.tone?.feedback}
                suggestions={feedback.tone?.suggestions}
              />

              {/* 3. Action Verbs */}
              <FeedbackCard
                title="Action Verbs"
                icon={Zap}
                score={feedback.actionVerbs?.score}
                currentVerbs={feedback.actionVerbs?.currentVerbs}
                suggestedVerbs={feedback.actionVerbs?.suggestedVerbs}
                suggestions={feedback.actionVerbs?.suggestions}
              />

              {/* 4. Quantifiable Results */}
              <FeedbackCard
                title="Quantifiable Results"
                icon={BarChart2}
                score={feedback.quantifiableResults?.score}
                found={feedback.quantifiableResults?.found}
                missing={feedback.quantifiableResults?.missing}
                suggestions={feedback.quantifiableResults?.suggestions}
              />

              {/* 5. Achievements */}
              <FeedbackCard
                title="Achievements"
                icon={Award}
                score={feedback.achievements?.score}
                feedback={feedback.achievements?.feedback}
                suggestions={feedback.achievements?.suggestions}
              />

              {/* 6. Formatting & Structure */}
              <FeedbackCard
                title="Formatting & Layout"
                icon={Layout}
                score={feedback.formatting?.score}
                issues={feedback.formatting?.issues}
                suggestions={feedback.formatting?.suggestions}
              />
            </div>
          </div>

          {/* Strengths & Weaknesses (2 Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* d) Strengths Section (green box) */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-bold text-green-900 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Your Strengths</span>
              </h4>
              <ul className="space-y-2">
                {(feedback.strengths || []).map((strength, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-green-950">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="leading-snug">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* e) Weaknesses Section (orange/amber box) */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-bold text-orange-900 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>Areas to Improve</span>
              </h4>
              <ul className="space-y-2">
                {(feedback.weaknesses || []).map((weakness, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-orange-950">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="leading-snug">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* f) Top Improvements Section */}
          {sortedImprovements.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Top Priority Improvements</span>
                </h4>
                <span className="text-xs text-gray-500">
                  Sorted by impact priority
                </span>
              </div>

              <div className="space-y-3">
                {sortedImprovements.map((item, idx) => {
                  const priority = (item.priority || 'medium').toLowerCase();
                  const badgeStyles =
                    priority === 'high'
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : priority === 'medium'
                      ? 'bg-amber-100 text-amber-700 border-amber-200'
                      : 'bg-blue-100 text-blue-700 border-blue-200';

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-100/70 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeStyles} flex-shrink-0 mt-0.5 sm:mt-0`}>
                          {priority}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 leading-snug">
                            {item.suggestion}
                          </p>
                          {item.category && (
                            <span className="text-xs text-gray-500 mt-1 inline-block capitalize">
                              Category: {item.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* g) Next Steps Section (blue box) */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-bold text-blue-900 flex items-center gap-2 mb-3">
              <ListOrdered className="w-5 h-5 text-blue-600" />
              <span>Recommended Next Steps</span>
            </h4>
            <ol className="space-y-2.5 pl-1">
              {(feedback.nextSteps || [
                'Incorporate specific metrics to your top 2 work experiences',
                'Replace repetitive action verbs with high-impact power alternatives',
                'Run resume through ATS checker again before job application submissions'
              ]).map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-blue-950 font-medium">
                  <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* h) "Get Improved Resume" Button (Purple-to-Pink gradient) */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              <p className="font-semibold text-gray-800">Want an AI-rewritten version ready to apply?</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Gemini will rewrite your resume applying power verbs, structure, and quantified impact.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGetImprovedResume}
              disabled={generatingImproved}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg text-white font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingImproved ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Improved Version...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Get Improved Resume</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Improved Resume Modal */}
      <ImprovedResumeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        improvedResume={improvedResume}
        resumeId={resumeId}
      />
    </div>
  );
};

export default AIFeedbackSection;
