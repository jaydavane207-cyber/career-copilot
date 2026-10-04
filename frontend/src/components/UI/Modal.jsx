// frontend/src/components/UI/Modal.jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Design System Modal Component
 * Overlay: rgba(0,0,0,0.5), Bg: White, Radius: 12px, Padding: 32px
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'small', // 'small' (500px), 'medium' (700px), 'large' (900px)
  className = ''
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-[500px]',
    medium: 'max-w-[700px]',
    large: 'max-w-[900px]'
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`
          bg-white w-full ${sizeClasses[size] || 'max-w-[500px]'} min-w-[300px] rounded-[12px] 
          p-[32px] shadow-2xl border border-[#E5E7EB] relative animate-scale-up ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E5E7EB] mb-6">
          <h2 className="text-[24px] font-bold text-[#374151] leading-[32px] tracking-[-0.5px]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-[#6B7280] hover:text-[#374151] p-1.5 rounded-[8px] hover:bg-[#F3F4F6] transition-colors -mr-2 -mt-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="text-[#374151] text-[14px]">{children}</div>

        {/* Footer (Right-aligned buttons) */}
        {footer && (
          <div className="mt-8 pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
