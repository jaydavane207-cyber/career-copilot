// frontend/src/components/UI/Toast.jsx
import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

/**
 * Design System Toast Notification
 * Success, Error, Info with border-left 4px, slide-in 200ms ease-out, bottom-right 16px
 */
export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const type = toast.type || 'info';

  const typeStyles = {
    success: {
      bg: 'bg-[#D1FAE5]',
      text: 'text-[#065F46]',
      borderLeft: 'border-l-[4px] border-l-[#10B981]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
    },
    error: {
      bg: 'bg-[#FEE2E2]',
      text: 'text-[#7F1D1D]',
      borderLeft: 'border-l-[4px] border-l-[#EF4444]',
      icon: <XCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
    },
    info: {
      bg: 'bg-[#DBEAFE]',
      text: 'text-[#1E40AF]',
      borderLeft: 'border-l-[4px] border-l-[#3B82F6]',
      icon: <Info className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />
    }
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div className="fixed bottom-[16px] right-[16px] z-50 max-w-[400px] w-full animate-slide-in">
      <div
        className={`flex items-start gap-3 p-[16px_20px] rounded-[8px] shadow-lg border border-[#E5E7EB] ${style.bg} ${style.borderLeft} ${style.text}`}
      >
        {style.icon}
        <p className="text-[14px] font-medium leading-[20px] flex-1">
          {toast.message}
        </p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="opacity-70 hover:opacity-100 transition-opacity p-0.5 -mr-1 -mt-1"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
