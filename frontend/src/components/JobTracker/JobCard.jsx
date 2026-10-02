// frontend/src/components/JobTracker/JobCard.jsx
import React from 'react';
import { Building, MapPin, Calendar, ExternalLink, Trash2, Edit3, DollarSign } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const JobCard = ({ job, onStatusChange, onDelete, onEdit }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h4 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
            {job.positionTitle}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-0.5">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.companyName}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(job)}
              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(job.id)}
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-slate-500 my-3">
        {job.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{job.location} ({job.workType || 'Remote'})</span>
          </div>
        )}
        {job.salaryRange && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.salaryRange}</span>
          </div>
        )}
        {job.deadline && (
          <div className="flex items-center gap-1.5 text-amber-600">
            <Calendar className="w-3.5 h-3.5" />
            <span>Deadline: {formatDate(job.deadline)}</span>
          </div>
        )}
      </div>

      {job.notes && (
        <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg line-clamp-2 mb-3">
          {job.notes}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <select
          value={job.status}
          onChange={(e) => onStatusChange(job.id, e.target.value)}
          className="text-[11px] font-semibold rounded-md border border-slate-200 py-1 px-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="Wishlist">Wishlist</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        {job.jobUrl && (
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 text-[11px]"
          >
            <span>Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};

export default JobCard;
