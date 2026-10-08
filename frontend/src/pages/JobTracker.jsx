// frontend/src/pages/JobTracker.jsx
import React, { useState } from 'react';
import KanbanBoard from '../components/JobTracker/KanbanBoard';
import JobURLAnalyzerModal from '../components/JobTracker/JobURLAnalyzerModal';
import { Sparkles, Link2, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

export const JobTracker = () => {
  const [isHeroAnalyzerOpen, setIsHeroAnalyzerOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Hero Section: Analyze jobs before you apply */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 sm:p-8 shadow-md border border-blue-600/50">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/15 text-white backdrop-blur-md border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Real Job Postings Integration</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Analyze jobs before you apply
          </h2>

          <p className="text-sm text-blue-100 font-medium leading-relaxed">
            Paste any job URL from LinkedIn, Indeed, or Glassdoor. Instantly scrape requirements, compare against your resume, calculate match score, and generate a tailored study plan.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsHeroAnalyzerOpen(true)}
              className="px-5 py-3 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Link2 className="w-4 h-4 text-blue-700" />
              <span>Analyze Job URL</span>
            </button>

            <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-blue-100">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                Instant Match Score
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-yellow-300" />
                Prep Roadmaps
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                Auto-saved to Tracker
              </span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -bottom-10 w-96 bg-gradient-to-l from-indigo-500/30 to-transparent pointer-events-none rounded-r-2xl"></div>
      </div>

      {/* Main Kanban Board */}
      <KanbanBoard />

      {/* Hero Modal Trigger */}
      <JobURLAnalyzerModal
        isOpen={isHeroAnalyzerOpen}
        onClose={() => setIsHeroAnalyzerOpen(false)}
      />
    </div>
  );
};

export default JobTracker;
