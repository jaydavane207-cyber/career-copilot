// frontend/src/components/Dashboard/MetricsCards.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Target, BookOpen, Mic, ArrowUpRight } from 'lucide-react';

const getProgressColor = (score = 0) => {
  if (score <= 33) return 'bg-rose-500';
  if (score <= 66) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const getBadgeStyle = (score = 0) => {
  if (score <= 33) return 'bg-rose-50 text-rose-700 border-rose-200';
  if (score <= 66) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
};

export const MetricsCards = ({
  resumeScore = 0,
  skillGapScore = 0,
  studyProgress = 0,
  interviewScore = 0
}) => {
  const cards = [
    {
      id: 'metric-resume',
      title: 'Resume Match',
      score: resumeScore,
      weight: '20%',
      contribution: (resumeScore * 0.20).toFixed(1),
      icon: FileText,
      iconBg: 'bg-blue-50 text-blue-600',
      description: 'Average match score across uploaded resume ATS audits',
      link: '/resume',
      actionText: 'View Resume Analyzer'
    },
    {
      id: 'metric-skills',
      title: 'Skills Gap',
      score: skillGapScore,
      weight: '30%',
      contribution: (skillGapScore * 0.30).toFixed(1),
      icon: Target,
      iconBg: 'bg-emerald-50 text-emerald-600',
      description: '100 - average gap % against target role competencies',
      link: '/skills',
      actionText: 'Explore Skill Matrix'
    },
    {
      id: 'metric-study',
      title: 'Study Progress',
      score: studyProgress,
      weight: '25%',
      contribution: (studyProgress * 0.25).toFixed(1),
      icon: BookOpen,
      iconBg: 'bg-purple-50 text-purple-600',
      description: 'Completion rate of active curriculum roadmap & tasks',
      link: '/study-plan',
      actionText: 'Open Study Planner'
    },
    {
      id: 'metric-interview',
      title: 'Interview Practice',
      score: interviewScore,
      weight: '25%',
      contribution: (interviewScore * 0.25).toFixed(1),
      icon: Mic,
      iconBg: 'bg-amber-50 text-amber-600',
      description: 'Average confidence & rubric score across mock simulations',
      link: '/mock-interview',
      actionText: 'Simulate Mock Interview'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Key Metrics</h3>
        <span className="text-xs font-semibold text-slate-500">2x2 Competency Pillars</span>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const progressColor = getProgressColor(card.score);
          const badgeStyle = getBadgeStyle(card.score);

          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">Weight: {card.weight}</p>
                    </div>
                  </div>

                  {/* Score badge */}
                  <div className={`px-2.5 py-1 rounded-xl border text-xs font-black ${badgeStyle}`}>
                    {card.score}%
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
                      style={{ width: `${Math.min(100, Math.max(0, card.score))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Readiness boost: +{card.contribution} pts</span>
                    <span>{card.score >= 67 ? 'Mastered' : card.score >= 34 ? 'Progressing' : 'Needs Focus'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Action Link */}
              <div className="pt-4 mt-3 border-t border-slate-100">
                <Link
                  to={card.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group-hover:translate-x-0.5 transform duration-150"
                >
                  <span>{card.actionText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsCards;
