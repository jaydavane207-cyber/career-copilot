// frontend/src/components/CodingTracker/WeakTopics.jsx
import React from 'react';
import { Button } from '../UI/Button';
import { BookOpen, RotateCcw, CheckCircle2 } from 'lucide-react';

export const WeakTopics = ({ weakTopics = [], onReviewTopic, onLearnMore }) => {
  // If no weak topics: "Great job! All topics >70% success"
  if (!weakTopics || weakTopics.length === 0) {
    return (
      <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
        <h2 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">
          Focus Areas
        </h2>
        <p className="text-[14px] text-[#10B981] font-semibold">
          Great job! All topics &gt;70% success
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-4">
      {/* H2: "Focus Areas" */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
        <h2 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">
          Focus Areas
        </h2>
        <span className="text-[12px] font-semibold text-[#EF4444] bg-[#FEF2F2] px-2.5 py-0.5 rounded-[12px]">
          {weakTopics.length} topics need work
        </span>
      </div>

      <div className="space-y-3">
        {weakTopics.map((item, idx) => {
          const rate = item.successRate ?? 40;
          const isCritical = rate < 50;

          // Progress bar color from red to green
          const barColor = isCritical ? 'bg-[#EF4444]' : 'bg-[#F59E0B]';

          return (
            <div
              key={idx}
              className="p-3.5 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] space-y-2"
            >
              <div className="flex items-center justify-between">
                {/* Topic name: bold red if <50%, orange if <70% */}
                <h4
                  className={`text-[14px] font-bold ${
                    isCritical ? 'text-[#EF4444]' : 'text-[#B45309]'
                  }`}
                >
                  {item.topic}
                </h4>

                {/* Success rate percentage */}
                <span
                  className={`text-[12px] font-bold px-2 py-0.5 rounded-[4px] ${
                    isCritical
                      ? 'bg-[#FEF2F2] text-[#EF4444]'
                      : 'bg-[#FEF3C7] text-[#B45309]'
                  }`}
                >
                  {rate}% success
                </span>
              </div>

              {/* Number of problems (e.g. "Solved 3/5") */}
              <p className="text-[12px] text-[#6B7280]">
                Solved {item.solved ?? 2}/{item.total ?? 5} problems
              </p>

              {/* Progress bar (red to green) */}
              <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} transition-all duration-300`}
                  style={{ width: `${rate}%` }}
                />
              </div>

              {/* Action buttons: Review and Learn More */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onReviewTopic && onReviewTopic(item.topic)}
                  className="px-2.5 py-1 text-[12px] font-semibold text-[#3B82F6] hover:bg-[#EBF5FF] rounded-[6px] transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Review</span>
                </button>

                <a
                  href={`https://leetcode.com/tag/${item.topic.toLowerCase().replace(/\s+/g, '-')}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-[12px] font-semibold text-[#6B7280] hover:text-[#374151] hover:bg-[#E5E7EB] rounded-[6px] transition-colors flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Learn More</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeakTopics;
