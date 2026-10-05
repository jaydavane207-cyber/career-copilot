// frontend/src/components/JobTracker/JobAnalysisCard.jsx
import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';

/**
 * JobAnalysisCard
 * Renders an AI match summary pill / card embedded inside Kanban cards or standalone lists
 */
export const JobAnalysisCard = ({ job, onViewAnalysis }) => {
  if (!job) return null;

  const score = job.matchScore !== undefined && job.matchScore !== null
    ? job.matchScore
    : (job.aiAnalysis?.matchScore ?? null);

  const missingSkills = job.missingSkills?.length
    ? job.missingSkills
    : (job.aiAnalysis?.missingSkills || []);

  const strongMatches = job.aiAnalysis?.skillMatches?.strong || [];
  const source = job.jobSource || 'other';

  // Badge styling according to score bracket
  const getBadgeStyle = (s) => {
    if (s >= 85) return 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]';
    if (s >= 67) return 'bg-[#EFF6FF] text-[#1D4ED8] border-[#93C5FD]';
    if (s >= 35) return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
    return 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]';
  };

  const getSourceBadgeStyle = (src) => {
    switch (src?.toLowerCase()) {
      case 'linkedin':
        return 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30';
      case 'indeed':
        return 'bg-[#2164f3]/10 text-[#2164f3] border-[#2164f3]/30';
      case 'glassdoor':
        return 'bg-[#0caa41]/10 text-[#0caa41] border-[#0caa41]/30';
      case 'wellfound':
        return 'bg-[#ff6154]/10 text-[#ff6154] border-[#ff6154]/30';
      default:
        return 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]';
    }
  };

  return (
    <div className="mt-2.5 pt-2.5 border-t border-[#E5E7EB]/80">
      {/* Score & Source Row */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          {score !== null ? (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] font-bold border ${getBadgeStyle(
                score
              )}`}
            >
              <Sparkles className="w-3 h-3" />
              {score}% Match
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] font-medium bg-[#F3F4F6] text-[#6B7280]">
              Pending Scan
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
            className="text-[11px] font-semibold text-[#3B82F6] hover:text-[#1D4ED8] hover:underline flex items-center gap-0.5"
          >
            Analysis <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Missing skills pills */}
      {missingSkills && missingSkills.length > 0 && (
        <div className="mt-2 flex items-center gap-1 flex-wrap">
          <span className="text-[10px] text-[#6B7280] font-medium">Missing:</span>
          {missingSkills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-1.5 py-0.2 rounded-[4px] text-[10px] font-medium bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]/40"
            >
              {skill}
            </span>
          ))}
          {missingSkills.length > 3 && (
            <span className="text-[10px] text-[#9CA3AF]">
              +{missingSkills.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobAnalysisCard;
