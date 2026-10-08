// frontend/src/components/Company/CompanyOverviewPanel.jsx
import React from 'react';
import {
  Building2,
  MapPin,
  Globe,
  Calendar,
  Users,
  Clock,
  ShieldCheck,
  Star,
  Award,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const CompanyOverviewPanel = ({ company, details, onStartPreparation }) => {
  if (!company) return null;

  const ratings = details?.ratings || {
    overall: 4.3,
    culture: 4.5,
    compensation: 4.2,
    management: 3.8,
    work_life_balance: 3.6
  };

  const cultureValues = details?.culture_values || [];

  const ratingCategories = [
    { label: 'Overall Rating', score: ratings.overall, max: 5 },
    { label: 'Company Culture & Values', score: ratings.culture, max: 5 },
    { label: 'Compensation & Benefits', score: ratings.compensation, max: 5 },
    { label: 'Management & Leadership', score: ratings.management, max: 5 },
    { label: 'Work-Life Balance', score: ratings.work_life_balance, max: 5 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white p-3 border border-gray-200 shadow-xs flex items-center justify-center flex-shrink-0">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {company.name}
                </h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  company.difficulty === 'Hard'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : company.difficulty === 'Medium'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {company.difficulty} Interview Bar
                </span>
                {company.featured && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Top Employer
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {company.headquarters || 'Global Headquarters'}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {company.industry || 'Technology'}
                </span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Globe className="w-4 h-4 text-blue-500" />
                    Official Career Portal
                  </a>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartPreparation}
            className="w-full md:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm flex-shrink-0"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Start Preparation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Company Overview Narrative */}
        <div className="pt-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
            Company Overview
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-4xl">
            {company.description}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gray-400" /> Employee Base
            </span>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {company.employee_count || '10,000+'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" /> Interview Rounds
            </span>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {company.average_interview_rounds || 4} Rounds
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" /> Typical Timeline
            </span>
            <p className="text-lg font-bold text-gray-900 mt-1">
              ~{company.average_interview_duration || 21} Days
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" /> Founded Year
            </span>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {company.founded_year || 'Est.'}
            </p>
          </div>
        </div>
      </div>

      {/* Ratings & Culture Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Employee Ratings Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              Employee Reviews & Culture Score
            </h3>
            <span className="text-xs text-gray-400">Aggregated Glassdoor / Blind</span>
          </div>

          <div className="space-y-4">
            {ratingCategories.map((cat) => {
              const percentage = (cat.score / cat.max) * 100;
              return (
                <div key={cat.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-700">{cat.label}</span>
                    <span className="text-gray-900">{cat.score.toFixed(1)} / {cat.max}.0</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {company.culture_summary && (
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1.5">
              <span className="font-bold block text-blue-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Culture Highlights
              </span>
              <p className="text-gray-700 leading-relaxed">
                {company.culture_summary}
              </p>
            </div>
          )}
        </div>

        {/* Right: Core Values & How They Are Tested */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Core Values & Interview Evaluation
            </h3>
            <span className="text-xs text-gray-400">{cultureValues.length} Principles Tested</span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {cultureValues.map((val) => (
              <div
                key={val.id}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    {val.value}
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    val.importance === 'Critical'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {val.importance}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {val.description}
                </p>
                {val.how_its_tested && (
                  <div className="pt-1.5 text-[11px] text-gray-500 border-t border-gray-200/60 flex items-start gap-1">
                    <span className="font-semibold text-gray-700 flex-shrink-0">How tested:</span>
                    <span className="italic">{val.how_its_tested}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CompanyOverviewPanel;
