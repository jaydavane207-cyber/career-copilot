// frontend/src/components/UI/ProgressIndicators.jsx
import React from 'react';

/**
 * Linear Progress Bar Component
 * Height: 8px, Radius: 4px, Background: #F3F4F6, Progress: #3B82F6
 */
export const LinearProgress = ({
  value = 0,
  max = 100,
  label,
  showPercentage = false,
  color = '#3B82F6',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-[12px] font-semibold text-[#374151]">
          {label && <span>{label}</span>}
          {showPercentage && <span className="text-[#6B7280]">{percentage}% complete</span>}
        </div>
      )}
      <div className="w-full h-[8px] rounded-[4px] bg-[#F3F4F6] overflow-hidden">
        <div
          className="h-full rounded-[4px] transition-all duration-200 ease-in-out"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

/**
 * Circular Progress Component
 * Default diameter: 120px, Stroke: 8px, Background: #F3F4F6, Progress: #3B82F6
 */
export const CircularProgress = ({
  score = 0,
  size = 120,
  strokeWidth = 8,
  color,
  sublabel,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const validScore = Math.min(100, Math.max(0, Math.round(score)));
  const offset = circumference - (validScore / 100) * circumference;

  // Determine progress color if not explicitly provided
  // Red (0-33%), Yellow (34-66%), Green (67-100%)
  const resolvedColor =
    color ||
    (validScore <= 33
      ? '#EF4444'
      : validScore <= 66
      ? '#F59E0B'
      : '#10B981');

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-in-out"
        />
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <span
          className="font-bold text-[#374151] leading-none"
          style={{ fontSize: size >= 180 ? '36px' : size >= 140 ? '28px' : '20px' }}
        >
          {validScore}%
        </span>
        {sublabel && (
          <span className="text-[11px] font-medium text-[#6B7280] mt-1 leading-tight">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
