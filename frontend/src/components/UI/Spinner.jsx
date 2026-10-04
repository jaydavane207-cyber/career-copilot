// frontend/src/components/UI/Spinner.jsx
import React from 'react';

/**
 * Loading Spinner Component
 * Size: 40px × 40px (default), 3px stroke, #3B82F6, 360° rotation 1s linear
 */
export const Spinner = ({ size = 'md', className = '', label = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const currentSize = sizeMap[size] || (typeof size === 'number' ? `w-[${size}px] h-[${size}px]` : sizeMap.md);

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <svg
        className={`animate-spin text-[#3B82F6] ${currentSize}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && <span className="text-sm font-medium text-[#6B7280]">{label}</span>}
    </div>
  );
};

export default Spinner;
