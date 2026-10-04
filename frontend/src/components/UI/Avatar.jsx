// frontend/src/components/UI/Avatar.jsx
import React from 'react';

/**
 * Avatar Component
 * Deterministic pastel color from name hash, bold white initials, 2px white border, shadow
 */
const PASTEL_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
];

const getHashColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PASTEL_COLORS.length;
  return PASTEL_COLORS[index];
};

export const Avatar = ({ name = 'User', size = 'md', className = '' }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const sizeClasses = {
    sm: 'w-[32px] h-[32px] text-[12px]',
    sidebar: 'w-[40px] h-[40px] text-[14px]',
    md: 'w-[48px] h-[48px] text-[16px]',
    lg: 'w-[64px] h-[64px] text-[20px]'
  };

  const bgColor = getHashColor(name);

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={`
        rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] 
        flex items-center justify-center font-bold text-white select-none flex-shrink-0
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
