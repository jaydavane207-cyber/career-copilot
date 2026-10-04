// frontend/src/components/Dashboard/NextSteps.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Code2,
  Mic,
  FileText,
  Briefcase,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const iconMap = {
  BookOpen,
  Code2,
  Mic,
  FileText,
  Briefcase,
  CheckCircle2
};

export const NextSteps = ({ nextSteps = [], nextActions = [] }) => {
  const navigate = useNavigate();

  // Standardize 3-5 action items
  let steps = [];
  if (Array.isArray(nextSteps) && nextSteps.length > 0) {
    steps = nextSteps.slice(0, 5);
  } else if (Array.isArray(nextActions) && nextActions.length > 0) {
    steps = nextActions.slice(0, 5).map((action, idx) => {
      let icon = 'CheckCircle2';
      let link = '/dashboard';
      const lower = action.toLowerCase();

      if (lower.includes('study') || lower.includes('plan')) {
        icon = 'BookOpen';
        link = '/study-plan';
      } else if (lower.includes('coding') || lower.includes('problem') || lower.includes('dsa')) {
        icon = 'Code2';
        link = '/coding';
      } else if (lower.includes('interview')) {
        icon = 'Mic';
        link = '/mock-interview';
      } else if (lower.includes('resume')) {
        icon = 'FileText';
        link = '/resume';
      } else if (lower.includes('apply') || lower.includes('job')) {
        icon = 'Briefcase';
        link = '/jobs';
      }

      return {
        id: `step-${idx}`,
        description: action,
        progress: (idx + 1) * 20,
        icon,
        link
      };
    });
  }

  // Fallback 4 high-value actions if empty
  if (steps.length === 0) {
    steps = [
      {
        id: 'step-1',
        description: 'Upload resume and run ATS keyword screening against target job specs',
        progress: 75,
        icon: 'FileText',
        link: '/resume'
      },
      {
        id: 'step-2',
        description: 'Complete 3 daily LeetCode/DSA problems in your target weak topics',
        progress: 40,
        icon: 'Code2',
        link: '/coding'
      },
      {
        id: 'step-3',
        description: 'Run a timed Technical & System Design Mock Interview simulation',
        progress: 20,
        icon: 'Mic',
        link: '/mock-interview'
      },
      {
        id: 'step-4',
        description: 'Track at least 3 new active job applications in your Kanban pipeline',
        progress: 60,
        icon: 'Briefcase',
        link: '/jobs'
      }
    ];
  }

  return (
    <div id="next-steps-section" className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      {/* H2: "What to do next" */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] font-bold text-[#111827] leading-[32px] tracking-[-0.5px]">
          What to do next
        </h2>
        <span className="text-[12px] font-semibold text-[#3B82F6] bg-[#EBF5FF] px-2.5 py-1 rounded-[12px]">
          {steps.length} recommended actions
        </span>
      </div>

      {/* List of 3-5 action items */}
      <div className="space-y-[16px]">
        {steps.map((item) => {
          const IconComponent = iconMap[item.icon] || CheckCircle2;
          const progressVal = item.progress || 0;

          return (
            <div
              key={item.id}
              onClick={() => navigate(item.link || '/dashboard')}
              className="bg-[#EBF5FF] p-[16px] rounded-[8px] cursor-pointer hover:bg-[#DBEAFE] transition-all duration-200 flex items-center justify-between gap-4 group"
            >
              {/* Blue icon (left) */}
              <div className="w-[40px] h-[40px] rounded-[8px] bg-white text-[#3B82F6] shadow-sm flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-5 h-5 text-[#3B82F6]" />
              </div>

              {/* Description + progress (if applicable) */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#1E40AF] group-hover:text-[#1D4ED8] transition-colors leading-snug">
                  {item.description}
                </p>

                {progressVal > 0 && (
                  <div className="flex items-center gap-3 mt-1.5 max-w-xs">
                    <div className="flex-1 h-[6px] rounded-[3px] bg-white overflow-hidden">
                      <div
                        className="h-full bg-[#3B82F6] rounded-[3px] transition-all duration-300"
                        style={{ width: `${progressVal}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-[#3B82F6]">
                      {progressVal}%
                    </span>
                  </div>
                )}
              </div>

              {/* Right arrow icon */}
              <div className="w-[32px] h-[32px] rounded-[8px] bg-white/60 group-hover:bg-white text-[#3B82F6] flex items-center justify-center flex-shrink-0 transition-transform group-hover:translate-x-1 duration-150">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NextSteps;
