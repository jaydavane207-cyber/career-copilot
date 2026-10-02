// frontend/src/components/Dashboard/ActivityTimeline.jsx
import React from 'react';
import { Briefcase, Calendar, Building } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const ActivityTimeline = ({ recentJobs = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900">Recent Applications Pipeline</h4>
        <span className="text-xs text-slate-400">{recentJobs.length} active</span>
      </div>

      <div className="space-y-3">
        {recentJobs && recentJobs.length > 0 ? (
          recentJobs.map((job) => (
            <div key={job.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="font-bold text-slate-900 truncate">{job.positionTitle}</h5>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${job.status === 'Offer' ? 'bg-emerald-100 text-emerald-700' : job.status === 'Interviewing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{job.companyName} • {job.location || 'Remote'}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-4">No recent jobs logged.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
