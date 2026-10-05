// frontend/src/components/JobTracker/JobAnalyzerModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Clock,
  Briefcase,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
  Layers,
  RotateCw,
  Award
} from 'lucide-react';
import { jobService } from '../../services/jobService';

export const JobAnalyzerModal = ({
  isOpen,
  onClose,
  onJobAdded,
  existingJob = null
}) => {
  const navigate = useNavigate();
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showFullJD, setShowFullJD] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // If opened for an existing job that already has analysis
  useEffect(() => {
    if (existingJob) {
      if (existingJob.aiAnalysis) {
        setResult({
          job: {
            id: existingJob.id,
            title: existingJob.jobTitle || existingJob.positionTitle,
            company: existingJob.companyName,
            location: 'Remote / Hybrid',
            salary: existingJob.salary,
            source: existingJob.jobSource || 'other',
            url: existingJob.jobLink || existingJob.jobPostingUrl,
            jobDescription: existingJob.jobDescription,
            stage: existingJob.stage,
            dateApplied: existingJob.dateApplied,
            matchScore: existingJob.matchScore
          },
          analysis: existingJob.aiAnalysis,
          jobId: existingJob.id
        });
        setUrlInput(existingJob.jobLink || existingJob.jobPostingUrl || '');
        setSavedSuccess(true);
      } else if (existingJob.id) {
        // Fetch analysis from server
        loadExistingAnalysis(existingJob.id);
      }
    } else {
      setResult(null);
      setUrlInput('');
      setError(null);
      setSavedSuccess(false);
    }
  }, [existingJob, isOpen]);

  const loadExistingAnalysis = async (jobId) => {
    try {
      setLoading(true);
      const res = await jobService.getJobAnalysis(jobId);
      if (res.success && res.analysis) {
        setResult({
          job: res.job,
          analysis: res.analysis,
          jobId: res.job.id
        });
        setSavedSuccess(true);
      }
    } catch (err) {
      console.warn('Could not load existing job analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  // Animated loading step ticker
  useEffect(() => {
    let timer;
    if (loading) {
      setLoadingStep(0);
      const steps = [
        'Fetching job posting from source...',
        'Parsing job description & requirements...',
        'Matching against your resume & skill profile...',
        'Calculating match score & preparation roadmap...'
      ];
      let current = 0;
      timer = setInterval(() => {
        current = (current + 1) % steps.length;
        setLoadingStep(current);
      }, 900);
    }
    return () => clearInterval(timer);
  }, [loading]);

  if (!isOpen) return null;

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) {
      setError('Please enter a valid job URL.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setSavedSuccess(false);

      const res = await jobService.analyzeJobFromURL(urlInput.trim());

      if (res.success && res.data) {
        setResult(res.data);
        setSavedSuccess(true);
        if (onJobAdded) {
          onJobAdded(res.data.job);
        }
      } else {
        throw new Error(res.message || 'Scraping and analysis failed.');
      }
    } catch (err) {
      console.error('Job analysis error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to scrape job. Please verify the URL.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setUrlInput('');
    setError(null);
    setSavedSuccess(false);
  };

  const job = result?.job;
  const analysis = result?.analysis;
  const score = analysis?.matchScore ?? 0;

  // Determine score color theme
  const getScoreColor = (s) => {
    if (s >= 85) return { stroke: '#10B981', bg: 'bg-[#DCFCE7]', text: 'text-[#166534]', border: 'border-[#86EFAC]' };
    if (s >= 67) return { stroke: '#3B82F6', bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', border: 'border-[#93C5FD]' };
    if (s >= 35) return { stroke: '#F59E0B', bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]', border: 'border-[#FDE68A]' };
    return { stroke: '#EF4444', bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]', border: 'border-[#FCA5A5]' };
  };

  const scoreTheme = getScoreColor(score);

  // SVG Circular Meter math
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const loadingMessages = [
    'Fetching job posting from web page...',
    'Parsing job description & technology stack...',
    'Evaluating against your uploaded resume...',
    'Generating skill match & preparation tasks...'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[760px] bg-white rounded-[16px] shadow-2xl border border-[#E5E7EB] overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-gradient-to-r from-[#F8FAFC] to-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#111827] leading-tight">
                {result ? 'Job Analysis & Resume Match' : 'Analyze Real Job Posting'}
              </h2>
              <p className="text-[12px] text-[#6B7280]">
                {result ? `${job?.title} at ${job?.company}` : 'Paste any job posting URL to analyze fit and auto-save to tracker'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* URL Input Form (if no result or user wants to re-analyze) */}
          {!result && (
            <div className="space-y-4">
              <form onSubmit={handleAnalyze} className="space-y-3">
                <label className="block text-[13px] font-semibold text-[#374151]">
                  Job Posting URL
                </label>
                <div className="relative">
                  <LinkIcon className="w-5 h-5 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/jobs/view/123456789 or Indeed / Glassdoor link..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={loading}
                    className="w-full pl-11 pr-28 py-3 text-[14px] bg-[#F9FAFB] border border-[#D1D5DB] rounded-[10px] focus:outline-none focus:border-[#3B82F6] focus:bg-white focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-[#111827] placeholder:text-[#9CA3AF]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !urlInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#93C5FD] text-white text-[13px] font-semibold rounded-[8px] transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    {loading ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Analyze</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Supported Platforms Badges */}
              <div className="pt-2">
                <span className="text-[11px] font-medium text-[#6B7280] block mb-2">
                  Works with any web job posting:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'LinkedIn', color: 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30' },
                    { name: 'Indeed', color: 'bg-[#2164F3]/10 text-[#2164F3] border-[#2164F3]/30' },
                    { name: 'Glassdoor', color: 'bg-[#0CAA41]/10 text-[#0CAA41] border-[#0CAA41]/30' },
                    { name: 'Wellfound', color: 'bg-[#FF6154]/10 text-[#FF6154] border-[#FF6154]/30' },
                    { name: 'Greenhouse & Lever', color: 'bg-[#6B7280]/10 text-[#374151] border-[#6B7280]/30' },
                    { name: 'Company Careers Pages', color: 'bg-[#8B5CF6]/10 text-[#7C3AED] border-[#8B5CF6]/30' }
                  ].map((badge) => (
                    <span
                      key={badge.name}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-[6px] border ${badge.color}`}
                    >
                      {badge.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Error Notice */}
              {error && (
                <div className="p-3.5 rounded-[10px] bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-3 text-[#991B1B] animate-in fade-in">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#EF4444]" />
                  <div className="text-[13px]">
                    <p className="font-semibold">Unable to analyze posting</p>
                    <p className="mt-0.5">{error}</p>
                    <p className="mt-1 text-[12px] text-[#B91C1C]">
                      Tip: Ensure the link is a direct public job posting URL, or paste the text directly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading Animation State */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-[#E5E7EB] border-t-[#3B82F6] animate-spin" />
                <Sparkles className="w-6 h-6 text-[#3B82F6] absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#111827]">
                  Scraping & Analyzing Job Posting
                </h3>
                <p className="text-[13px] text-[#3B82F6] font-medium mt-1 animate-in fade-in duration-300">
                  {loadingMessages[loadingStep]}
                </p>
                <p className="text-[12px] text-[#9CA3AF] mt-2">
                  Takes approximately 2-4 seconds...
                </p>
              </div>
            </div>
          )}

          {/* Results State */}
          {result && !loading && (
            <div className="space-y-6">
              {/* Job Header Card */}
              <div className="p-4 rounded-[12px] bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] border border-[#E2E8F0] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-[4px] bg-[#3B82F6]/10 text-[#2563EB] border border-[#93C5FD]">
                        {job?.source || 'Job Posting'}
                      </span>
                      {savedSuccess && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-[4px] bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Auto-saved in Applications
                        </span>
                      )}
                    </div>
                    <h2 className="text-[20px] font-bold text-[#0F172A] leading-tight">
                      {job?.title || 'Software Engineer'}
                    </h2>
                    <p className="text-[15px] font-semibold text-[#334155] flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-[#64748B]" />
                      {job?.company || 'Company'}
                    </p>
                  </div>

                  {job?.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] bg-white border border-[#CBD5E1] rounded-[8px] hover:bg-[#F8FAFC] transition-colors shadow-2xs self-start"
                    >
                      <span>Open Posting</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-4 text-[13px] text-[#64748B] flex-wrap pt-1 border-t border-[#E2E8F0]/80">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>{job?.location || 'Remote'}</span>
                  </div>
                  {job?.salary && (
                    <div className="flex items-center gap-1 font-semibold text-[#059669]">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  {analysis?.requirements?.experienceRequired && (
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{analysis.requirements.experienceRequired}+ Yrs Exp</span>
                    </div>
                  )}
                  {analysis?.requirements?.seniority && (
                    <div className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{analysis.requirements.seniority} Level</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Match Score Card with Circular SVG Progress */}
              <div className="p-5 rounded-[14px] bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  {/* Circular Meter */}
                  <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r={radius}
                        className="stroke-[#E5E7EB]"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r={radius}
                        stroke={scoreTheme.stroke}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-[24px] font-black text-[#111827] leading-none">
                        {score}%
                      </span>
                      <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mt-0.5">
                        Match
                      </span>
                    </div>
                  </div>

                  {/* Level and Label */}
                  <div className="space-y-1 text-left">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-[6px] text-[12px] font-bold border ${scoreTheme.bg} ${scoreTheme.text} ${scoreTheme.border}`}
                    >
                      {analysis?.matchLevel || 'Match Calculated'}
                    </span>
                    <h3 className="text-[15px] font-bold text-[#111827]">
                      Resume & Skill Alignment
                    </h3>
                    <p className="text-[12px] text-[#6B7280] max-w-[340px]">
                      Calculated across required languages, frameworks, system design, and industry experience requirements.
                    </p>
                  </div>
                </div>

                {/* Experience Match Stat */}
                {analysis?.experienceMatch && (
                  <div className="text-right sm:border-l sm:border-[#E5E7EB] sm:pl-6 w-full sm:w-auto">
                    <div className="text-[11px] font-semibold text-[#6B7280] uppercase">
                      Experience Fit
                    </div>
                    <div className="text-[16px] font-bold text-[#111827] mt-0.5">
                      {analysis.experienceMatch.user} yrs / {analysis.experienceMatch.required} yrs
                    </div>
                    <div className="text-[11px] font-medium mt-0.5">
                      {analysis.experienceMatch.gap >= 0 ? (
                        <span className="text-[#10B981] font-semibold">✓ Meets expectation</span>
                      ) : (
                        <span className="text-[#F59E0B] font-semibold">Gap of {Math.abs(analysis.experienceMatch.gap)} yrs</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Match Breakdown 3-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Strong Matches */}
                <div className="p-3.5 rounded-[12px] bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
                  <div className="flex items-center justify-between text-[#166534]">
                    <div className="flex items-center gap-1.5 font-bold text-[13px]">
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                      <span>Strong Matches</span>
                    </div>
                    <span className="text-[11px] font-bold bg-[#DCFCE7] px-1.5 py-0.5 rounded-full">
                      {analysis?.skillMatches?.strong?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis?.skillMatches?.strong?.length > 0 ? (
                      analysis.skillMatches.strong.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[11px] font-medium bg-white text-[#166534] border border-[#86EFAC] rounded-[6px]"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[12px] text-[#6B7280] italic">None identified</span>
                    )}
                  </div>
                </div>

                {/* Partial Matches */}
                <div className="p-3.5 rounded-[12px] bg-[#FEFCE8] border border-[#FEF08A] space-y-2">
                  <div className="flex items-center justify-between text-[#854D0E]">
                    <div className="flex items-center gap-1.5 font-bold text-[13px]">
                      <Sparkles className="w-4 h-4 text-[#CA8A04]" />
                      <span>Partial Matches</span>
                    </div>
                    <span className="text-[11px] font-bold bg-[#FEF9C3] px-1.5 py-0.5 rounded-full">
                      {analysis?.skillMatches?.partial?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis?.skillMatches?.partial?.length > 0 ? (
                      analysis.skillMatches.partial.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[11px] font-medium bg-white text-[#854D0E] border border-[#FDE047] rounded-[6px]"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[12px] text-[#6B7280] italic">None identified</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-3.5 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] space-y-2">
                  <div className="flex items-center justify-between text-[#991B1B]">
                    <div className="flex items-center gap-1.5 font-bold text-[13px]">
                      <XCircle className="w-4 h-4 text-[#DC2626]" />
                      <span>Missing Skills</span>
                    </div>
                    <span className="text-[11px] font-bold bg-[#FEE2E2] px-1.5 py-0.5 rounded-full">
                      {analysis?.missingSkills?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis?.missingSkills?.length > 0 ? (
                      analysis.missingSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[11px] font-semibold bg-white text-[#DC2626] border border-[#FCA5A5] rounded-[6px]"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[12px] text-[#16A34A] font-medium">All core skills covered! 🎉</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary and Strengths / Gaps */}
              <div className="p-4 rounded-[12px] bg-white border border-[#E5E7EB] space-y-3">
                <h4 className="text-[14px] font-bold text-[#111827]">
                  Executive Fit Assessment
                </h4>
                <p className="text-[13px] text-[#4B5563] leading-relaxed">
                  {analysis?.summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* Strengths */}
                  <div className="space-y-1.5">
                    <span className="text-[12px] font-bold text-[#166534] uppercase tracking-wider block">
                      Key Strengths
                    </span>
                    <ul className="space-y-1 text-[12px] text-[#374151]">
                      {analysis?.strengths?.map((st, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0 mt-0.5" />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gaps */}
                  <div className="space-y-1.5">
                    <span className="text-[12px] font-bold text-[#DC2626] uppercase tracking-wider block">
                      Target Gaps
                    </span>
                    <ul className="space-y-1 text-[12px] text-[#374151]">
                      {analysis?.gaps?.map((gp, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                          <span>{gp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recommended Preparation Tasks */}
              {analysis?.recommendedPrep?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[14px] font-bold text-[#111827]">
                        Recommended Preparation Before You Apply
                      </h4>
                      <p className="text-[12px] text-[#6B7280]">
                        Prioritized study modules to maximize technical interview success
                      </p>
                    </div>
                    {analysis?.timeToReady && (
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-[6px] bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                        Est. {analysis.timeToReady}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {analysis.recommendedPrep.map((prep, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-[10px] bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all flex items-start justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                                prep.priority === 'high'
                                  ? 'bg-[#FEE2E2] text-[#B91C1C]'
                                  : 'bg-[#FEF3C7] text-[#B45309]'
                              }`}
                            >
                              {prep.priority} Priority
                            </span>
                            <span className="font-bold text-[13px] text-[#111827]">
                              {prep.name}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#4B5563]">
                            {prep.recommendation}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-[11px] font-semibold text-[#6B7280] block flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3 text-[#9CA3AF]" />
                            {prep.estimatedHours} hrs
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collapsible Scraped Job Description */}
              {job?.jobDescription && (
                <div className="border border-[#E5E7EB] rounded-[10px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowFullJD(!showFullJD)}
                    className="w-full px-4 py-2.5 bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#374151] flex items-center justify-between hover:bg-[#F3F4F6] transition-colors"
                  >
                    <span>View Scraped Job Description</span>
                    {showFullJD ? (
                      <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                    )}
                  </button>

                  {showFullJD && (
                    <div className="p-4 bg-white max-h-64 overflow-y-auto text-[12px] text-[#4B5563] leading-relaxed whitespace-pre-line border-t border-[#E5E7EB]">
                      {job.jobDescription}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between gap-3 flex-shrink-0">
          <div>
            {result && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[13px] font-medium text-[#6B7280] hover:text-[#111827] flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Analyze Another URL</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {result && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/study-plan');
                }}
                className="px-3.5 py-2 rounded-[8px] bg-white border border-[#D1D5DB] hover:bg-[#F3F4F6] text-[#374151] text-[13px] font-semibold transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                <span>Study Planner</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-[8px] bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[13px] font-semibold transition-colors shadow-xs"
            >
              {result ? 'Done' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAnalyzerModal;
