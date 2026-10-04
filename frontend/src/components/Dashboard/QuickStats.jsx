// frontend/src/components/Dashboard/QuickStats.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Send, CalendarCheck, Clock, Code2, ArrowRight } from 'lucide-react';

export const QuickStats = ({ summary = {} }) => {
  const {
    totalJobsApplied = 0,
    interviews = 0,
    studyHoursLogged = 0,
    codesProblemsLogged = 0
  } = summary;

  const stats = [
    {
      id: 'stat-applied',
      label: 'Total Applications',
      value: totalJobsApplied,
      sublabel: `${totalJobsApplied} tracked in pipeline`,
      icon: Send,
      iconColor: 'text-blue-600 bg-blue-50',
      link: '/jobs',
      linkText: 'View Kanban'
    },
    {
      id: 'stat-interviews',
      label: 'Interview Scheduled',
      value: interviews > 0 ? 'Yes' : 'No',
      badge: interviews > 0 ? `${interviews} Active` : '0 Scheduled',
      sublabel: interviews > 0 ? `${interviews} live rounds pending` : 'Schedule upcoming rounds',
      icon: CalendarCheck,
      iconColor: 'text-amber-600 bg-amber-50',
      link: '/jobs',
      linkText: 'Interview Pipeline'
    },
    {
      id: 'stat-hours',
      label: 'Study Hours Logged',
      value: `${studyHoursLogged}h`,
      sublabel: 'Dedicated prep & roadmap hours',
      icon: Clock,
      iconColor: 'text-purple-600 bg-purple-50',
      link: '/study-plan',
      linkText: 'Study Tracker'
    },
    {
      id: 'stat-problems',
      label: 'Problems Practiced',
      value: codesProblemsLogged,
      sublabel: 'DSA & algorithmic challenges solved',
      icon: Code2,
      iconColor: 'text-emerald-600 bg-emerald-50',
      link: '/coding',
      linkText: 'Coding Practice'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Quick Stats</h3>
        <span className="text-xs font-semibold text-slate-500">Live Prep Activity</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${item.iconColor} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${interviews > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {item.value}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {item.sublabel}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;
