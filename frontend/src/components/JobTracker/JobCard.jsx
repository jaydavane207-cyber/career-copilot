// frontend/src/components/JobTracker/JobCard.jsx
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, CalendarCheck2, ExternalLink, Trash2, Edit3, DollarSign, GripVertical } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const JobCard = ({ job, index, onEdit, onDelete }) => {
  const dateAppliedFormatted = formatDate(job.dateApplied);
  const interviewDateFormatted = job.interviewDate ? formatDate(job.interviewDate) : null;

  return (
    <Draggable draggableId={String(job.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          onClick={() => onEdit(job)}
          className={`group relative bg-white rounded-xl border transition-all duration-200 cursor-pointer select-none p-3.5 ${
            snapshot.isDragging
              ? 'shadow-xl border-indigo-400 rotate-1 ring-2 ring-indigo-300 ring-opacity-50 scale-[1.02] z-50'
              : 'border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300'
          }`}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-300 group-hover:text-slate-400 transition-colors" {...provided.dragHandleProps} title="Drag to move card">
                  <GripVertical className="w-3.5 h-3.5 cursor-grab active:cursor-grabbing" />
                </span>
                {/* Company Name (bold) */}
                <h4 className="font-bold text-slate-900 text-sm tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                  {job.companyName}
                </h4>
              </div>
              {/* Job Title */}
              <p className="text-xs text-slate-600 font-medium truncate mt-0.5 pl-5">
                {job.jobTitle || job.positionTitle || 'Position'}
              </p>
            </div>

            {/* Actions: Edit & Trash Icon */}
            <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(job);
                }}
                title="Edit job application"
                className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(job);
                }}
                title="Delete job application"
                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dates & Badges */}
          <div className="mt-3 space-y-1.5 pl-5 text-xs">
            {/* Date Applied */}
            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-[11px]">Applied: {dateAppliedFormatted}</span>
            </div>

            {/* Interview Date (if exists) */}
            {interviewDateFormatted && (
              <div className="flex items-center gap-1.5 text-amber-700 font-medium bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60 w-fit">
                <CalendarCheck2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span className="text-[11px]">Interview: {interviewDateFormatted}</span>
              </div>
            )}

            {/* Salary (if exists) */}
            {job.salary && (
              <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50/70 px-2 py-0.5 rounded-md border border-emerald-100 text-[11px] font-medium w-fit">
                <DollarSign className="w-3 h-3 text-emerald-600" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>

          {/* Notes preview if present */}
          {job.notes && (
            <p className="mt-2.5 ml-5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg line-clamp-2 border border-slate-100 italic">
              "{job.notes}"
            </p>
          )}

          {/* Card Footer: External link */}
          {job.jobLink && (
            <div className="mt-2.5 ml-5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <a
                href={job.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors font-medium truncate"
              >
                <span>Job Posting</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default JobCard;
