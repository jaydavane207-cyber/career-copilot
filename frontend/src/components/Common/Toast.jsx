// frontend/src/components/Common/Toast.jsx
import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-indigo-500" />
  };

  const borders = {
    success: 'border-emerald-200 bg-white shadow-emerald-50',
    error: 'border-rose-200 bg-white shadow-rose-50',
    info: 'border-indigo-200 bg-white shadow-indigo-50'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${borders[toast.type] || borders.info} min-w-[280px]`}>
        {icons[toast.type] || icons.info}
        <span className="text-sm font-medium text-slate-800 flex-1">{toast.message}</span>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
