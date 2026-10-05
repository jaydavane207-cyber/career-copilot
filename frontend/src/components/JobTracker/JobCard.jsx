// frontend/src/components/JobTracker/JobCard.jsx
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, AlertCircle, Edit, Trash2, Star, Sparkles } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import JobAnalysisCard from './JobAnalysisCard';

export const JobCard = ({ job, index, onEdit, onDelete, onViewAnalysis }) => {
  const dateAppliedFormatted = formatDate(job.dateApplied);
  const interviewDateFormatted = job.interviewDate ? formatDate(job.interviewDate) : null;

  // Check if interview date is within next 3 days
  const isInterviewSoon = (() => {
    if (!job.interviewDate) return false;
    const interview = new Date(job.interviewDate).getTime();
    const now = Date.now();
    const diffDays = (interview - now) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 3;
  })();

  const isOffer = job.stage === 'offer';

  // Notes preview: first 50 chars
  const notesPreview = job.notes ? (job.notes.length > 50 ? `${job.notes.slice(0, 50)}...` : job.notes) : '';

  return (
    <Draggable draggableId={String(job.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white rounded-[12px] border border-[#E5E7EB] p-[16px]
            shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]
            transition-all duration-200 cursor-grab active:cursor-grabbing select-none
            ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-[#3B82F6] rotate-1 scale-[1.02]' : ''}
          `}
        >
          {/* Top row: Company name & Offer badge / Action buttons */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                {/* Company name (16px bold) */}
                <h4 className="text-[16px] font-bold text-[#111827] truncate">
                  {job.companyName}
                </h4>
                {isOffer && (
                  <span title="Offer received! 🎉" className="text-base select-none">
                    🎉
                  </span>
                )}
              </div>
              {/* Job title (14px) */}
              <p className="text-[14px] text-[#374151] mt-0.5 truncate font-medium">
                {job.jobTitle || 'Role'}
              </p>
            </div>

            {/* Icons: Edit, Delete (gray, hover blue) */}
            <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(job);
                }}
                className="w-8 h-8 rounded-[6px] text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#F3F4F6] flex items-center justify-center transition-colors"
                title="Edit job"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(job);
                }}
                className="w-8 h-8 rounded-[6px] text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] flex items-center justify-center transition-colors"
                title="Delete job"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Date applied (12px gray) */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280] mt-2">
            <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span>Applied: {dateAppliedFormatted}</span>
          </div>

          {/* If interview date soon (<3 days): Red highlight on date + Calendar icon with alert */}
          {interviewDateFormatted && (
            <div
              className={`flex items-center gap-1.5 text-[12px] font-semibold mt-1.5 px-2 py-0.5 rounded-[6px] w-fit ${
                isInterviewSoon
                  ? 'bg-[#FEF2F2] text-[#EF4444] border border-[#EF4444]/30'
                  : 'bg-[#FEF3C7] text-[#B45309]'
              }`}
            >
              {isInterviewSoon ? (
                <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-[#B45309]" />
              )}
              <span>Interview: {interviewDateFormatted}</span>
              {isInterviewSoon && <span className="text-[10px] font-bold uppercase ml-1">Soon!</span>}
            </div>
          )}

          {/* Real Job Posting AI Analysis & Match Badge Card */}
          {(job.matchScore !== null && job.matchScore !== undefined) || job.aiAnalysis || job.jobSource ? (
            <JobAnalysisCard job={job} onViewAnalysis={onViewAnalysis} />
          ) : onViewAnalysis ? (
            <div className="mt-2.5 pt-2 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewAnalysis(job);
                }}
                className="text-[11px] font-semibold text-[#3B82F6] hover:text-[#1D4ED8] flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Analyze Match
              </button>
            </div>
          ) : null}

          {/* Gray separator line */}
          <div className="border-t border-[#E5E7EB] my-3" />

          {/* Notes preview (12px, first 50 chars) */}
          <p className="text-[12px] text-[#6B7280] italic truncate">
            {notesPreview ? `"${notesPreview}"` : 'No additional notes'}
          </p>
        </div>
      )}
    </Draggable>
  );
};

export default JobCard;
