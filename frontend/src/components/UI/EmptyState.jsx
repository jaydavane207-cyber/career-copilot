// frontend/src/components/UI/EmptyState.jsx
import React from 'react';
import { Button } from './Button';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'Get started by creating your first entry.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`bg-[#F9FAFB] rounded-[12px] border border-dashed border-[#E5E7EB] py-[64px] px-[32px] text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="text-[#9CA3AF] mb-4">
        <Icon className="w-[64px] h-[64px]" strokeWidth={1.5} />
      </div>
      <h3 className="text-[18px] font-bold text-[#374151] mb-2">{title}</h3>
      <p className="text-[14px] text-[#6B7280] max-w-md mx-auto mb-6 line-clamp-2">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
