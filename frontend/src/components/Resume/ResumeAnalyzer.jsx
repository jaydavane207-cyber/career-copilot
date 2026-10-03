// frontend/src/components/Resume/ResumeAnalyzer.jsx
import React, { useState, useEffect } from 'react';
import {
  FileText,
  Briefcase,
  Sparkles,
  Clock,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Send,
  HelpCircle
} from 'lucide-react';
import ResumeUpload from './ResumeUpload';
import AnalysisResults from './AnalysisResults';
import ResumeHistory from './ResumeHistory';
import { resumeService } from '../../services/resumeService';
import { LoadingSpinner } from '../Common/LoadingSpinner';

/**
 * Sample Job Descriptions for 1-click testing
 */
const SAMPLE_JDS = [
  {
    title: 'Senior Frontend React Developer',
    role: 'Frontend Developer',
    text: `We are looking for a Senior Frontend React Developer.
Requirements:
- Strong proficiency in JavaScript, TypeScript, and modern React (Hooks, Context).
- Hands-on experience with Next.js, Redux, and Tailwind CSS.
- Familiarity with REST APIs, GraphQL, and modern build tools like Vite/Webpack.
- Experience writing automated unit tests using Jest and Cypress.
- Knowledge of Docker, Git, CI/CD pipelines, and cloud deployment on AWS is a plus.`
  },
  {
    title: 'Full Stack MERN Engineer',
    role: 'Fullstack Developer',
    text: `Job Opportunity: Full Stack Engineer (MERN Stack).
Key Qualifications:
- 3+ years experience with React, Node.js, Express, and MongoDB.
- Solid understanding of SQL and relational databases like PostgreSQL.
- Experience with Docker, Kubernetes, and CI/CD pipelines.
- Proficient in building and consuming RESTful APIs and WebSockets.
- Cloud experience with AWS (S3, EC2, Lambda) or GCP.
- Strong knowledge of Data Structures, Algorithms, and System Design.`
  },
  {
    title: 'DevOps & Cloud Infrastructure Engineer',
    role: 'DevOps Engineer',
    text: `Seeking a DevOps Engineer to manage cloud infrastructure and automation.
Requirements:
- Hands-on expertise in AWS, Docker, and Kubernetes.
- Experience creating automated CI/CD pipelines with GitHub Actions or Jenkins.
- Infrastructure as Code using Terraform or Ansible.
- Strong Linux shell scripting (Bash) and Python.
- Knowledge of monitoring tools, Nginx, and cloud security best practices.`
  }
];

/**
 * ResumeAnalyzer Master Page Component
 */
export const ResumeAnalyzer = () => {
  // Navigation tabs: 'analyze' | 'results' | 'history'
  const [activeTab, setActiveTab] = useState('analyze');

  // Resume state
  const [currentResume, setCurrentResume] = useState(null);
  const [jobTitle, setJobTitle] = useState('Senior Fullstack Engineer');
  const [jobDescription, setJobDescription] = useState('');

  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  // History state
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch past analyses on component mount
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await resumeService.getHistory();
      if (res.success) {
        setHistory(res.history || []);
        // If resumes exist and none is currently loaded, set latest resume
        if (res.resumes && res.resumes.length > 0 && !currentResume) {
          const latest = res.resumes[0];
          setCurrentResume({
            id: latest.id,
            fileName: latest.fileName || latest.originalName,
            extractedText: latest.extractedText,
            resume: latest
          });
        }
      }
    } catch (err) {
      console.error('Failed to load resume history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // When a resume PDF is uploaded and parsed
  const handleUploadSuccess = (uploadedData) => {
    setCurrentResume(uploadedData);
    setAnalyzeError('');
  };

  // Reset uploaded resume to allow uploading another
  const handleResetResume = () => {
    setCurrentResume(null);
  };

  // Populate sample Job Description
  const handleApplySampleJD = (sample) => {
    setJobTitle(sample.title);
    setJobDescription(sample.text);
    setAnalyzeError('');
  };

  // Perform resume analysis against job description
  const handleAnalyze = async (e) => {
    e?.preventDefault();

    if (!currentResume) {
      setAnalyzeError('Please upload your resume PDF in step 1 before analyzing.');
      return;
    }

    if (!jobDescription || !jobDescription.trim()) {
      setAnalyzeError('Please paste a job description or select one of the sample presets below.');
      return;
    }

    try {
      setAnalyzing(true);
      setAnalyzeError('');

      const payload = {
        resumeId: currentResume.id,
        resumeText: currentResume.extractedText,
        jobDescription: jobDescription.trim(),
        jobTitle: jobTitle.trim() || 'Target Role'
      };

      const response = await resumeService.analyze(payload);

      if (response.success) {
        const result = response.analysis || {
          matchScore: response.matchScore,
          missingKeywords: response.missingKeywords,
          matchingKeywords: response.matchingKeywords,
          suggestions: response.suggestions,
          atsReadiness: response.atsReadiness,
          jobTitle: jobTitle.trim() || 'Target Role',
          analyzedAt: new Date().toISOString()
        };

        setAnalysisResult(result);
        setActiveTab('results');
        // Refresh history to include this new analysis
        fetchHistory();
      } else {
        setAnalyzeError(response.message || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalyzeError(
        err.response?.data?.message ||
        'Error occurred while analyzing resume against the job description.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // Selecting a past analysis from the History tab
  const handleSelectHistoryItem = (historyItem) => {
    setAnalysisResult(historyItem);
    setActiveTab('results');
  };

  // Deleting a past analysis from history
  const handleDeleteHistoryItem = async (analysisId) => {
    try {
      await resumeService.deleteAnalysis(analysisId);
      setHistory(history.filter(item => item.id !== analysisId));
      if (analysisResult?.id === analysisId) {
        setAnalysisResult(null);
      }
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              AI Powered Feature
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">ATS Keyword Scorer</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Resume Analyzer & ATS Matcher
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Upload your resume PDF, match against any job description, pinpoint missing keywords, and export actionable PDF recommendations.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('analyze')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'analyze'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Analyze
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('results')}
            disabled={!analysisResult}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              activeTab === 'results'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Results {analysisResult && `(${analysisResult.matchScore}%)`}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            History ({history.length})
          </button>
        </div>
      </div>

      {/* --- TAB 1: ANALYZE RESUME (UPLOAD + JOB DESCRIPTION INPUT) --- */}
      {activeTab === 'analyze' && (
        <div className="space-y-6">
          {/* Error Banner */}
          {analyzeError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 shadow-2xs">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Required Information Missing</p>
                <p className="mt-0.5">{analyzeError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Step 1 Resume Upload (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <ResumeUpload
                onUploadSuccess={handleUploadSuccess}
                currentUploadedResume={currentResume}
                onResetResume={handleResetResume}
              />

              {/* Helpful Tips Card */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  How ATS Scoring Works
                </h4>
                <ul className="text-[11px] text-slate-600 space-y-1 pl-4 list-disc">
                  <li>Extracts skills and frameworks from both your PDF and the Job Description.</li>
                  <li>Calculates match percentage: <code className="bg-white px-1 py-0.5 rounded font-mono text-[10px] text-indigo-700">(Matched / Total JD Skills) × 100</code>.</li>
                  <li>Validates ATS structural headers (Skills, Experience, Contact).</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Step 2 Job Description Textarea & Analyze CTA (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    2. Paste Job Description or Role Requirements
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Paste the target job description or choose one of the sample test presets.
                  </p>
                </div>

                {/* Target Role Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend React Developer"
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                </div>

                {/* Quick Preset Buttons */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Quick Sample Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_JDS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplySampleJD(sample)}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 transition-colors"
                      >
                        + {sample.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Description Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Job Description Text <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {wordCount} words • {jobDescription.length} characters
                    </span>
                  </div>

                  <textarea
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here, including responsibilities, required skills, qualifications, and preferred tech stack..."
                    className="w-full text-xs rounded-xl border border-slate-300 p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-sans leading-relaxed text-slate-800 bg-white"
                  />
                </div>

                {/* Analyze Button with Loading State */}
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={analyzing || !currentResume || !jobDescription.trim()}
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {analyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Resume Keywords & Calculating ATS Score...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Resume Against Job Description</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: RESULTS VIEW --- */}
      {activeTab === 'results' && (
        <AnalysisResults
          analysis={analysisResult}
          resume={currentResume}
          onAnalyzeAnother={() => setActiveTab('analyze')}
        />
      )}

      {/* --- TAB 3: HISTORY VIEW --- */}
      {activeTab === 'history' && (
        <div>
          {loadingHistory ? (
            <LoadingSpinner size="md" message="Loading analysis history..." />
          ) : (
            <ResumeHistory
              history={history}
              selectedAnalysisId={analysisResult?.id}
              onSelectAnalysis={handleSelectHistoryItem}
              onDeleteAnalysis={handleDeleteHistoryItem}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
