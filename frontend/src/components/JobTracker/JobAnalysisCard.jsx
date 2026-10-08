// frontend/src/components/JobTracker/JobAnalysisCard.jsx
import React from 'react';
import { Sparkles, MapPin, Building, ArrowRight, ExternalLink } from 'lucide-react';

/**
 * JobAnalysisCard Component
 * Displays match score badge, missing skills pills, and quick analysis trigger.
 * Designed for embedding on Kanban board job cards or lists.
 */
export const JobAnalysisCard = ({ job, onViewAnalysis }) => {
  if (!job) return null;

  const score = job.matchScore !== undefined && job.matchScore !== null
    ? job.matchScore
    : (job.aiAnalysis?.matchAnalysis?.matchScore ?? job.aiAnalysis?.matchScore ?? null);

  const missingSkills = job.missingSkills?.length
    ? job.missingSkills
    : (job.aiAnalysis?.matchAnalysis?.skillMatches?.missing || job.aiAnalysis?.missingSkills || []);

  const source = job.jobSource || 'other';

  // Circular Score Badge Colors:
  // Red (0-33%), Yellow (34-66%), Green (67-85%), Dark Green (86-100%)
  const getScoreBadgeBg = (s) => {
    if (s >= 86) return 'bg-emerald-700 text-white';
    if (s >= 67) return 'bg-emerald-600 text-white';
    if (s >= 34) return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  const getSourceBadgeStyle = (src) => {
    switch (src?.toLowerCase()) {
      case 'linkedin':
        return 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30';
      case 'indeed':
        return 'bg-[#2164f3]/10 text-[#2164f3] border-[#2164f3]/30';
      case 'glassdoor':
        return 'bg-[#0caa41]/10 text-[#0caa41] border-[#0caa41]/30';
      case 'monster':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'dice':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'github':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSummaryLine = () => {
    if (score === null) return 'Pending analysis';
    if (score >= 85) return 'Excellent fit for your skillset';
    if (score >= 67) {
      return missingSkills.length > 0
        ? `Good fit, prepare ${missingSkills[0]}`
        : 'Good fit for target role';
    }
    if (score >= 40) {
      return missingSkills.length > 0
        ? `Needs prep in ${missingSkills.slice(0, 2).join(', ')}`
        : 'Needs targeted preparation';
    }
    return 'Challenging match, intensive study advised';
  };

  return (
    <div className="mt-2.5 pt-2.5 border-t border-gray-200/80 transition-all">
      {/* Score & Source Header Row */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          {score !== null ? (
            <div
              title={`${score}% match with your skills`}
              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black shadow-xs ${getScoreBadgeBg(
                score
              )}`}
            >
              {score}%
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
              <Sparkles className="w-2.5 h-2.5 text-blue-500" />
              Not Analyzed
            </span>
          )}

          {source && source !== 'other' && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[10px] font-semibold uppercase tracking-wider border capitalize ${getSourceBadgeStyle(
                source
              )}`}
            >
              {source}
            </span>
          )}
        </div>

        {onViewAnalysis && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewAnalysis(job);
            }}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5"
          >
            <span>Analysis</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* One line summary */}
      <p className="text-[11px] font-medium text-gray-600 mt-1.5 line-clamp-1">
        {getSummaryLine()}
      </p>

      {/* Missing skills pills */}
      {missingSkills && missingSkills.length > 0 && (
        <div className="mt-1.5 flex items-center gap-1 flex-wrap">
          <span className="text-[10px] text-gray-500 font-semibold">Missing:</span>
          {missingSkills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200"
            >
              {skill}
            </span>
          ))}
          {missingSkills.length > 3 && (
            <span className="text-[10px] font-semibold text-gray-400">
              +{missingSkills.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobAnalysisCard;
