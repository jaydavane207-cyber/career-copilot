// frontend/src/components/Dashboard/NoDataBanner.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, Target, BookOpen, Mic, ArrowRight } from 'lucide-react';

export const NoDataBanner = ({ targetRole = 'Software Engineer' }) => {
  const steps = [
    {
      num: '1',
      title: 'Upload your first resume',
      desc: 'Get an ATS match score and keyword gap analysis',
      icon: FileText,
      link: '/resume',
      cta: 'Upload Resume',
      color: 'bg-blue-600'
    },
    {
      num: '2',
      title: 'Audit core skills',
      desc: 'Verify competencies for your target role',
      icon: Target,
      link: '/skills',
      cta: 'Skill Audit',
      color: 'bg-emerald-600'
    },
    {
      num: '3',
      title: 'Generate study plan',
      desc: 'Structured 4-week preparation roadmap',
      icon: BookOpen,
      link: '/study-plan',
      cta: 'Create Plan',
      color: 'bg-purple-600'
    },
    {
      num: '4',
      title: 'Simulate mock interview',
      desc: 'Timed practice with rubrics and feedback',
      icon: Mic,
      link: '/mock-interview',
      cta: 'Start Mock Interview',
      color: 'bg-amber-600'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-white to-blue-50 rounded-2xl border border-indigo-200/80 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Upload your first resume to get started
            </h3>
            <p className="text-xs text-slate-600">
              Complete these steps to calculate your live Career Readiness Score for <strong>{targetRole}</strong>.
            </p>
          </div>
        </div>

        <Link
          to="/resume"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex-shrink-0"
        >
          <span>Upload First Resume</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.num}
              to={s.link}
              className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`w-6 h-6 rounded-full ${s.color} text-white text-[11px] font-black flex items-center justify-center`}>
                    {s.num}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {s.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {s.desc}
                </p>
              </div>

              <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 pt-1">
                <span>{s.cta}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NoDataBanner;
