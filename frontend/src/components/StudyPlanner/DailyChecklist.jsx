// frontend/src/components/StudyPlanner/DailyChecklist.jsx
import React, { useState } from 'react';
import { CheckSquare, Square, ChevronDown, ChevronUp, BookOpen, ExternalLink } from 'lucide-react';
import { LinearProgress } from '../UI/ProgressIndicators';

export const DailyChecklist = ({ currentWeekModule, onToggleTask, planId }) => {
  const [expandedResource, setExpandedResource] = useState(null);

  if (!currentWeekModule) return null;

  const tasks = currentWeekModule.dailyTasks || [];
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
        <div>
          <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px]">
            This Week's Tasks
          </h2>
          <p className="text-[13px] text-[#6B7280] font-medium mt-0.5">
            {currentWeekModule.title || 'Week 1 of 8'}
          </p>
        </div>

        <span className="text-[12px] font-bold px-3 py-1 rounded-[12px] bg-[#EBF5FF] text-[#3B82F6]">
          {completedCount} / {tasks.length} Completed
        </span>
      </div>

      {/* Days in row (Mon-Sun) */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const isExpanded = expandedResource === task.id;

          return (
            <div
              key={task.id}
              className={`p-3.5 rounded-[8px] border transition-all ${
                task.completed
                  ? 'bg-[#F9FAFB] border-[#E5E7EB]'
                  : 'bg-white border-[#E5E7EB] hover:border-[#3B82F6]/50 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div
                  onClick={() => onToggleTask(planId, task.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <button
                    type="button"
                    className="text-[#3B82F6] flex-shrink-0 focus:outline-none"
                    aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-[#10B981]" />
                    ) : (
                      <Square className="w-5 h-5 text-[#9CA3AF]" />
                    )}
                  </button>

                  {/* Date (e.g. "Mon 8") */}
                  <span className="text-[12px] font-bold text-[#6B7280] w-14 flex-shrink-0">
                    {task.day || task.dayName}
                  </span>

                  {/* Skill name */}
                  <span
                    className={`text-[14px] truncate flex-1 ${
                      task.completed
                        ? 'line-through text-[#9CA3AF]'
                        : 'font-semibold text-[#374151]'
                    }`}
                  >
                    {task.skill || task.task}
                  </span>
                </div>

                {/* Hours (e.g., "2h") */}
                <span className="text-[12px] font-semibold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-[4px] flex-shrink-0">
                  {task.hours || '2h'}
                </span>

                {/* Resources link (expand to show) */}
                <button
                  type="button"
                  onClick={() => setExpandedResource(isExpanded ? null : task.id)}
                  className="text-[12px] font-semibold text-[#3B82F6] hover:underline flex items-center gap-0.5 flex-shrink-0 pl-1"
                >
                  <span>Resources</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Expanded resources drawer */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#E5E7EB] text-[13px] text-[#374151] space-y-1.5 pl-8 animate-fade-in">
                  <p className="font-semibold text-[#111827]">Suggested Learning Pathway:</p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <a
                      href={`https://devdocs.io/#q=${encodeURIComponent(task.skill || 'javascript')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#3B82F6] hover:underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Documentation Reference</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(task.skill || 'javascript tutorial')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#3B82F6] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Video Walkthrough</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visual progress bar below: "5/7 tasks complete" */}
      <div className="pt-2">
        <LinearProgress
          value={completedCount}
          max={tasks.length || 7}
          label={`${completedCount}/${tasks.length || 7} tasks complete`}
          showPercentage={true}
          color="#3B82F6"
        />
      </div>
    </div>
  );
};

export default DailyChecklist;
