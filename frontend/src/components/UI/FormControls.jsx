// frontend/src/components/UI/FormControls.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Label Component
 */
export const Label = ({ children, required = false, className = '', htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className={`block text-[14px] font-semibold text-[#374151] mb-[8px] select-none ${className}`}
  >
    {children}
    {required && <span className="text-[#EF4444] ml-1">*</span>}
  </label>
);

/**
 * Input Component
 */
export const Input = React.forwardRef(
  ({ label, error, required, className = '', id, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
        )}
        <input
          id={id}
          ref={ref}
          disabled={disabled}
          className={`
            w-full px-[16px] py-[12px] rounded-[8px] border bg-white text-[#374151] placeholder-[#9CA3AF] text-[14px]
            transition-all duration-200 outline-none
            ${
              error
                ? 'border-[#EF4444] bg-[#FEF2F2] focus:border-[#EF4444] focus:ring-[3px] focus:ring-[#EF4444]/10'
                : 'border-[#E5E7EB] focus:border-[#3B82F6] focus:border-[2px] focus:ring-[3px] focus:ring-[#3B82F6]/10'
            }
            ${disabled ? 'bg-[#F3F4F6] opacity-60 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-[12px] text-[#EF4444] mt-1.5">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

/**
 * Textarea Component
 */
export const Textarea = React.forwardRef(
  ({ label, error, required, className = '', id, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
        )}
        <textarea
          id={id}
          ref={ref}
          disabled={disabled}
          className={`
            w-full px-[16px] py-[12px] rounded-[8px] border bg-white text-[#374151] placeholder-[#9CA3AF] text-[14px]
            transition-all duration-200 outline-none resize-y min-h-[100px]
            ${
              error
                ? 'border-[#EF4444] bg-[#FEF2F2] focus:border-[#EF4444] focus:ring-[3px] focus:ring-[#EF4444]/10'
                : 'border-[#E5E7EB] focus:border-[#3B82F6] focus:border-[2px] focus:ring-[3px] focus:ring-[#3B82F6]/10'
            }
            ${disabled ? 'bg-[#F3F4F6] opacity-60 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-[12px] text-[#EF4444] mt-1.5">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

/**
 * Select Component
 */
export const Select = React.forwardRef(
  ({ label, error, required, children, className = '', id, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            disabled={disabled}
            className={`
              w-full appearance-none px-[16px] py-[12px] pr-10 rounded-[8px] border bg-white text-[#374151] text-[14px]
              transition-all duration-200 outline-none
              ${
                error
                  ? 'border-[#EF4444] bg-[#FEF2F2] focus:border-[#EF4444] focus:ring-[3px] focus:ring-[#EF4444]/10'
                  : 'border-[#E5E7EB] focus:border-[#3B82F6] focus:border-[2px] focus:ring-[3px] focus:ring-[#3B82F6]/10'
              }
              ${disabled ? 'bg-[#F3F4F6] opacity-60 cursor-not-allowed' : ''}
              ${className}
            `}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6B7280]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-[12px] text-[#EF4444] mt-1.5">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

/**
 * Checkbox Component
 */
export const Checkbox = ({ label, id, checked, onChange, disabled, className = '', ...props }) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none text-[14px] text-[#374151] ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      } ${className}`}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-[20px] h-[20px] rounded-[4px] border-[2px] border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6] transition-colors cursor-pointer accent-[#3B82F6]"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

/**
 * Radio Component
 */
export const Radio = ({ label, id, name, value, checked, onChange, disabled, className = '', ...props }) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none text-[14px] text-[#374151] ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      } ${className}`}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-[20px] h-[20px] rounded-full border-[2px] border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6] transition-colors cursor-pointer accent-[#3B82F6]"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

/**
 * Toggle Switch Component
 * Width: 48px, Height: 28px, Radius: 14px, Off: #E5E7EB, On: #10B981, Thumb: 24px × 24px
 */
export const ToggleSwitch = ({ checked, onChange, label, disabled, id }) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-[48px] h-[28px] rounded-[14px] transition-colors duration-200 ${
            checked ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'
          }`}
        />
        <div
          className={`absolute top-[2px] left-[2px] w-[24px] h-[24px] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform duration-200 ${
            checked ? 'translate-x-[20px]' : 'translate-x-0'
          }`}
        />
      </div>
      {label && <span className="text-[14px] font-medium text-[#374151]">{label}</span>}
    </label>
  );
};
