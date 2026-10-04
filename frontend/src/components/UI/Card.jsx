// frontend/src/components/UI/Card.jsx
import React from 'react';

/**
 * Design System Card Component
 * Background: #FFFFFF, Border: 1px solid #E5E7EB, Radius: 12px, Padding: 24px
 */
export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] 
        shadow-[0_1px_3px_rgba(0,0,0,0.1)] 
        ${hoverEffect ? 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-[2px]' : ''}
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
