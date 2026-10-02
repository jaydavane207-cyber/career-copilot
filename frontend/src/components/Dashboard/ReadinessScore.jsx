// frontend/src/components/Dashboard/ReadinessScore.jsx
import React from 'react';
import { Award, FileText, Target, Code2, Mic } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';

export const ReadinessScore = ({ score = 65, breakdown }) => {
  const scoreBadgeColor = score >= 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : score >= 60 ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : 'text-amber-600 bg-amber-50 border-amber-200';

  const components = [
    { label: 'Resume ATS Match', weight: '25%', score: breakdown?.resume?.score || 0, icon: FileText, color: 'bg-blue-500' },
    { label: 'Role Skills Alignment', weight: '25%', score: breakdown?.skills?.score || 0, icon: Target, color: 'bg-emerald-500' },
    { label: 'Coding Practice Volume', weight: '25%', score: breakdown?.coding?.score || 0, icon: Code2, color: 'bg-purple-500' },
    { label: 'Mock Interview Pacing', weight: '25%', score: breakdown?.interview?.score || 0, icon: Mic, color: 'bg-amber-500' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Overall Preparedness</span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Career Readiness Score</h3>
          <p className="text-xs text-slate-500">Holistic index balancing resume, skills, algorithms, and interviews.</p>
        </div>

        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${scoreBadgeColor}`}>
          <Award className="w-8 h-8 flex-shrink-0" />
          <div className="text-right">
            <span className="text-3xl font-black">{formatPercentage(score)}</span>
            <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">Readiness</span>
          </div>
        </div>
      </div>

      {/* Breakdown progress bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {components.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.label}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{formatPercentage(item.score)}</span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
                />
              </div>

              <span className="text-[10px] text-slate-400 block font-medium">Weight: {item.weight}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadinessScore;
