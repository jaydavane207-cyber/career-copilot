// frontend/src/components/Company/CompanySuccessStoriesTab.jsx
import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  DollarSign,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import companyService from '../../services/companyService';

export const CompanySuccessStoriesTab = ({ company }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [expandedStoryId, setExpandedStoryId] = useState(null);

  const levels = ['All', 'Senior', 'Mid', 'Junior'];

  useEffect(() => {
    if (company?.id) {
      loadStories();
    }
  }, [company?.id, selectedLevel]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedLevel !== 'All') params.experience_level = selectedLevel;

      const data = await companyService.getSuccessStories(company.id, params);
      if (data.stories) {
        setStories(data.stories);
      }
    } catch (err) {
      console.error('Failed to load success stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedStoryId(expandedStoryId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Interview Success Stories at {company?.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real candidate debriefs, preparation schedules, and tactical tips from people who received offers
          </p>
        </div>

        {/* Experience Level Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-semibold text-gray-400 mr-1">Experience:</span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedLevel === lvl
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading verified candidate success stories...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 text-gray-400 space-y-2">
          <HelpCircle className="w-10 h-10 mx-auto text-gray-300" />
          <p className="text-sm font-semibold text-gray-700">No stories found for this filter</p>
          <p className="text-xs">Select 'All' to view all candidate debriefs.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {stories.map((st) => {
            const isExpanded = expandedStoryId === st.id;
            const prepKeys = st.key_preparation || st.keyPreparation || [];
            const tips = st.tips_for_success || st.tipsForSuccess || [];

            return (
              <div
                key={st.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-gray-300 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-gray-900">{st.role}</h3>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {st.experience_level || st.experienceLevel} Level ({st.years_experience || st.yearsExperience} yrs exp)
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Loop duration: ~{st.interview_duration || st.interviewDuration} days • {st.interview_rounds || st.interviewRounds} rounds
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Offer Accepted
                    </span>
                    {st.salary_negotiated && (
                      <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-800 font-bold text-xs">
                        ${st.salary_negotiated.toLocaleString()} Negotiated
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Preparation Focus Badges */}
                {prepKeys.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-gray-400 font-medium">Preparation Pillars:</span>
                    {prepKeys.map((k, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-gray-50 text-gray-700 font-semibold border border-gray-200">
                        {k}
                      </span>
                    ))}
                  </div>
                )}

                {/* Journey narrative */}
                <div className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50/60 p-4 rounded-xl border border-gray-100">
                  <p>
                    {isExpanded ? st.story : `${st.story?.slice(0, 220)}...`}
                  </p>

                  {st.story?.length > 220 && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(st.id)}
                      className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Show less' : 'Read full journey'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {/* Tactical Tips from the Candidate */}
                {tips.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      Candidate Advice for Acing the Loop:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 pl-1">
                      {tips.map((t, tIdx) => (
                        <li key={tIdx} className="leading-relaxed">{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default CompanySuccessStoriesTab;
