// frontend/src/components/UI/Table.jsx
import React from 'react';

/**
 * Table Components
 * Header Row: #F9FAFB, font 12px semi-bold, body rows white, borders 1px #E5E7EB, padding 16px
 */
export const Table = ({ children, className = '' }) => (
  <div className="w-full overflow-x-auto rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
    <table className={`w-full text-left border-collapse ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead>
    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
      {children}
    </tr>
  </thead>
);

export const TableHead = ({ children, className = '', align = 'left' }) => (
  <th
    className={`p-[16px] text-[12px] font-semibold text-[#374151] tracking-wide text-${align} ${className}`}
  >
    {children}
  </th>
);

export const TableBody = ({ children }) => (
  <tbody className="divide-y divide-[#E5E7EB]">
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '', onClick }) => (
  <tr
    onClick={onClick}
    className={`hover:bg-[#F3F4F6] transition-colors duration-150 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, className = '', align = 'left' }) => (
  <td
    className={`p-[16px] text-[14px] text-[#374151] text-${align} ${className}`}
  >
    {children}
  </td>
);
