// frontend/src/components/Dashboard/ActivityTimeline.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const ActivityTimeline = ({ recentJobs = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900 tracking-tight">Recent Applications Pipeline</h4>
        <Link
          to="/jobs"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          <span>View Kanban</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {recentJobs && recentJobs.length > 0 ? (
          recentJobs.map((job) => {
            const stage = (job.stage || '').toLowerCase();
            const stageBadge =
              stage === 'offer' || job.status === 'Offer'
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : stage === 'interview' || job.status === 'Interviewing'
                ? 'bg-amber-100 text-amber-700 border-amber-200'
                : 'bg-blue-100 text-blue-700 border-blue-200';

            const stageLabel =
              stage === 'offer' || job.status === 'Offer'
                ? 'Offer'
                : stage === 'interview' || job.status === 'Interviewing'
                ? 'Interview'
                : 'Applied';

            return (
              <div
                key={job.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Building className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-bold text-slate-900 truncate">
                      {job.jobTitle || job.positionTitle || 'Position'}
                    </h5>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${stageBadge}`}
                    >
                      {stageLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700 truncate">{job.companyName}</span>
                    <span>{formatDate(job.dateApplied || job.appliedDate)}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-4">No recent jobs logged.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
