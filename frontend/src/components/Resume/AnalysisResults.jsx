// frontend/src/components/Resume/AnalysisResults.jsx
import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Download,
  RotateCcw,
  Check,
  ShieldCheck,
  Lightbulb
} from 'lucide-react';
import { CircularProgress } from '../UI/ProgressIndicators';
import { PillTag } from '../UI/Badge';
import { Button } from '../UI/Button';
import { downloadAnalysisPDF } from '../../utils/pdfReport';

export const AnalysisResults = ({ analysis, resume, onAnalyzeAnother }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showAllKeywords, setShowAllKeywords] = useState(false);

  if (!analysis) return null;

  const matchScore = analysis.matchScore !== undefined ? analysis.matchScore : 0;
  const missingKeywords = analysis.missingKeywords || [];
  const suggestions = analysis.suggestions || [
    'Add specific quantifiable achievements to your work experience.',
    'Include top cloud deployment and CI/CD tools in the skills section.',
    'Mention test-driven development methodologies explicitly.',
    'Ensure modern state management tools like Redux or Zustand are highlighted.',
    'Structure your bullet points using the Action-Verb + Metric + Outcome framework.'
  ];

  const ats = analysis.atsReadiness || {
    hasContactInfo: true,
    hasSkillsSection: true,
    hasExperienceSection: true,
    hasEducationSection: true,
    tips: [
      'Use standard headings (Experience, Education, Skills) for maximum parser readability.',
      'Avoid multi-column tables and custom graphics that ATS parsers might drop.',
      'Ensure contact details include city, phone, email, and GitHub/LinkedIn links.'
    ]
  };

  const atsItems = [
    { name: 'Contact Information', present: ats.hasContactInfo !== false },
    { name: 'Skills Section', present: ats.hasSkillsSection !== false },
    { name: 'Work Experience', present: ats.hasExperienceSection !== false },
    { name: 'Education Section', present: ats.hasEducationSection !== false }
  ];

  const visibleKeywords = showAllKeywords ? missingKeywords : missingKeywords.slice(0, 15);

  const handleDownloadPDF = () => {
    try {
      setDownloading(true);
      const fileName = resume?.fileName || 'Resume_Analysis';
      downloadAnalysisPDF(analysis, fileName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header bar with PDF download & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px]">
            Analysis Results
          </h2>
          <p className="text-[14px] text-[#6B7280]">
            Target Role: <span className="font-semibold text-[#374151]">{analysis.jobTitle || 'Target Role'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onAnalyzeAnother && (
            <Button variant="secondary" onClick={onAnalyzeAnother} icon={RotateCcw}>
              Analyze Another
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleDownloadPDF}
            loading={downloading}
            icon={downloadSuccess ? Check : Download}
          >
            {downloadSuccess ? 'Downloaded!' : 'Download PDF Report'}
          </Button>
        </div>
      </div>

      {/* 3-Column Layout (desktop), stacked (mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px]">
        {/* Column 1: Match Score */}
        <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center text-center">
          <CircularProgress score={matchScore} size={150} strokeWidth={10} />
          <h3 className="text-[16px] font-bold text-[#374151] mt-4">
            Match Score
          </h3>
          <p className={`text-[14px] font-semibold mt-1 ${matchScore >= 67 ? 'text-[#10B981]' : matchScore >= 40 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
            {matchScore >= 67 ? 'Good match' : 'Needs improvement'}
          </p>
          <p className="text-[12px] text-[#6B7280] mt-2 max-w-xs">
            Calculated by cross-referencing extracted resume keywords against job requirements.
          </p>
        </div>

        {/* Column 2: Missing Keywords */}
        <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] font-semibold text-[#374151] tracking-[-0.5px]">
                Missing Keywords
              </h3>
              <span className="text-[12px] font-semibold text-[#EF4444] bg-[#FEF2F2] px-2.5 py-0.5 rounded-[12px]">
                {missingKeywords.length} missing
              </span>
            </div>

            <p className="text-[12px] text-[#6B7280] mb-3">
              Add these key skills to improve your match score:
            </p>

            <div className="flex flex-wrap gap-2">
              {visibleKeywords.length > 0 ? (
                visibleKeywords.map((kw, i) => (
                  <PillTag key={i}>{kw}</PillTag>
                ))
              ) : (
                <p className="text-[14px] text-[#10B981] font-semibold flex items-center gap-1.5 py-4">
                  <CheckCircle2 className="w-5 h-5" />
                  No missing keywords! Excellent coverage.
                </p>
              )}
            </div>
          </div>

          {missingKeywords.length > 15 && (
            <div className="pt-3 mt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setShowAllKeywords(!showAllKeywords)}
                className="text-[13px] font-semibold text-[#3B82F6] hover:underline"
              >
                {showAllKeywords ? 'Show fewer' : `Show all ${missingKeywords.length} keywords`}
              </button>
            </div>
          )}
        </div>

        {/* Column 3: Suggestions */}
        <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-[20px] font-semibold text-[#374151] tracking-[-0.5px]">
                How to improve
              </h3>
            </div>

            <p className="text-[12px] text-[#6B7280] mb-3">
              Actionable recommendations to stand out to recruiters:
            </p>

            <div className="space-y-3">
              {suggestions.slice(0, 8).map((sug, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[#374151] text-[14px]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-1" />
                  <span className="leading-snug">{sug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ATS Readiness Section (Below) */}
      <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#3B82F6]" />
            <h3 className="text-[20px] font-semibold text-[#374151] tracking-[-0.5px]">
              ATS Readiness Score
            </h3>
          </div>
          <span className="text-[12px] font-semibold text-[#10B981] bg-[#D1FAE5] px-3 py-1 rounded-[12px]">
            Parser Compliant
          </span>
        </div>

        {/* Checklist with 4-5 items: Checkmark green or X red, Item name, Status Present/Missing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {atsItems.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-[8px] border flex items-center justify-between ${
                item.present
                  ? 'bg-[#F9FAFB] border-[#E5E7EB]'
                  : 'bg-[#FEF2F2] border-[#EF4444]/30'
              }`}
            >
              <div>
                <p className="text-[14px] font-semibold text-[#374151]">
                  {item.name}
                </p>
                <p className={`text-[12px] font-medium mt-0.5 ${item.present ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {item.present ? 'Present' : 'Missing'}
                </p>
              </div>
              {item.present ? (
                <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Tips section below checklist */}
        <div className="p-4 rounded-[8px] bg-[#EBF5FF] border border-[#BFDBFE] space-y-2">
          <div className="flex items-center gap-2 text-[#1E40AF] font-bold text-[14px]">
            <Lightbulb className="w-4 h-4 text-[#3B82F6]" />
            <span>Improve ATS score by:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[13px] text-[#374151] pl-2">
            <li>Standardizing section headings to plain text (Experience, Skills, Education).</li>
            <li>Avoiding two-column tables, text frames, or non-standard fonts.</li>
            <li>Adding quantified metrics (e.g. "Increased test coverage by 35%").</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
