// frontend/src/components/Dashboard/MetricsCards.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Target, BookOpen, Mic, Send, Code2, ArrowRight } from 'lucide-react';

export const MetricsCards = ({
  resumeScore = 0,
  skillGapScore = 0,
  studyProgress = 0,
  interviewScore = 0,
  jobsApplied = 0,
  codingSolved = 0
}) => {
  const cards = [
    {
      id: 'metric-resume',
      title: 'Resume Score',
      number: `${resumeScore}%`,
      subtext: 'ATS alignment against target job specs',
      icon: FileText,
      iconColor: 'text-[#3B82F6] bg-[#EBF5FF]',
      link: '/resume',
      linkLabel: 'View Resume Analyzer'
    },
    {
      id: 'metric-skills',
      title: 'Skill Coverage',
      number: `${skillGapScore}%`,
      subtext: 'Core benchmark skills mastered',
      icon: Target,
      iconColor: 'text-[#10B981] bg-[#D1FAE5]',
      link: '/skills',
      linkLabel: 'View Skill Gap Matrix'
    },
    {
      id: 'metric-study',
      title: 'Study Progress',
      number: `${studyProgress}%`,
      subtext: 'Roadmap task completion this cycle',
      icon: BookOpen,
      iconColor: 'text-[#8B5CF6] bg-[#F5F3FF]',
      link: '/study-plan',
      linkLabel: 'View Study Plan'
    },
    {
      id: 'metric-interview',
      title: 'Interview Score',
      number: `${interviewScore}%`,
      subtext: 'Average score across mock rubrics',
      icon: Mic,
      iconColor: 'text-[#F59E0B] bg-[#FEF3C7]',
      link: '/mock-interview',
      linkLabel: 'View Mock Interviews'
    },
    {
      id: 'metric-jobs',
      title: 'Jobs Applied',
      number: `${jobsApplied}`,
      subtext: 'Active tracked applications in pipeline',
      icon: Send,
      iconColor: 'text-[#2563EB] bg-[#EFF6FF]',
      link: '/jobs',
      linkLabel: 'View Job Tracker'
    },
    {
      id: 'metric-coding',
      title: 'Coding Problems',
      number: `${codingSolved}`,
      subtext: 'Algorithmic challenges solved',
      icon: Code2,
      iconColor: 'text-[#059669] bg-[#ECFDF5]',
      link: '/coding',
      linkLabel: 'View Practice Log'
    }
  ];

  return (
    <div className="space-y-4">
      {/* 6 cards in 3x2 grid (1 col on mobile, 2 col on tablet, 3 col on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Icon (32px, colored) & Title */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-[48px] h-[48px] rounded-[10px] flex items-center justify-center flex-shrink-0 ${card.iconColor}`}
                  >
                    <Icon className="w-[32px] h-[32px]" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#374151]">
                      {card.title}
                    </h3>
                    <p className="text-[12px] text-[#6B7280]">
                      {card.subtext}
                    </p>
                  </div>
                </div>

                {/* Large number (32px bold) */}
                <div className="text-[32px] font-bold text-[#111827] tracking-[-0.5px] mt-2">
                  {card.number}
                </div>
              </div>

              {/* Optional: "View" link */}
              <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <Link
                  to={card.link}
                  className="text-[14px] font-semibold text-[#3B82F6] hover:text-[#2563EB] inline-flex items-center gap-1.5 transition-colors group-hover:translate-x-0.5 duration-150"
                >
                  <span>{card.linkLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-[12px] text-[#9CA3AF]">
                  View
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsCards;
