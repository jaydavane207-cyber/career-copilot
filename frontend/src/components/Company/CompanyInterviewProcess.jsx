// frontend/src/components/Company/CompanyInterviewProcess.jsx
import React, { useState, useEffect } from 'react';
import {
  Clock,
  UserCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Briefcase,
  ChevronRight,
  TrendingDown,
  Layers,
  Code,
  Users
} from 'lucide-react';
import companyService from '../../services/companyService';

export const CompanyInterviewProcess = ({ company, initialRole = 'Senior Software Engineer' }) => {
  const [role, setRole] = useState(initialRole);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const availableRoles = [
    'Senior Software Engineer',
    'SDE',
    'Frontend Engineer',
    'Product Manager',
    'Data Scientist'
  ];

  useEffect(() => {
    if (company?.id) {
      loadProcess();
    }
  }, [company?.id, role]);

  const loadProcess = async () => {
    try {
      setLoading(true);
      const res = await companyService.getInterviewProcess(company.id, role);
      if (res.rounds) {
        setRounds(res.rounds);
      }
    } catch (err) {
      console.error('Failed to load interview process:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoundIcon = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.includes('system design') || lower.includes('architecture')) return Layers;
    if (lower.includes('coding') || lower.includes('technical') || lower.includes('phone') || lower.includes('oa')) return Code;
    if (lower.includes('behavioral') || lower.includes('recruiter') || lower.includes('leadership') || lower.includes('values')) return Users;
    return Briefcase;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Role Switcher */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Interview Process for {company?.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Round-by-round breakdown, focus criteria, and insider elimination hurdles
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Target Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-900 text-xs sm:text-sm font-semibold rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            {availableRoles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Rounds Timeline */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading interview process breakdown...</p>
        </div>
      ) : rounds.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-2 text-gray-500">
          <HelpCircle className="w-8 h-8 mx-auto text-gray-400" />
          <p className="font-semibold text-sm">No specific process roadmap recorded for {role}</p>
          <p className="text-xs text-gray-400">Showing standard technical track for {company?.name}.</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:inset-0 before:left-[19px] sm:before:left-[27px] before:w-0.5 before:bg-blue-100">
          {rounds.map((round, index) => {
            const Icon = getRoundIcon(round.round_name || round.roundName);
            const focusAreas = round.focus_areas || round.focusAreas || [];
            const tips = round.tips || [];
            const rejection = round.rejection_rate || round.rejectionRate || 30;

            return (
              <div key={round.id || index} className="relative group">
                
                {/* Timeline Node Icon */}
                <div className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 border-4 border-white shadow-xs text-white flex items-center justify-center font-bold text-xs">
                  {round.round_number || index + 1}
                </div>

                {/* Round Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-blue-200 hover:shadow-sm transition-all space-y-4">
                  
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
                          Stage {round.round_number || index + 1}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          {round.round_name || round.roundName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {round.duration_minutes || round.durationMinutes || 45} mins
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                        {round.interviewer_count || round.interviewerCount || 1} Interviewer
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 border ${
                        rejection >= 45
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : rejection >= 30
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        <TrendingDown className="w-3.5 h-3.5" />
                        ~{rejection}% Rejection Rate
                      </span>
                    </div>
                  </div>

                  {/* Focus Criteria */}
                  {focusAreas.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        What They Evaluate:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {focusAreas.map((area, aIdx) => (
                          <span
                            key={aIdx}
                            className="px-3 py-1 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-800 text-xs font-medium flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3 h-3 text-blue-500" />
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insider Tips */}
                  {tips.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
                      <span className="font-bold flex items-center gap-1.5 text-amber-800 text-[11px] uppercase tracking-wide">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        Insider Strategy & Tips:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 pl-1">
                        {tips.map((tip, tIdx) => (
                          <li key={tIdx} className="leading-relaxed">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default CompanyInterviewProcess;
