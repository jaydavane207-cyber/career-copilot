// frontend/src/components/SkillGap/RoleSelector.jsx
import React from 'react';
import { Target } from 'lucide-react';

export const RoleSelector = ({ roles, selectedRole, onSelectRole }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-slate-900 text-sm">Select Target Role</h3>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Compare your verified skills against industry expectations for top engineering roles.
      </p>

      <select
        value={selectedRole}
        onChange={(e) => onSelectRole(e.target.value)}
        className="w-full text-xs font-medium rounded-lg border border-slate-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
      >
        {roles.map((r) => (
          <option key={r.id || r.title} value={r.title}>
            {r.title} ({r.category || 'Engineering'})
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleSelector;
