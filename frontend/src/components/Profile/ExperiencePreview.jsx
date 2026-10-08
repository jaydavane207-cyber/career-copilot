// frontend/src/components/Profile/ExperiencePreview.jsx
import React from 'react';
import { Briefcase, Calendar, MapPin, Trash2, Edit3, CheckCircle2 } from 'lucide-react';

/**
 * LinkedIn Brand SVG Icon
 */
export const LinkedInIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

/**
 * ExperiencePreview Component
 * Displays imported or created work experience records in cards
 */
export const ExperiencePreview = ({ experiences = [], onEdit, onDelete }) => {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-600">No work experience added yet</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Import from LinkedIn or add manually to populate your professional history.
        </p>
      </div>
    );
  }

  const formatDate = (dateObj) => {
    if (!dateObj) return '';
    if (typeof dateObj === 'string') return dateObj;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthStr = dateObj.month ? months[dateObj.month - 1] : '';
    return `${monthStr} ${dateObj.year}`.trim();
  };

  return (
    <div className="space-y-3">
      {experiences.map((exp, idx) => {
        const startStr = formatDate(exp.startDate);
        const endStr = exp.isCurrent ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : 'Present');
        const dateRange = startStr ? `${startStr} - ${endStr}` : (exp.duration || '');

        return (
          <div
            key={exp.id || idx}
            className="p-4 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 transition-all shadow-xs relative group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Company Logo / Icon */}
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {exp.companyLogo ? (
                    <img
                      src={exp.companyLogo}
                      alt={exp.companyName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Briefcase className="w-5 h-5 text-slate-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {exp.title}
                    </h4>
                    <span className="text-xs font-semibold text-indigo-600">
                      @ {exp.companyName}
                    </span>
                    {exp.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                    {dateRange && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dateRange}</span>
                        {exp.duration && !dateRange.includes(exp.duration) && (
                          <span className="text-slate-400">({exp.duration})</span>
                        )}
                      </span>
                    )}
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{exp.location}</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {/* Imported from LinkedIn Badge */}
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-[#0A66C2]">
                    <LinkedInIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
                    <span>Imported from LinkedIn</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    onClick={() => onEdit(exp, idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Edit experience"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove experience"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExperiencePreview;
