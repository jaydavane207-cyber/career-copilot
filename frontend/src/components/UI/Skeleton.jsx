// frontend/src/components/UI/Skeleton.jsx
import React from 'react';

/**
 * Skeleton Loader Component
 * Background: #F3F4F6, Border Radius: 8px, Pulse animation
 */
export const Skeleton = ({ className = '', variant = 'rect', width, height }) => {
  const baseStyle = {
    width: width || undefined,
    height: height || undefined,
  };

  const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-[8px]';

  return (
    <div
      style={baseStyle}
      className={`bg-[#F3F4F6] animate-pulse ${variantClass} ${className}`}
    />
  );
};

export default Skeleton;
