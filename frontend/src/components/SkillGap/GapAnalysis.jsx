// frontend/src/components/SkillGap/GapAnalysis.jsx
import React, { useState, useEffect } from 'react';
import {
  Target,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  Search,
  BookOpen
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { skillService } from '../../services/skillService';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../UI/Table';
import ResourceModal from './ResourceModal';

export const GapAnalysis = () => {
  // Step 1: Select Role | Step 2: Assess Skills | Step 3: Gap Analysis
  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedRoleTitle, setSelectedRoleTitle] = useState('Frontend Developer');
  const [searchQuery, setSearchQuery] = useState('');

  // Step 2 Assessment state
  const [skillsToAssess, setSkillsToAssess] = useState([]);
  const [userAssessments, setUserAssessments] = useState({});
  const [hasBuiltProjects, setHasBuiltProjects] = useState({});

  // Step 3 Gap Analysis state
  const [analyzedSkills, setAnalyzedSkills] = useState([]);
  const [selectedSkillForModal, setSelectedSkillForModal] = useState(null);
  const [readinessPercentage, setReadinessPercentage] = useState(0);
  const [weeksRemaining, setWeeksRemaining] = useState(6);
  const [loading, setLoading] = useState(false);

  // Fetch 20 roles on mount
  useEffect(() => {
    const fetchBackendRoles = async () => {
      try {
        setLoading(true);
        const res = await skillService.getRoles();
        if (res.success && res.roles && res.roles.length > 0) {
          setRoles(res.roles);
          if (!selectedRoleId) {
            setSelectedRoleId(res.roles[0].id || 'frontend-developer');
            setSelectedRoleTitle(res.roles[0].title);
          }
        }
      } catch (e) {
        console.error('Failed to fetch roles:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBackendRoles();
  }, []);

  const handleRoleSelect = async (role) => {
    const roleId = role.id || role.title;
    setSelectedRoleId(roleId);
    setSelectedRoleTitle(role.title);

    try {
      setLoading(true);
      // Fetch skills for this role
      let skills = role.skills || [];
      if (!skills || skills.length === 0) {
        const skillsRes = await skillService.getRoleSkills(roleId);
        if (skillsRes.success && skillsRes.skills) {
          skills = skillsRes.skills;
        }
      }

      if (skills.length === 0 && role.coreSkills) {
        skills = role.coreSkills.map(s => ({
          skillName: s,
          name: s,
          requiredLevel: 80,
          category: 'Core'
        }));
      }

      setSkillsToAssess(skills);

      // Default ratings
      const initialAssessments = {};
      skills.forEach((s) => {
        const sName = s.skillName || s.name;
        initialAssessments[sName] = 'Intermediate';
      });
      setUserAssessments(initialAssessments);
      setStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (skillName, level) => {
    setUserAssessments((prev) => ({ ...prev, [skillName]: level }));
  };

  const handleProjectToggle = (skillName) => {
    setHasBuiltProjects((prev) => ({ ...prev, [skillName]: !prev[skillName] }));
  };

  const handleRunAnalysis = async () => {
    try {
      setLoading(true);

      const levelScoreMap = {
        "Haven't learned": 10,
        'Beginner': 35,
        'Intermediate': 65,
        'Advanced': 90
      };

      const assessmentData = skillsToAssess.map((s) => {
        const sName = s.skillName || s.name;
        const levelStr = userAssessments[sName] || 'Intermediate';
        let uLevel = levelScoreMap[levelStr] || 50;
        if (hasBuiltProjects[sName]) {
          uLevel = Math.min(100, uLevel + 10);
        }
        return {
          skillName: sName,
          userLevel: uLevel,
          proficiency: levelStr
        };
      });

      // Send to backend POST /api/skills/assess
      await skillService.assessSkills(selectedRoleId, assessmentData);

      // Fetch live gap analysis from backend GET /api/skills/gap/:roleId
      const gapRes = await skillService.getGapAnalysis(selectedRoleId);

      if (gapRes.success && gapRes.skills) {
        setAnalyzedSkills(gapRes.skills);
        setReadinessPercentage(gapRes.readinessPercentage || gapRes.coveragePercentage || 50);
        const weeks = Math.max(2, Math.round((100 - (gapRes.readinessPercentage || 50)) / 8));
        setWeeksRemaining(weeks);
      } else {
        // Fallback local calculations
        const calculated = assessmentData.map((s) => {
          const req = 75;
          const gap = Math.max(0, req - s.userLevel);
          return {
            name: s.skillName,
            skillName: s.skillName,
            userScore: s.userLevel,
            requiredScore: req,
            gap,
            status: gap > 50 ? 'Critical' : gap >= 25 ? 'Medium' : 'Good'
          };
        });
        calculated.sort((a, b) => b.gap - a.gap);
        setAnalyzedSkills(calculated);
      }

      setStep(3);
    } catch (e) {
      console.error('Analysis error:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare chart data for Recharts BarChart
  const chartData = analyzedSkills.slice(0, 10).map((s) => ({
    name: (s.skillName || s.name || '').slice(0, 14),
    fullName: s.skillName || s.name,
    'Your Level': s.userScore !== undefined ? s.userScore : (s.userLevel || 0),
    'Required Level': s.requiredScore !== undefined ? s.requiredScore : (s.requiredLevel || 75)
  }));

  if (loading && roles.length === 0) {
    return <LoadingSpinner message="Loading Skill Gap Finder..." />;
  }

  return (
    <div className="space-y-6">
      {/* Workflow Step Indicators */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-[32px] leading-[40px] font-bold text-[#111827] tracking-[-0.5px]">
            {step === 1
              ? 'Find Your Skill Gaps'
              : step === 2
              ? `Assess Your Skills for ${selectedRoleTitle}`
              : `Skill Gap Analysis for ${selectedRoleTitle}`}
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-1">
            {step === 1
              ? 'Choose from 20 target tech roles to identify your gap against market expectations'
              : step === 2
              ? `Rate your proficiency in key curriculum skills (${skillsToAssess.length} skills)`
              : `Comprehensive roadmap with Recharts gap visualizer and curated learning pathways`}
          </p>
        </div>

        {/* Step pill */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[#3B82F6] bg-[#EBF5FF] px-3 py-1.5 rounded-[12px]">
            Step {step} of 3
          </span>
        </div>
      </div>

      {/* STEP 1: Select Role */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Controls: Search & Dropdown selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search across 20 industry roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[14px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-3">
              <span className="text-[13px] text-[#6B7280] whitespace-nowrap">Quick select:</span>
              <select
                value={selectedRoleId}
                onChange={(e) => {
                  const match = roles.find((r) => r.id === e.target.value || r.title === e.target.value);
                  if (match) handleRoleSelect(match);
                }}
                className="input-field py-2"
              >
                {roles.map((r) => (
                  <option key={r.id || r.title} value={r.id || r.title}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid of 20 role cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            {filteredRoles.map((role) => (
              <div
                key={role.id || role.title}
                onClick={() => handleRoleSelect(role)}
                className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-[2px] transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-[48px] h-[48px] rounded-[10px] bg-[#EBF5FF] text-[#3B82F6] flex items-center justify-center mb-4 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
                    <Target className="w-[32px] h-[32px]" />
                  </div>

                  <h3 className="text-[14px] font-bold text-[#374151] group-hover:text-[#3B82F6] transition-colors leading-snug">
                    {role.title}
                  </h3>

                  <p className="text-[12px] text-[#6B7280] mt-1.5 leading-relaxed line-clamp-2">
                    {role.description || role.desc || 'Comprehensive industry curriculum and benchmark skills'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#10B981]">
                    {role.salaryRange || role.salary || 'Competitive'}
                  </span>
                  <span className="text-[12px] font-semibold text-[#3B82F6] group-hover:underline">
                    Assess &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Assess Skills */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-[12px] border border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-[#6B7280]">Target Role:</span>
              <span className="text-[14px] font-bold text-[#111827]">{selectedRoleTitle}</span>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[13px] font-semibold text-[#3B82F6] hover:underline"
            >
              Change Role
            </button>
          </div>

          {/* Grid of skill cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            {skillsToAssess.map((skill) => {
              const sName = skill.skillName || skill.name;
              const currentLevel = userAssessments[sName] || 'Intermediate';

              return (
                <div
                  key={sName}
                  className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-[14px] font-bold text-[#374151]">
                        {sName}
                      </h4>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EBF5FF] text-[#3B82F6]">
                        Benchmark: {skill.requiredLevel || 75}%
                      </span>
                    </div>

                    <p className="text-[12px] text-[#6B7280] mt-0.5">
                      {skill.category || 'General'}
                    </p>
                  </div>

                  {/* 4 radio options */}
                  <div className="grid grid-cols-2 gap-2 text-[13px]">
                    {["Haven't learned", 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <label
                        key={lvl}
                        className={`flex items-center gap-2 p-2.5 rounded-[8px] border cursor-pointer transition-all ${
                          currentLevel === lvl
                            ? 'border-[#3B82F6] bg-[#EBF5FF] text-[#1E40AF] font-semibold'
                            : 'border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151]'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`skill-${sName}`}
                          value={lvl}
                          checked={currentLevel === lvl}
                          onChange={() => handleLevelChange(sName, lvl)}
                          className="w-4 h-4 text-[#3B82F6] accent-[#3B82F6]"
                        />
                        <span>{lvl}</span>
                      </label>
                    ))}
                  </div>

                  <label className="flex items-center gap-2 text-[13px] text-[#374151] cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={Boolean(hasBuiltProjects[sName])}
                      onChange={() => handleProjectToggle(sName)}
                      className="w-4 h-4 rounded text-[#3B82F6] accent-[#3B82F6]"
                    />
                    <span>Have built real-world projects with this (+10% proficiency)</span>
                  </label>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
            <Button variant="secondary" onClick={() => setStep(1)} icon={ArrowLeft}>
              Go Back
            </Button>
            <Button variant="primary" onClick={handleRunAnalysis} loading={loading} icon={Sparkles}>
              Analyze Gaps & Save
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Gap Analysis */}
      {step === 3 && (
        <div className="space-y-8">
          {/* Progress Header Badge */}
          <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white p-6 rounded-[12px] shadow-[0_4px_12px_rgba(59,130,246,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-blue-100">
                Overall Role Competency
              </span>
              <h2 className="text-[28px] font-bold text-white mt-0.5">
                You're {readinessPercentage}% ready for {selectedRoleTitle}
              </h2>
              <p className="text-[14px] text-blue-100 mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Estimated ~{weeksRemaining} weeks of dedicated prep to bridge all critical gaps.</span>
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={() => setStep(2)}
              className="bg-white text-[#2563EB] hover:bg-blue-50 border-transparent font-bold flex-shrink-0"
            >
              Re-assess Skills
            </Button>
          </div>

          {/* Section 1: Visual Comparison using Recharts BarChart */}
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px]">
                Skill Comparison Chart
              </h2>
              <div className="text-[12px] text-[#6B7280]">
                Comparing your assessed proficiency vs benchmark target
              </div>
            </div>

            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} angle={-25} textAnchor="end" />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <Tooltip
                    formatter={(val) => [`${val}%`, '']}
                    labelFormatter={(name, payload) => payload?.[0]?.payload?.fullName || name}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  {/* Blue bar: user level */}
                  <Bar dataKey="Your Level" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  {/* Green bar: required level */}
                  <Bar dataKey="Required Level" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section 2: Detailed Skills Table Sorted by Gap */}
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-4">
            <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px]">
              Detailed Skills Breakdown (Sorted by Gap)
            </h2>

            <Table>
              <TableHeader>
                <TableHead>Skill</TableHead>
                <TableHead>Your Level</TableHead>
                <TableHead>Required Level</TableHead>
                <TableHead>Skill Gap</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="right">Resources</TableHead>
              </TableHeader>
              <TableBody>
                {analyzedSkills.map((s) => {
                  const sName = s.skillName || s.name;
                  const uLevel = s.userScore !== undefined ? s.userScore : (s.userLevel || 0);
                  const rLevel = s.requiredScore !== undefined ? s.requiredScore : (s.requiredLevel || 75);
                  const gap = s.gap !== undefined ? s.gap : Math.max(0, rLevel - uLevel);

                  const statusClass =
                    gap > 50
                      ? 'bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/30'
                      : gap >= 25
                      ? 'bg-[#FEF3C7] text-[#B45309] border-[#F59E0B]/30'
                      : 'bg-[#D1FAE5] text-[#065F46] border-[#10B981]/30';

                  const statusLabel = gap > 50 ? 'Critical' : gap >= 25 ? 'Medium' : 'Good';

                  return (
                    <TableRow key={sName}>
                      <TableCell className="font-bold text-[#374151]">{sName}</TableCell>
                      <TableCell>{uLevel}%</TableCell>
                      <TableCell>{rLevel}%</TableCell>
                      <TableCell className="font-bold text-[#EF4444]">
                        {gap > 0 ? `-${gap}%` : '0%'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 rounded-[12px] text-[11px] font-bold border ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <button
                          type="button"
                          onClick={() => setSelectedSkillForModal(sName)}
                          className="px-3 py-1.5 rounded-[8px] bg-[#EBF5FF] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white text-[12px] font-semibold transition-all inline-flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Learn This</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Learning Resource Modal */}
      <ResourceModal
        isOpen={Boolean(selectedSkillForModal)}
        onClose={() => setSelectedSkillForModal(null)}
        skillName={selectedSkillForModal}
      />
    </div>
  );
};

export default GapAnalysis;
