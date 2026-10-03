// frontend/src/components/Resume/AnalysisResults.jsx
import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  Download,
  AlertTriangle,
  Briefcase,
  FileText,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import CircularProgress from './CircularProgress';
import { downloadAnalysisPDF } from '../../utils/pdfReport';
import { formatDate } from '../../utils/formatters';

/**
 * AnalysisResults Component:
 * Displays full ATS screening breakdown including:
 * - Match score with CircularProgress indicator
 * - Missing keywords (as tags/pills)
 * - Matching keywords (as tags/pills)
 * - Actionable suggestions (as list with icons)
 * - ATS readiness checklist (Contact, Skills, Experience, Education)
 * - Direct PDF download of the results
 */
export const AnalysisResults = ({ analysis, resume, onAnalyzeAnother }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
        <p className="font-semibold text-sm">No analysis results available yet.</p>
        <p className="text-xs mt-1">Upload a resume and paste a job description to generate your match report.</p>
      </div>
    );
  }

  const matchScore = analysis.matchScore !== undefined ? analysis.matchScore : 0;
  const missingKeywords = analysis.missingKeywords || [];
  const matchingKeywords = analysis.matchingKeywords || [];
  const suggestions = analysis.suggestions || [];
  const ats = analysis.atsReadiness || {
    hasContactInfo: true,
    hasSkillsSection: true,
    hasExperienceSection: true,
    tips: []
  };

  // Handle PDF report generation and download
  const handleDownloadPDF = () => {
    try {
      setDownloading(true);
      const fileName = resume?.fileName || resume?.originalName || 'Resume';
      downloadAnalysisPDF(analysis, fileName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('PDF Download Error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              ATS Analysis Report
            </span>
            {analysis.analyzedAt && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(analysis.analyzedAt)}
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            {analysis.jobTitle || 'Target Role Match'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Resume: <span className="font-semibold text-slate-700">{resume?.fileName || resume?.originalName || 'Uploaded Resume'}</span>
          </p>
        </div>

        {/* Action Buttons: PDF Download & Analyze Another */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {onAnalyzeAnother && (
            <button
              type="button"
              onClick={onAnalyzeAnother}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Analyze Another Job
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className={`px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 ${
              downloadSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>PDF Downloaded!</span>
              </>
            ) : downloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Results as PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Match Score & Metrics Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Circular Progress Indicator */}
        <div className="md:col-span-1 flex justify-center py-2">
          <CircularProgress score={matchScore} size={150} strokeWidth={12} />
        </div>

        {/* Right: Score Breakdown & Stats */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {matchScore >= 75
                ? 'High Match Potential for this Role! 🎉'
                : matchScore >= 50
                ? 'Moderate Match with Important Gaps ⚠️'
                : 'Significant Keyword Gaps Detected 🚨'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Match score is calculated by evaluating key required technologies and qualifications from the job description against your resume content.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total JD Skills
              </span>
              <span className="text-xl font-black text-slate-800 mt-0.5 block">
                {analysis.totalJDKeywords || (matchingKeywords.length + missingKeywords.length)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Matched Skills
              </span>
              <span className="text-xl font-black text-emerald-800 mt-0.5 block">
                {matchingKeywords.length}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                Missing Skills
              </span>
              <span className="text-xl font-black text-rose-800 mt-0.5 block">
                {missingKeywords.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Keywords Section: Missing and Matched */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing Keywords (Tags / Pills) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Missing Target Keywords
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              {missingKeywords.length} missing
            </span>
          </div>

          <p className="text-xs text-slate-500">
            These essential technologies appear in the job description but are absent in your resume:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs hover:bg-rose-100 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {kw}
                </span>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2 w-full">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero missing keywords! All core requirements detected in your resume.</span>
              </div>
            )}
          </div>
        </div>

        {/* Matching Keywords (Tags / Pills) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Matching Keywords Found
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              {matchingKeywords.length} matched
            </span>
          </div>

          <p className="text-xs text-slate-500">
            These technologies in your resume directly match the job posting requirements:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {matchingKeywords.length > 0 ? (
              matchingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs hover:bg-emerald-100 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {kw}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No direct matching skills detected yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Actionable Suggestions (List with Icons) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Actionable Optimization Suggestions ({suggestions.length})
            </h3>
            <p className="text-xs text-slate-500">
              Specific, high-impact edits to close the skill gap and beat ATS filtration filters:
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {suggestions.length > 0 ? (
            suggestions.map((sug, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3 hover:bg-amber-50 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-200/70 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {sug}
                  </p>
                </div>
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No specific suggestions at this time.</p>
          )}
        </div>
      </div>

      {/* ATS Readiness Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              ATS Structural Readiness Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Verifies whether your document contains the standard structural sections expected by ATS bots:
            </p>
          </div>
        </div>

        {/* Checklist Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Contact Info */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 ${
              ats.hasContactInfo
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                : 'bg-rose-50/60 border-rose-200 text-rose-800'
            }`}
          >
            <div>
              <p className="text-xs font-bold">Contact Info</p>
              <p className="text-[11px] opacity-80 mt-0.5">Email & Phone</p>
            </div>
            {ats.hasContactInfo ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            )}
          </div>

          {/* 2. Skills Section */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 ${
              ats.hasSkillsSection
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                : 'bg-rose-50/60 border-rose-200 text-rose-800'
            }`}
          >
            <div>
              <p className="text-xs font-bold">Skills Section</p>
              <p className="text-[11px] opacity-80 mt-0.5">Tech Stack Header</p>
            </div>
            {ats.hasSkillsSection ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            )}
          </div>

          {/* 3. Experience Section */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 ${
              ats.hasExperienceSection
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                : 'bg-rose-50/60 border-rose-200 text-rose-800'
            }`}
          >
            <div>
              <p className="text-xs font-bold">Experience Section</p>
              <p className="text-[11px] opacity-80 mt-0.5">Work History</p>
            </div>
            {ats.hasExperienceSection ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            )}
          </div>

          {/* 4. Education Section */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 ${
              ats.hasEducationSection !== false
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                : 'bg-rose-50/60 border-rose-200 text-rose-800'
            }`}
          >
            <div>
              <p className="text-xs font-bold">Education Section</p>
              <p className="text-[11px] opacity-80 mt-0.5">Degrees & College</p>
            </div>
            {ats.hasEducationSection !== false ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            )}
          </div>
        </div>

        {/* ATS Tips List */}
        {ats.tips && ats.tips.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              ATS Readiness Tips:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {ats.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
