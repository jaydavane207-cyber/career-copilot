// frontend/src/components/UI/ErrorState.jsx
import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  onReport,
  className = ''
}) => {
  return (
    <div
      className={`bg-white rounded-[12px] border border-[#EF4444]/20 py-[48px] px-[32px] text-center flex flex-col items-center justify-center shadow-sm ${className}`}
    >
      <div className="w-[64px] h-[64px] rounded-full bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mb-4">
        <AlertCircle className="w-[36px] h-[36px]" />
      </div>
      <h3 className="text-[20px] font-bold text-[#374151] mb-2">{title}</h3>
      <p className="text-[14px] text-[#6B7280] max-w-md mx-auto mb-6">
        {message}
      </p>
      <div className="flex flex-col items-center gap-3">
        {onRetry && (
          <Button variant="primary" onClick={onRetry} icon={RotateCcw}>
            Try Again
          </Button>
        )}
        <button
          type="button"
          onClick={onReport || (() => window.open('mailto:support@careercopilot.io'))}
          className="text-[12px] text-[#6B7280] hover:text-[#3B82F6] underline transition-colors"
        >
          Report an issue
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
