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
  Clock
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const iconConfig = {
  resume: { icon: FileText, color: 'bg-[#3B82F6] text-white', link: '/resume' },
  interview: { icon: Mic, color: 'bg-[#F59E0B] text-white', link: '/mock-interview' },
  coding: { icon: Code2, color: 'bg-[#8B5CF6] text-white', link: '/coding' },
  job: { icon: Briefcase, color: 'bg-[#10B981] text-white', link: '/jobs' },
  study: { icon: BookOpen, color: 'bg-[#06B6D4] text-white', link: '/study-plan' },
  default: { icon: Clock, color: 'bg-[#6B7280] text-white', link: '/dashboard' }
};

export const ActivityTimeline = ({ recentActivities = [], recentJobs = [] }) => {
  let activities = [];
  if (Array.isArray(recentActivities) && recentActivities.length > 0) {
    activities = recentActivities.slice(0, 8);
  } else if (Array.isArray(recentJobs) && recentJobs.length > 0) {
    activities = recentJobs.slice(0, 8).map((job) => ({
      id: `job-${job.id}`,
      type: 'job',
      description: `Applied to ${job.companyName} for ${job.jobTitle || 'Role'} (${job.stage || 'Applied'})`,
      date: job.dateApplied || job.createdAt,
      link: '/jobs'
    }));
  }

  // Fallback demo activities if empty
  if (activities.length === 0) {
    activities = [
      {
        id: 'act-1',
        type: 'resume',
        description: 'Uploaded Software_Engineer_Resume.pdf - ATS Match Score: 85%',
        date: new Date(Date.now() - 3600000 * 2),
        link: '/resume'
      },
      {
        id: 'act-2',
        type: 'coding',
        description: 'Solved "Two Sum" and "Valid Parentheses" in under 25 mins',
        date: new Date(Date.now() - 3600000 * 8),
        link: '/coding'
      },
      {
        id: 'act-3',
        type: 'interview',
        description: 'Completed Technical Mock Interview on System Design & Distributed Caching',
        date: new Date(Date.now() - 3600000 * 24),
        link: '/mock-interview'
      },
      {
        id: 'act-4',
        type: 'job',
        description: 'Advanced to Technical Interview stage with Stripe',
        date: new Date(Date.now() - 3600000 * 48),
        link: '/jobs'
      },
      {
        id: 'act-5',
        type: 'study',
        description: 'Completed Week 2 Curriculum: SQL Indexes & Database Normalization',
        date: new Date(Date.now() - 3600000 * 72),
        link: '/study-plan'
      }
    ];
  }

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col justify-between">
      <div>
        {/* H2: "Recent activity" */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-bold text-[#111827] leading-[32px] tracking-[-0.5px]">
            Recent activity
          </h2>
          <span className="text-[12px] text-[#6B7280]">
            Last {activities.length} events
          </span>
        </div>

        {/* Vertical timeline (left line with circles) */}
        <div className="relative pl-6 space-y-6 max-h-[380px] overflow-y-auto pr-1">
          {/* Vertical continuous line */}
          <div className="absolute left-[15px] top-3 bottom-3 w-[2px] bg-[#E5E7EB]" />

          {activities.map((item) => {
            const config = iconConfig[item.type] || iconConfig.default;
            const Icon = config.icon;
            const timeAgoStr = item.date ? formatDate(item.date) : 'Recently';

            return (
              <div key={item.id} className="relative flex items-start gap-4 group">
                {/* Colored Icon circle on top of the line */}
                <div
                  className={`relative z-10 w-[32px] h-[32px] -ml-[32px] rounded-full flex items-center justify-center flex-shrink-0 shadow-xs border-2 border-white ${config.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-[#6B7280] font-medium">
                      {timeAgoStr}
                    </span>
                    {(item.link || config.link) && (
                      <Link
                        to={item.link || config.link}
                        className="text-[12px] font-semibold text-[#3B82F6] hover:underline flex items-center gap-1 opacity-80 group-hover:opacity-100"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  <p className="text-[14px] text-[#374151] mt-0.5 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
