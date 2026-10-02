// frontend/src/components/SkillGap/SkillAssessment.jsx
import React, { useState } from 'react';
import { Plus, Check, Award } from 'lucide-react';

export const SkillAssessment = ({ catalog, onSaveSkill, userSkills }) => {
  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [years, setYears] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillName) return;

    try {
      setIsSubmitting(true);
      await onSaveSkill({
        skillName,
        proficiency,
        yearsOfExperience: parseFloat(years)
      });
      setSkillName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-slate-900 text-sm">Log Your Tech Competencies</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Select or Enter Skill</label>
          <input
            type="text"
            list="skills-options"
            required
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="e.g. React, PostgreSQL, Docker"
            className="input-field"
          />
          <datalist id="skills-options">
            {catalog && catalog.map((s, idx) => (
              <option key={idx} value={s.name} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Proficiency</label>
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="input-field"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Years Experience</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !skillName}
          className="w-full btn-primary text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          {isSubmitting ? 'Saving...' : 'Add / Update Skill'}
        </button>
      </form>

      {/* User skills chips */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Your Logged Skills ({userSkills?.length || 0})
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
          {userSkills && userSkills.length > 0 ? (
            userSkills.map((s) => (
              <span
                key={s.id || s.skillName}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-indigo-500" />
                {s.skillName}
                <span className="text-[10px] text-indigo-400 font-normal">({s.proficiency})</span>
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">No skills logged yet.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillAssessment;
