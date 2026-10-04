// frontend/src/components/Common/ErrorMessage.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="rounded-[8px] bg-[#FEF2F2] border border-[#EF4444]/30 p-4 flex items-start gap-3 my-3">
      <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-[14px] font-medium text-[#7F1D1D]">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-[12px] font-semibold text-[#3B82F6] hover:underline"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

