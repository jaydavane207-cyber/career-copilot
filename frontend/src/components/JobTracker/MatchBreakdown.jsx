// frontend/src/components/JobTracker/MatchBreakdown.jsx
import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, Sparkles } from 'lucide-react';

/**
 * MatchBreakdown Component
 * Displays a 3-column comparative view of:
 * 1. Strong Matches (Green)
 * 2. Partial Matches (Amber/Orange)
 * 3. Missing Skills (Red)
 */
export const MatchBreakdown = ({ matchAnalysis }) => {
  if (!matchAnalysis) return null;

  const skillMatches = matchAnalysis.skillMatches || {};
  const strongMatches = skillMatches.strong || [];
  const partialMatches = skillMatches.partial || [];
  const missingSkills = skillMatches.missing || [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Skill Match Breakdown
        </h4>
        <span className="text-xs font-semibold text-gray-500">
          {strongMatches.length} of {strongMatches.length + partialMatches.length + missingSkills.length} matches satisfied
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Column 1: Strong Matches */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex flex-col justify-between transition-all hover:shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Strong Matches
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {strongMatches.length}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 mb-2.5">
              Verified in your resume or profile:
            </p>

            {strongMatches.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {strongMatches.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-emerald-800 border border-emerald-200 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-600 italic">No direct strong matches detected yet.</p>
            )}
          </div>
        </div>

        {/* Column 2: Partial Matches */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex flex-col justify-between transition-all hover:shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                Partial Matches
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {partialMatches.length}
              </span>
            </div>
            <p className="text-[11px] text-amber-700 mb-2.5">
              Foundational experience identified:
            </p>

            {partialMatches.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {partialMatches.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-amber-800 border border-amber-200 shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-amber-600/80 italic">No partial gaps identified.</p>
            )}
          </div>
        </div>

        {/* Column 3: Missing Skills */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3.5 flex flex-col justify-between transition-all hover:shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                Missing Skills
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                {missingSkills.length} missing
              </span>
            </div>
            <p className="text-[11px] text-rose-700 mb-2.5">
              Priority areas to prepare before applying:
            </p>

            {missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-rose-800 border border-rose-200 shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-700 font-medium">None! You meet all core requirements 🎉</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchBreakdown;
