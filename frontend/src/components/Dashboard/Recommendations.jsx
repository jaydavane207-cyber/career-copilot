// frontend/src/components/Dashboard/Recommendations.jsx
import React from 'react';
import { Sparkles, Lightbulb, Compass } from 'lucide-react';

export const Recommendations = ({ targetRole }) => {
  const tips = [
    { title: 'Quantify Engineering Impact', desc: 'Include metrics in work history (e.g., reduced API latency by 35%, managed 10k daily requests).' },
    { title: 'Consistent DSA Problem Solving', desc: 'Target 1-2 medium LeetCode problems daily focusing on Graph and DP patterns.' },
    { title: 'Practice System Design Verbal Framing', desc: 'Use clear requirements estimation, back-of-the-envelope calculations, and architectural trade-offs.' }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h4 className="text-sm font-bold tracking-tight">AI Strategy Recommendations for {targetRole || 'Developers'}</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {tips.map((tip, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 space-y-1">
            <h5 className="font-bold text-xs text-indigo-200">{tip.title}</h5>
            <p className="text-[11px] text-slate-300 leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
