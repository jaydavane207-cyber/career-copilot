// frontend/src/components/Resume/CircularProgress.jsx
import React from 'react';

/**
 * Circular progress indicator component for ATS match score
 * @param {number} score - Score value between 0 and 100
 * @param {number} size - Outer diameter in px (default: 130)
 * @param {number} strokeWidth - Thickness of the progress arc (default: 10)
 */
export const CircularProgress = ({ score = 0, size = 130, strokeWidth = 10 }) => {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  // SVG Geometry calculations
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  // Color mapping based on score tiers
  let strokeColor = '#f43f5e'; // Rose (<50)
  let textColor = 'text-rose-600';
  let badgeLabel = 'Needs Work';
  let badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';

  if (safeScore >= 75) {
    strokeColor = '#10b981'; // Emerald (>=75)
    textColor = 'text-emerald-600';
    badgeLabel = 'Strong Match';
    badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (safeScore >= 50) {
    strokeColor = '#f59e0b'; // Amber (50-74)
    textColor = 'text-amber-500';
    badgeLabel = 'Good Match';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Indicator Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Centered Score Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${textColor}`}>
            {safeScore}%
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Match Score
          </span>
        </div>
      </div>

      {/* Tier Badge */}
      <span className={`mt-2 px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${badgeBg}`}>
        {badgeLabel}
      </span>
    </div>
  );
};

export default CircularProgress;
