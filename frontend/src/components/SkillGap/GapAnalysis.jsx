// frontend/src/components/SkillGap/GapAnalysis.jsx
import React, { useState, useEffect } from 'react';
import RoleSelector from './RoleSelector';
import SkillAssessment from './SkillAssessment';
import ResourceModal from './ResourceModal';
import { skillService } from '../../services/skillService';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { CheckCircle2, XCircle, BookOpen, Sparkles } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';

export const GapAnalysis = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('Fullstack Developer');
  const [catalog, setCatalog] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Resource Modal state
  const [modalSkill, setModalSkill] = useState(null);
  const [resources, setResources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, catalogRes, userSkillsRes] = await Promise.all([
        skillService.getRoles(),
        skillService.getCatalog(),
        skillService.getMySkills()
      ]);

      if (rolesRes.success) setRoles(rolesRes.roles || []);
      if (catalogRes.success) setCatalog(catalogRes.skills || []);
      if (userSkillsRes.success) setUserSkills(userSkillsRes.skills || []);

      const gapRes = await skillService.getGapAnalysis(selectedRole);
      if (gapRes.success) setGapData(gapRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (roleName) => {
    setSelectedRole(roleName);
    try {
      const gapRes = await skillService.getGapAnalysis(roleName);
      if (gapRes.success) setGapData(gapRes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSkill = async (skillData) => {
    await skillService.assessSkill(skillData);
    const userSkillsRes = await skillService.getMySkills();
    if (userSkillsRes.success) setUserSkills(userSkillsRes.skills);
    const gapRes = await skillService.getGapAnalysis(selectedRole);
    if (gapRes.success) setGapData(gapRes);
  };

  const handleOpenResources = async (skillName) => {
    setModalSkill(skillName);
    try {
      const res = await skillService.getResources(skillName);
      setResources(res.resources || []);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Calculating skill gap analysis..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Skill Gap & Roadmap Matrix</h2>
        <p className="text-xs text-slate-500">Benchmark your skills against standard industry roles and access curated learning paths.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <RoleSelector
            roles={roles}
            selectedRole={selectedRole}
            onSelectRole={handleRoleChange}
          />
          <SkillAssessment
            catalog={catalog}
            onSaveSkill={handleSaveSkill}
            userSkills={userSkills}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {gapData && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Header with coverage */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Target Match</span>
                  <h3 className="text-xl font-bold text-slate-900">{gapData.role}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{gapData.description}</p>
                </div>

                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 text-indigo-900 flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <div>
                    <span className="text-2xl font-black">{formatPercentage(gapData.coveragePercentage)}</span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600">Coverage</span>
                  </div>
                </div>
              </div>

              {/* Mastered vs Missing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mastered */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Mastered Competencies ({gapData.masteredSkills?.length || 0})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {gapData.masteredSkills && gapData.masteredSkills.length > 0 ? (
                      gapData.masteredSkills.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60 text-xs">
                          <span className="font-semibold text-slate-800">{s.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            {s.proficiency}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No role skills matched yet.</p>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Target Gaps to Learn ({gapData.missingSkills?.length || 0})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {gapData.missingSkills && gapData.missingSkills.length > 0 ? (
                      gapData.missingSkills.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-rose-100 text-xs">
                          <span className="font-semibold text-slate-800">{s.name}</span>
                          <button
                            onClick={() => handleOpenResources(s.name)}
                            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded"
                          >
                            <BookOpen className="w-3 h-3" />
                            Resources
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-emerald-600 font-semibold">100% Core Requirements Satisfied!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skillName={modalSkill}
        resources={resources}
      />
    </div>
  );
};

export default GapAnalysis;
