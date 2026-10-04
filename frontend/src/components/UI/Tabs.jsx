// frontend/src/components/UI/Tabs.jsx
import React from 'react';

/**
 * Tabs Component
 * Height: 44px, Font: 14px Semi-bold, Text: #6B7280, Active: #3B82F6 with 3px border-bottom
 */
export const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-[24px] border-b border-[#E5E7EB] overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`
              h-[44px] px-2 flex items-center gap-2 text-[14px] font-semibold transition-all whitespace-nowrap
              hover:bg-[#F3F4F6] rounded-t-[6px] relative
              ${isActive ? 'text-[#3B82F6] border-b-[3px] border-[#3B82F6] -mb-[1px]' : 'text-[#6B7280]'}
            `}
          >
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive ? 'bg-[#EBF5FF] text-[#3B82F6]' : 'bg-[#F3F4F6] text-[#6B7280]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
