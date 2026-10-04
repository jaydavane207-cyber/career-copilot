// frontend/src/components/Resume/ResumeAnalyzer.jsx
import React, { useState, useEffect } from 'react';
import {
  FileText,
  RotateCcw,
  Sparkles,
  History,
  CheckCircle2,
  Calendar,
  Trash2
} from 'lucide-react';
import ResumeUpload from './ResumeUpload';
import AnalysisResults from './AnalysisResults';
import ResumeHistory from './ResumeHistory';
import { resumeService } from '../../services/resumeService';
import { Button } from '../UI/Button';
import { ErrorMessage } from '../Common/ErrorMessage';

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
  }
];

export const ResumeAnalyzer = () => {
  // Step in workflow: 1 (Upload), 2 (Analyze against JD), 3 (Results), or 'history' tab
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('workflow'); // 'workflow' | 'history'

  const [currentResume, setCurrentResume] = useState(null);
  const [jobTitle, setJobTitle] = useState('Senior Frontend Developer');
  const [jobDescription, setJobDescription] = useState(SAMPLE_JDS[0].text);

  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await resumeService.getHistory();
      if (res.success) {
        setHistory(res.history || []);
        if (res.resumes && res.resumes.length > 0 && !currentResume) {
          const latest = res.resumes[0];
          setCurrentResume({
            id: latest.id,
            fileName: latest.fileName || latest.originalName,
            extractedText: latest.extractedText,
            createdAt: latest.createdAt
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleUploadSuccess = (uploaded) => {
    setCurrentResume(uploaded);
    setStep(2); // Automatically advance to Step 2
    setError('');
  };

  const handleAnalyze = async () => {
    if (!currentResume) {
      setError('Please upload your resume in Step 1 first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste a job description.');
      return;
    }

    try {
      setAnalyzing(true);
      setError('');

      const payload = {
        resumeId: currentResume.id,
        resumeText: currentResume.extractedText,
        jobDescription: jobDescription.trim(),
        jobTitle: jobTitle.trim() || 'Target Role'
      };

      const res = await resumeService.analyze(payload);
      if (res.success) {
        const result = res.analysis || {
          matchScore: res.matchScore,
          missingKeywords: res.missingKeywords,
          matchingKeywords: res.matchingKeywords,
          suggestions: res.suggestions,
          atsReadiness: res.atsReadiness,
          jobTitle: jobTitle.trim() || 'Target Role',
          analyzedAt: new Date().toISOString()
        };
        setAnalysisResult(result);
        setStep(3);
        fetchHistory();
      } else {
        setError(res.message || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while analyzing resume.');
    } finally {
      setAnalyzing(false);
    }
  };

  const charCount = jobDescription.length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-[32px] leading-[40px] font-bold text-[#111827] tracking-[-0.5px]">
            Resume Analyzer
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Evaluate your resume against target job requirements and optimize for ATS algorithms.
          </p>
        </div>

        {/* Tab switch between Analyzer and History */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-2 rounded-[8px] text-[14px] font-semibold transition-colors ${
              activeTab === 'workflow'
                ? 'bg-[#3B82F6] text-white'
                : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]'
            }`}
          >
            Analyzer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-[8px] text-[14px] font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#3B82F6] text-white'
                : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History ({history.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        <ResumeHistory
          history={history}
          onSelect={(item) => {
            setAnalysisResult(item);
            setStep(3);
            setActiveTab('workflow');
          }}
          onDelete={async (id) => {
            await resumeService.deleteAnalysis(id);
            setHistory(history.filter((h) => h.id !== id));
          }}
        />
      ) : step === 3 && analysisResult ? (
        /* Results View */
        <AnalysisResults
          analysis={analysisResult}
          resume={currentResume}
          onAnalyzeAnother={() => {
            setStep(2);
            setAnalysisResult(null);
          }}
        />
      ) : (
        /* Two-Step Workflow */
        <div className="space-y-6">
          {/* Step Indicators */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-[12px] border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 text-[14px] font-semibold ${
                step === 1 ? 'text-[#3B82F6]' : 'text-[#6B7280]'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] text-white ${
                  step === 1 ? 'bg-[#3B82F6]' : 'bg-[#9CA3AF]'
                }`}
              >
                1
              </span>
              <span>Step 1: Upload Resume</span>
            </button>

            <div className="w-8 h-[2px] bg-[#E5E7EB]" />

            <button
              type="button"
              onClick={() => currentResume && setStep(2)}
              disabled={!currentResume}
              className={`flex items-center gap-2 text-[14px] font-semibold ${
                step === 2 ? 'text-[#3B82F6]' : 'text-[#6B7280]'
              } ${!currentResume ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] text-white ${
                  step === 2 ? 'bg-[#3B82F6]' : 'bg-[#9CA3AF]'
                }`}
              >
                2
              </span>
              <span>Step 2: Analyze Against JD</span>
            </button>
          </div>

          <ErrorMessage message={error} />

          {step === 1 ? (
            /* Step 1: Upload Resume */
            <ResumeUpload
              currentUploadedResume={currentResume}
              onUploadSuccess={handleUploadSuccess}
              onResetResume={() => setCurrentResume(null)}
              onContinue={() => setStep(2)}
            />
          ) : (
            /* Step 2: Analyze Against JD (Resume section left panel, JD section right panel) */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel: Resume Section */}
              <div className="lg:col-span-1 bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col justify-between">
                <div>
                  <h3 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px] mb-4">
                    Your Resume
                  </h3>

                  <div className="p-4 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[8px] bg-[#EBF5FF] text-[#3B82F6] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-[#374151] truncate">
                        {currentResume?.fileName || 'Resume.pdf'}
                      </p>
                      <p className="text-[12px] text-[#6B7280]">
                        {currentResume?.fileSize
                          ? `${(currentResume.fileSize / 1024).toFixed(1)} KB`
                          : 'Parsed text available'}
                      </p>
                    </div>
                  </div>

                  <p className="text-[12px] text-[#6B7280] mt-4 leading-relaxed">
                    Extracted text will be matched against the job description for technical keywords, qualifications, and formatting standards.
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E5E7EB]">
                  <Button
                    variant="secondary"
                    onClick={() => setStep(1)}
                    className="w-full"
                    icon={RotateCcw}
                  >
                    Change Resume
                  </Button>
                </div>
              </div>

              {/* Right Panel: JD Section */}
              <div className="lg:col-span-2 bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <h3 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">
                    Target Job Description
                  </h3>

                  {/* Sample presets */}
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="text-[#6B7280]">Sample presets:</span>
                    {SAMPLE_JDS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setJobTitle(sample.title);
                          setJobDescription(sample.text);
                        }}
                        className="text-[#3B82F6] hover:underline font-semibold"
                      >
                        {sample.role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Title Input */}
                <div>
                  <label className="block text-[14px] font-semibold text-[#374151] mb-2">
                    Job Title <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="input-field"
                  />
                </div>

                {/* Large Textarea & Character Count (bottom right) */}
                <div className="relative">
                  <label className="block text-[14px] font-semibold text-[#374151] mb-2">
                    Job Description <span className="text-[#EF4444]">*</span>
                  </label>
                  <textarea
                    rows={10}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description here..."
                    className="input-field min-h-[220px] pb-8 resize-y"
                  />
                  <div className="absolute bottom-3 right-4 text-[12px] text-[#9CA3AF] pointer-events-none">
                    {charCount} characters
                  </div>
                </div>

                {/* Submit button: "Analyze Match" */}
                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    onClick={handleAnalyze}
                    loading={analyzing}
                    disabled={analyzing || !jobDescription.trim()}
                    icon={Sparkles}
                  >
                    Analyze Match
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
