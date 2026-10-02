// frontend/src/components/StudyPlanner/DailyChecklist.jsx
import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

export const DailyChecklist = ({ modules, onToggleTask, planId }) => {
  if (!modules || modules.length === 0) return null;

  return (
    <div className="space-y-4">
      {modules.map((weekItem, wIdx) => (
        <div key={wIdx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{weekItem.title}</h4>
              <p className="text-[11px] text-slate-500">
                Focus Areas: {weekItem.focusSkills?.join(', ') || 'Core concepts'} • {weekItem.allocatedHours} hrs
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              Week {weekItem.week}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {weekItem.dailyTasks?.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(planId, task.id)}
                className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-slate-50 border-slate-200/80 text-slate-400'
                    : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800'
                }`}
              >
                <button type="button" className="mt-0.5 text-indigo-600 flex-shrink-0">
                  {task.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                <div className="flex-1 text-xs">
                  <span className="font-bold mr-1.5 text-indigo-600">{task.day}:</span>
                  <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}>
                    {task.task}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyChecklist;
