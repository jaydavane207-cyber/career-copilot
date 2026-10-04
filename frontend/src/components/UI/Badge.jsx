// frontend/src/components/UI/Badge.jsx
import React from 'react';
import { X } from 'lucide-react';

/**
 * Small Badge Component
 */
export const Badge = ({
  children,
  variant = 'info', // success, warning, error, info
  className = ''
}) => {
  const variantStyles = {
    success: 'bg-[#D1FAE5] text-[#065F46]',
    warning: 'bg-[#FEF3C7] text-[#B45309]',
    error: 'bg-[#EF4444] text-white',
    info: 'bg-[#3B82F6] text-white',
  };

  return (
    <span
      className={`inline-flex items-center px-[12px] py-[4px] rounded-[12px] text-[12px] font-semibold select-none ${
        variantStyles[variant] || variantStyles.info
      } ${className}`}
    >
      {children}
    </span>
  );
};

/**
 * Pill Tag Component (e.g. for keywords)
 */
export const PillTag = ({ children, onDismiss, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-[#EBF5FF] text-[#3B82F6] px-[12px] py-[6px] rounded-[16px] text-[12px] font-semibold select-none transition-colors ${className}`}
    >
      <span>{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-[#6B7280] hover:text-[#374151] rounded-full p-0.5 hover:bg-[#DBEAFE] transition-colors focus:outline-none"
          title="Remove"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
};

export default Badge;
