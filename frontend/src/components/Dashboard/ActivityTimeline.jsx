// frontend/src/components/Dashboard/ActivityTimeline.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Code2,
  Mic,
  Briefcase,
  BookOpen,
  ArrowRight,
  Clock,
  History
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const iconForType = (type) => {
  switch (type) {
    case 'resume':
      return { icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-100' };
    case 'interview':
      return { icon: Mic, color: 'text-amber-600 bg-amber-50 border-amber-100' };
    case 'coding':
      return { icon: Code2, color: 'text-purple-600 bg-purple-50 border-purple-100' };
    case 'job':
      return { icon: Briefcase, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
    case 'study':
      return { icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
    default:
      return { icon: Clock, color: 'text-slate-600 bg-slate-50 border-slate-100' };
  }
};

export const ActivityTimeline = ({ recentActivities = [], recentJobs = [] }) => {
  // If recentActivities is provided from the backend, use it; otherwise fallback to recentJobs
  let activities = [];
  if (Array.isArray(recentActivities) && recentActivities.length > 0) {
    activities = recentActivities.slice(0, 5);
  } else if (Array.isArray(recentJobs) && recentJobs.length > 0) {
    activities = recentJobs.slice(0, 5).map(job => ({
      id: `job-${job.id}`,
      type: 'job',
      title: `Applied to ${job.companyName}`,
      description: `Role: ${job.jobTitle || job.positionTitle} - Status: ${job.stage || job.status || 'Applied'}`,
      date: job.dateApplied || job.createdAt,
      link: '/jobs'
    }));
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <History className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Activity Timeline
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Your last 5 preparation milestones across modules
          </p>
        </div>

        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {activities.length} Recorded
        </span>
      </div>

      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((item, idx) => {
            const { icon: Icon, color } = iconForType(item.type);
            const dateStr = item.date ? formatDate(item.date) : 'Recently';

            return (
              <div
                key={item.id || idx}
                className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 transition-all text-xs group"
              >
                <div className={`w-9 h-9 rounded-xl border ${color} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h5>
                    <span className="text-[10px] font-medium text-slate-400 flex-shrink-0">
                      {dateStr}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>

                {item.link && (
                  <Link
                    to={item.link}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex-shrink-0"
                    title="View details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No recent activities logged yet.</p>
            <p className="text-[11px] text-slate-400">
              Upload your resume or practice coding to see your timeline unfold.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
