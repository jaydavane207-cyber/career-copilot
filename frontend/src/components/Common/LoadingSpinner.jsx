// frontend/src/components/Common/LoadingSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <Loader2 className={`animate-spin text-indigo-600 ${sizeClasses[size] || sizeClasses.md}`} />
      {message && <p className="text-sm text-slate-500 font-medium">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
