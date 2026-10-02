// frontend/src/components/Resume/AnalysisResults.jsx
import React from 'react';
import { CheckCircle2, XCircle, Lightbulb, Award } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';

export const AnalysisResults = ({ resume }) => {
  if (!resume) return null;

  const atsScore = resume.atsScore || 0;
  const scoreColor = atsScore >= 75 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : atsScore >= 50 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-rose-600 bg-rose-50 border-rose-200';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">ATS Score Breakdown</span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">{resume.targetRole || 'Fullstack Developer'}</h3>
          <p className="text-xs text-slate-500">File: {resume.originalName}</p>
        </div>

        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${scoreColor}`}>
          <Award className="w-6 h-6 flex-shrink-0" />
          <div className="text-right">
            <span className="text-2xl font-black">{formatPercentage(atsScore)}</span>
            <span className="block text-[10px] uppercase font-bold tracking-wider opacity-75">ATS Match</span>
          </div>
        </div>
      </div>

      {/* Keywords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched Keywords */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Matched Keywords ({resume.matchedKeywords?.length || 0})
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {resume.matchedKeywords && resume.matchedKeywords.length > 0 ? (
              resume.matchedKeywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800">
                  {kw}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No direct keyword matches detected.</p>
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-rose-500" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Missing Target Keywords ({resume.missingKeywords?.length || 0})
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {resume.missingKeywords && resume.missingKeywords.length > 0 ? (
              resume.missingKeywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                  {kw}
                </span>
              ))
            ) : (
              <p className="text-xs text-emerald-600 font-medium">All essential core skills matched!</p>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {resume.suggestions && resume.suggestions.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
          <div className="flex items-center gap-2 mb-2 text-amber-800">
            <Lightbulb className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Recommended Enhancements</h4>
          </div>
          <ul className="space-y-1.5 text-xs text-amber-900">
            {resume.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
