// frontend/src/components/UI/Button.jsx
import React from 'react';
import Spinner from './Spinner';

/**
 * Design System Button Component
 * Supports: primary, secondary, danger, text, icon
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses =
    'font-semibold rounded-[8px] transition-all duration-200 inline-flex items-center justify-center gap-2 select-none';

  const variantClasses = {
    primary:
      'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_rgba(59,130,246,0.2)] active:scale-[0.98] min-w-[120px]',
    secondary:
      'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] border border-[#E5E7EB] active:scale-[0.98]',
    danger:
      'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98]',
    text:
      'bg-transparent hover:bg-[#EBF5FF] text-[#3B82F6]',
    icon:
      'w-[40px] h-[40px] p-0 bg-transparent hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#374151]'
  };

  const sizeClasses = {
    sm: variant === 'icon' ? 'w-[32px] h-[32px]' : 'px-3 py-1.5 text-[12px]',
    md: variant === 'icon' ? 'w-[40px] h-[40px]' : 'px-[24px] py-[10px] text-[14px]',
    lg: variant === 'icon' ? 'w-[48px] h-[48px]' : 'px-[32px] py-[12px] text-[16px]',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant] || variantClasses.primary}
        ${variant !== 'icon' ? sizeClasses[size] : sizeClasses[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" className="text-current" />
      ) : (
        Icon && <Icon className={variant === 'icon' ? 'w-5 h-5' : 'w-4 h-4'} />
      )}
      {variant !== 'icon' && children}
    </button>
  );
};

export default Button;
