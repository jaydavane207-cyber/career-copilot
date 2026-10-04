// frontend/src/components/Dashboard/Recommendations.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, X, ArrowRight } from 'lucide-react';

export const Recommendations = ({ recommendations = [], targetRole = 'Frontend Developer' }) => {
  const initialTips =
    Array.isArray(recommendations) && recommendations.length > 0
      ? recommendations.slice(0, 3).map((r, i) => ({
          id: r.id || `tip-${i}`,
          text: r.text || r.title || r.message,
          link: r.actionUrl || r.link || '/dashboard'
        }))
      : [
          {
            id: 'tip-1',
            text: 'Your resume lacks 4 key keywords for senior roles: add "System Architecture" and "CI/CD Pipelines" to the experience section.',
            link: '/resume'
          },
          {
            id: 'tip-2',
            text: 'Graph traversal questions have a 50% success rate: dedicate 2 practice sessions this week to BFS/DFS problems.',
            link: '/coding'
          },
          {
            id: 'tip-3',
            text: 'You have 1 pending technical interview scheduled within 3 days: conduct a full 30-minute mock simulation to polish behavioral answers.',
            link: '/mock-interview'
          }
        ];

  const [tips, setTips] = useState(initialTips);

  const handleDismiss = (id) => {
    setTips((prev) => prev.filter((t) => t.id !== id));
  };

  if (tips.length === 0) return null;

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      {/* H3: "Tips for you" */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <div className="w-[32px] h-[32px] rounded-[8px] bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <h3 className="text-[20px] font-semibold text-[#111827] tracking-[-0.5px]">
            Tips for you
          </h3>
        </div>
        <span className="text-[12px] text-[#6B7280]">
          Personalized for {targetRole}
        </span>
      </div>

      {/* List of 2-3 recommendations */}
      <div className="space-y-3">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="flex items-start justify-between gap-4 p-4 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#3B82F6]/40 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Lightbulb className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="text-[14px] text-[#374151] leading-relaxed">
                  {tip.text}
                </p>
                <Link
                  to={tip.link}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#3B82F6] hover:underline pt-0.5"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Dismiss button (X icon) */}
            <button
              type="button"
              onClick={() => handleDismiss(tip.id)}
              className="text-[#9CA3AF] hover:text-[#374151] p-1 rounded-[6px] hover:bg-[#E5E7EB] transition-colors"
              title="Dismiss tip"
              aria-label="Dismiss recommendation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
