// frontend/src/components/JobTracker/JobURLAnalyzerModal.jsx
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
  RotateCw,
  Copy,
  Download,
  Share2,
  ClipboardPaste,
  ShieldAlert,
  Flame,
  Check
} from 'lucide-react';
import { jobService } from '../../services/jobService';
import MatchBreakdown from './MatchBreakdown';
import PreparationTimeline from './PreparationTimeline';
import SkillRecommendations from './SkillRecommendations';

export const JobURLAnalyzerModal = ({
  isOpen,
  onClose,
  onJobAnalyzed,
  existingJob = null
}) => {
  const navigate = useNavigate();
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const [rateLimitTimer, setRateLimitTimer] = useState(0);
  const [result, setResult] = useState(null);
  const [showFullJD, setShowFullJD] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [savingToTracker, setSavingToTracker] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick sample test links
  const sampleUrls = [
    {
      label: 'LinkedIn: SDE at Google',
      url: 'https://www.linkedin.com/jobs/view/senior-software-engineer-at-google-3891234'
    },
    {
      label: 'Indeed: Full Stack Engineer',
      url: 'https://www.indeed.com/viewjob?jk=senior-full-stack-engineer-stripe'
    },
    {
      label: 'Glassdoor: Backend Architect',
      url: 'https://www.glassdoor.com/job-listing/backend-systems-engineer-netflix'
    }
  ];

  // When modal opens or existingJob changes
  useEffect(() => {
    if (existingJob) {
      if (existingJob.aiAnalysis || existingJob.jobAnalysis) {
        const analysisData = existingJob.jobAnalysis || existingJob.aiAnalysis;
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
          analysis: analysisData,
          jobId: existingJob.id,
          url: existingJob.jobLink || existingJob.jobPostingUrl
        });
        setUrlInput(existingJob.jobLink || existingJob.jobPostingUrl || '');
        setSavedSuccess(true);
      } else if (existingJob.id) {
        fetchSavedAnalysis(existingJob.id);
      }
    } else {
      setResult(null);
      setUrlInput('');
      setError(null);
      setSavedSuccess(false);
    }
  }, [existingJob, isOpen]);

  // Rate limiter countdown timer
  useEffect(() => {
    let timer;
    if (rateLimitTimer > 0) {
      timer = setInterval(() => {
        setRateLimitTimer(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [rateLimitTimer]);

  const fetchSavedAnalysis = async (jobId) => {
    try {
      setLoading(true);
      const res = await jobService.getJobAnalysis(jobId);
      if (res.success && res.analysis) {
        setResult({
          job: res.job,
          analysis: res.analysis,
          jobId: res.job.id,
          url: res.job.jobLink || res.job.jobPostingUrl
        });
        setSavedSuccess(true);
      }
    } catch (err) {
      console.warn('Could not load existing job analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  // Multi-step loading progress simulator (0% -> 33% -> 66% -> 100%)
  useEffect(() => {
    let timer;
    if (loading) {
      setLoadingStep(0);
      const steps = [
        { step: 1, delay: 600 },
        { step: 2, delay: 1800 },
        { step: 3, delay: 3000 }
      ];
      steps.forEach(({ step, delay }) => {
        timer = setTimeout(() => {
          setLoadingStep(step);
        }, delay);
      });
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (!isOpen) return null;

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        setUrlInput(text.trim());
        setError(null);
      } else {
        setError('No valid URL found on your clipboard. Please copy a link from your browser.');
      }
    } catch (err) {
      setError('Clipboard access denied by browser permissions. Please paste manually into the input box.');
    }
  };

  const handleAnalyze = async (overrideUrl) => {
    const targetUrl = (overrideUrl || urlInput || '').trim();
    if (!targetUrl) {
      setError('Please paste a job URL to analyze.');
      return;
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      setError('Please enter a valid HTTP or HTTPS job link (e.g. https://www.linkedin.com/jobs/view/...)');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSavedSuccess(false);

    try {
      const res = await jobService.analyzeJobFromURL(targetUrl);
      if (res.success) {
        const fullAnalysis = res.analysis || res.data?.analysis;
        const jobInfo = res.data?.job || fullAnalysis?.job || {
          id: res.jobId,
          title: fullAnalysis?.job?.title || 'Software Engineer',
          company: fullAnalysis?.job?.company || 'Company',
          location: fullAnalysis?.job?.location || 'Remote',
          salary: fullAnalysis?.job?.salary,
          source: fullAnalysis?.job?.source || 'other',
          url: targetUrl,
          jobDescription: fullAnalysis?.job?.description
        };

        setResult({
          job: jobInfo,
          analysis: fullAnalysis,
          jobId: res.jobId || res.data?.jobId,
          url: targetUrl
        });

        setSavedSuccess(true);
        if (onJobAnalyzed) {
          onJobAnalyzed(jobInfo);
        }
      } else {
        throw new Error(res.error || res.message || 'Job analysis failed.');
      }
    } catch (err) {
      console.error('Job analysis error:', err);
      const resData = err.response?.data;
      if (err.response?.status === 429) {
        setRateLimitTimer(resData?.retryAfterSeconds || 60);
        setError('Too many requests. Please wait 1 minute before analyzing another job.');
      } else if (err.response?.status === 404) {
        setError('Job posting not found or removed. It may have expired or the link is private.');
      } else if (err.response?.status === 504 || err.code === 'ECONNABORTED') {
        setError('The page took too long to load. The job board might be slow. Please try again.');
      } else {
        setError(resData?.error || resData?.message || err.message || 'Could not analyze job posting.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToTracker = async () => {
    if (!result?.jobId) return;
    try {
      setSavingToTracker(true);
      const res = await jobService.saveJobToTracker(result.jobId, 'applied', 'Analyzed via Job URL integration');
      if (res.success) {
        setSavedSuccess(true);
        if (onJobAnalyzed) {
          onJobAnalyzed(result.job);
        }
      }
    } catch (err) {
      console.error('Failed to save to tracker:', err);
    } finally {
      setSavingToTracker(false);
    }
  };

  const handleCreateStudyPlan = () => {
    const missing = result?.analysis?.matchAnalysis?.skillMatches?.missing || [];
    onClose();
    navigate('/study-plan', {
      state: {
        prefilledSkills: missing,
        targetRole: result?.job?.title || 'Target Job'
      }
    });
  };

  const handleCopyDescription = () => {
    const desc = result?.job?.jobDescription || result?.analysis?.job?.description || '';
    if (desc) {
      navigator.clipboard.writeText(desc);
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2000);
    }
  };

  const handleDownloadDescription = () => {
    const desc = result?.job?.jobDescription || result?.analysis?.job?.description || '';
    const blob = new Blob([desc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result?.job?.company || 'Job'}_${result?.job?.title || 'Description'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareAnalysis = () => {
    const score = result?.analysis?.matchAnalysis?.matchScore || 0;
    const title = result?.job?.title || 'Software Engineer';
    const company = result?.job?.company || 'Tech Company';
    const text = `I analyzed the ${title} role at ${company} on Career Copilot! My Match Score is ${score}%. Check out my preparation roadmap!`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  // Match score visual styling
  const score = result?.analysis?.matchAnalysis?.matchScore ?? result?.analysis?.matchScore ?? 0;
  const matchPercentage = `${score}%`;

  const getScoreColorConfig = (s) => {
    if (s >= 86) {
      return {
        label: 'Excellent Match',
        statement: "You're an exceptional fit for this position!",
        strokeColor: '#047857', // Dark Green
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-200'
      };
    }
    if (s >= 67) {
      return {
        label: 'Good Match',
        statement: "You're a strong fit with few targeted skill gaps.",
        strokeColor: '#059669', // Green
        bgColor: 'bg-emerald-50/60',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200'
      };
    }
    if (s >= 34) {
      return {
        label: 'Needs Preparation',
        statement: 'You have foundational skills, but require 2-3 weeks of focused study.',
        strokeColor: '#D97706', // Yellow / Amber
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-800',
        borderColor: 'border-amber-200'
      };
    }
    return {
      label: 'Poor Match',
      statement: 'Significant gaps identified in required core technologies.',
      strokeColor: '#E11D48', // Red
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-800',
      borderColor: 'border-rose-200'
    };
  };

  const scoreConfig = getScoreColorConfig(score);

  // SVG circular gauge math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const analysis = result?.analysis || {};
  const matchAnalysis = analysis.matchAnalysis || {};
  const experienceMatch = matchAnalysis.experienceMatch || {};
  const preparation = analysis.preparation || {};
  const redFlags = analysis.redFlags || [];
  const nextSteps = analysis.recommendation?.nextSteps || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                Real Job Postings Integration
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                  AI Powered
                </span>
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Instant web scraping, ATS requirement analysis & resume match scoring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
          {/* Section 1: URL Input Section */}
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
                <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                Paste Job Posting URL
              </label>

              {/* Supported Job Sites badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-gray-400">Supported:</span>
                {['LinkedIn', 'Indeed', 'Glassdoor', 'Monster', 'Dice', 'GitHub'].map(site => (
                  <span
                    key={site}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 shadow-2xs"
                  >
                    {site}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading && rateLimitTimer === 0) {
                      handleAnalyze();
                    }
                  }}
                  disabled={loading || rateLimitTimer > 0}
                  placeholder="Paste URL (e.g. https://www.linkedin.com/jobs/view/...)"
                  className="w-full pl-3.5 pr-28 py-3 text-sm rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all text-gray-900 bg-white placeholder-gray-400"
                />

                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  disabled={loading || rateLimitTimer > 0}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-gray-100 flex items-center gap-1 transition-colors"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Paste</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleAnalyze()}
                disabled={loading || !urlInput.trim() || rateLimitTimer > 0}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 flex-shrink-0"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Analyze URL</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Test Samples */}
            <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-semibold text-gray-500">Quick test:</span>
              {sampleUrls.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrlInput(s.url);
                    handleAnalyze(s.url);
                  }}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Rate limiter timer indicator */}
            {rateLimitTimer > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  Rate limit reached. Please wait <strong className="font-bold">{rateLimitTimer}s</strong> before analyzing another job URL.
                </span>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 text-xs text-rose-800 flex items-start justify-between gap-2 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block mb-0.5">Scraping Notice</strong>
                    <span>{error}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAnalyze()}
                  className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 flex-shrink-0"
                >
                  Retry
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Loading State Indicator */}
          {loading && (
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-8 text-center space-y-4 animate-in fade-in">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                <Sparkles className="w-6 h-6 text-blue-600 absolute inset-0 m-auto" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-900">
                  Scraping & Analyzing Job Posting...
                </h4>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  {loadingStep === 0 && 'Connecting to job board and fetching page content...'}
                  {loadingStep === 1 && 'Extracting job requirements, seniority and core technologies...'}
                  {loadingStep === 2 && 'Comparing requirements against your resume and calculating match score...'}
                  {loadingStep === 3 && 'Generating preparation milestones and learning roadmap...'}
                </p>
                <p className="text-[11px] text-gray-400 font-medium pt-1">
                  Takes about 3-5 seconds
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-64 max-w-full mx-auto bg-blue-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-700 rounded-full"
                  style={{ width: `${(loadingStep + 1) * 25}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Section 3: Analysis Results */}
          {result && !loading && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* 3a. Job Header Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        {result.job?.source || 'Job Posting'}
                      </span>
                      {result.job?.salary && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {result.job.salary}
                        </span>
                      )}
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                        {result.analysis?.job?.requirements?.seniority || 'Mid-level'}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      {result.job?.title || 'Senior Software Engineer'}
                    </h2>
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-2 mt-0.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                      <span>{result.job?.company || 'Company'}</span>
                      <span className="text-gray-300">•</span>
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-normal text-gray-600">{result.job?.location || 'Remote'}</span>
                    </p>
                  </div>

                  {result.url && (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    >
                      <span>View on {result.job?.source || 'Source'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* 3b. Match Score Card (Prominent Center Piece) */}
              <div className={`rounded-2xl border ${scoreConfig.borderColor} ${scoreConfig.bgColor} p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs`}>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white shadow-2xs border border-gray-200/80">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>AI Resume Match Analysis</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {scoreConfig.label} ({matchPercentage})
                  </h3>

                  <p className="text-sm text-gray-700 font-medium max-w-lg">
                    {scoreConfig.statement}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-gray-600 justify-center sm:justify-start">
                    <span>
                      Required Match: <strong className="text-gray-900">{analysis.matchBreakdown?.requiredSkillsHave || 0} / {(analysis.matchBreakdown?.requiredSkillsHave || 0) + (analysis.matchBreakdown?.requiredSkillsMissing || 0)}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Prep Target: <strong className="text-blue-700">{preparation.estimatedPrepTime || '2-3 weeks'}</strong>
                    </span>
                  </div>
                </div>

                {/* Circular Score Gauge */}
                <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      stroke="#E5E7EB"
                      strokeWidth="11"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      stroke={scoreConfig.strokeColor}
                      strokeWidth="11"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-gray-900">{score}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Match Bar
                    </span>
                  </div>
                </div>
              </div>

              {/* 3c. Match Breakdown 3-Column Grid */}
              <MatchBreakdown matchAnalysis={matchAnalysis} />

              {/* 3d. Experience Match Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Experience & Seniority Alignment
                  </h4>
                  <span className="text-xs font-bold text-gray-700">
                    Required: {experienceMatch.required || 3} yrs • You have: {experienceMatch.userHas || 2} yrs
                  </span>
                </div>

                <p className="text-xs text-gray-600">
                  {experienceMatch.message || "You're close to the expected experience bar for this position."}
                </p>

                {/* Visual Gap Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round(((experienceMatch.userHas || 2) / (experienceMatch.required || 3)) * 100))}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-gray-400">
                    <span>0 years</span>
                    <span>Target: {experienceMatch.required || 3} years</span>
                  </div>
                </div>
              </div>

              {/* 3e. Red Flags Card (if any) */}
              {redFlags.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 sm:p-5 space-y-2.5 shadow-2xs">
                  <h4 className="text-xs font-bold text-rose-900 flex items-center gap-2 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    Noticeable Flags & Considerations ({redFlags.length})
                  </h4>
                  <ul className="space-y-1.5 pl-6 list-disc text-xs text-rose-800">
                    {redFlags.map((flag, idx) => (
                      <li key={idx} className="font-medium">
                        {flag}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-rose-700 italic pt-1">
                    Tip: Highlight relevant personal projects, open source, and architectural leadership in your cover letter to offset these gaps.
                  </p>
                </div>
              )}

              {/* 3f. Preparation Needed Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-600" />
                    Target Skills Preparation
                  </h4>
                  <span className="text-xs font-semibold text-gray-500">
                    Estimated Time: {preparation.estimatedPrepTime || '3-4 weeks'}
                  </span>
                </div>

                <SkillRecommendations
                  criticalSkills={preparation.criticalSkills || []}
                  importantSkills={preparation.importantSkills || []}
                  onAddToStudyPlan={handleCreateStudyPlan}
                />
              </div>

              {/* 3g. Preparation Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
                <PreparationTimeline preparation={preparation} />
              </div>

              {/* 3h. Recommended Next Steps */}
              {nextSteps.length > 0 && (
                <div className="bg-blue-50/50 border border-blue-200/80 rounded-xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Recommended Action Steps Before Applying
                  </h4>
                  <ol className="space-y-2 text-xs text-blue-950 font-medium">
                    {nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* 4. Collapsible Full Job Description */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowFullJD(!showFullJD)}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span>Full Job Description ({result.job?.jobDescription?.length || 0} characters)</span>
                  {showFullJD ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showFullJD && (
                  <div className="p-4 border-t border-gray-200 space-y-3 bg-white">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={handleCopyDescription}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-1 transition-colors"
                      >
                        {copiedDesc ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedDesc ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadDescription}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>

                    <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap max-h-80 overflow-y-auto p-3 bg-gray-50 rounded-lg border border-gray-200 leading-relaxed">
                      {result.job?.jobDescription || 'No description available.'}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Action Bar */}
        {result && (
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleShareAnalysis}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedShare ? 'Copied Link!' : 'Share Analysis'}</span>
              </button>

              <button
                type="button"
                onClick={handleCreateStudyPlan}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Create Study Plan</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleSaveToTracker}
                disabled={savingToTracker}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                  savedSuccess
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {savingToTracker ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved in Applications Tracker</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Save to Applications</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobURLAnalyzerModal;
