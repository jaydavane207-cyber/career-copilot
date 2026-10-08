// frontend/src/components/JobTracker/SkillRecommendations.jsx
import React from 'react';
import { BookOpen, ExternalLink, Plus, Flame, Clock, Award, Check } from 'lucide-react';

/**
 * SkillRecommendations Component
 * Renders prioritized skill cards with estimated learning hours,
 * resource recommendations, and interactive action buttons.
 */
export const SkillRecommendations = ({
  criticalSkills = [],
  importantSkills = [],
  onAddToStudyPlan
}) => {
  const hasSkills = criticalSkills.length > 0 || importantSkills.length > 0;

  if (!hasSkills) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
        <p className="text-xs font-semibold text-emerald-800">
          No critical skill preparation needed! Your profile strongly covers this role's tech stack.
        </p>
      </div>
    );
  }

  const renderSkillCard = (item, isCritical = false) => {
    const skillName = item.skill || item.name;
    const hours = item.estimatedHours || (isCritical ? 35 : 20);
    const priority = item.priority || (isCritical ? 'HIGH' : 'MEDIUM');

    return (
      <div
        key={skillName}
        className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:border-blue-300 transition-all"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs font-bold text-gray-900">{skillName}</h5>
            <span
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                priority === 'HIGH'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {priority} Priority
            </span>
          </div>

          <p className="text-[11px] text-gray-600 mb-2">
            Estimated time to master for interview: <span className="font-bold text-gray-800">{hours} hours</span>
          </p>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 mb-3">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Curated Resource:
            </span>
            <a
              href={`https://roadmap.sh/${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 flex-shrink-0" />
              <span>{skillName} Mastery Roadmap & Core Concepts</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
          <a
            href={`https://github.com/topics/${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors inline-flex items-center justify-center gap-1"
          >
            <span>Documentation</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {onAddToStudyPlan && (
            <button
              type="button"
              onClick={() => onAddToStudyPlan(skillName)}
              className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors inline-flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add to Plan</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Critical Skills */}
      {criticalSkills.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-600" />
              Critical Skills (High Priority)
            </h5>
            <span className="text-[11px] font-semibold text-rose-600">
              Must-haves for technical screening
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {criticalSkills.map(item => renderSkillCard(item, true))}
          </div>
        </div>
      )}

      {/* Important Skills */}
      {importantSkills.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Important Skills (Medium Priority)
            </h5>
            <span className="text-[11px] font-semibold text-amber-600">
              Preferred skills that give an edge
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {importantSkills.map(item => renderSkillCard(item, false))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillRecommendations;
