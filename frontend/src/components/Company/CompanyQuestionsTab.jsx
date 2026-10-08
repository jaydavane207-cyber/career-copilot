// frontend/src/components/Company/CompanyQuestionsTab.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  Play,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Clock,
  Sparkles,
  Layers,
  Code,
  Users,
  Lightbulb
} from 'lucide-react';
import companyService from '../../services/companyService';

export const CompanyQuestionsTab = ({ company, onPracticeQuestion }) => {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const categories = ['All', 'System Design', 'Behavioral', 'Technical'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const roles = ['All', 'Senior Software Engineer', 'SDE', 'Frontend Engineer', 'Product Manager', 'Data Scientist'];

  useEffect(() => {
    if (company?.id) {
      loadQuestions();
    }
  }, [company?.id, selectedRole, selectedCategory, selectedDifficulty]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedRole !== 'All') params.role = selectedRole;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (searchQuery) params.search = searchQuery;

      const data = await companyService.getCompanyQuestions(company.id, params);
      if (data.questions) {
        setQuestions(data.questions);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (company?.id) loadQuestions();
    }, 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryIcon = (cat = '') => {
    if (cat === 'System Design') return Layers;
    if (cat === 'Behavioral') return Users;
    return Code;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Controls & Category Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              Real Interview Questions Asked at {company?.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Verified from candidate debriefs, LeetCode company tags, and community submissions
            </p>
          </div>

          {/* Role selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs sm:text-sm font-semibold rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-gray-400 font-semibold mr-1">Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  selectedCategory === c
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Difficulty and Search */}
          <div className="flex items-center gap-3 ml-auto w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl py-1.5 px-2.5 focus:outline-none"
            >
              {difficulties.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Fetching company questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 space-y-2 text-gray-400">
          <HelpCircle className="w-10 h-10 mx-auto text-gray-300" />
          <p className="font-semibold text-sm text-gray-700">No questions match your current filters</p>
          <p className="text-xs">Try selecting 'All' for category or difficulty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
            <span>Showing {questions.length} questions</span>
            <span>Sorted by frequency asked at {company?.name}</span>
          </div>

          {questions.map((q) => {
            const isExpanded = expandedId === q.id;
            const Icon = getCategoryIcon(q.category);
            const diffClass = q.difficulty === 'Hard'
              ? 'bg-red-50 text-red-700 border-red-200'
              : q.difficulty === 'Medium'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200';

            const tips = q.tips || [];
            const followUps = q.follow_up_questions || q.followUpQuestions || [];

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:border-gray-300 transition-all overflow-hidden"
              >
                {/* Header row */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" />
                        {q.category}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg border font-semibold ${diffClass}`}>
                        {q.difficulty}
                      </span>
                      <span className="text-gray-400">• {q.role}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Asked ~{q.frequency}x in loops
                      </span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-gray-400" />
                        {q.helpful_count || 12}
                      </span>
                    </div>
                  </div>

                  {/* Question Title */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                    {q.question}
                  </h3>

                  {/* Action buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => toggleExpand(q.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                    >
                      <span>{isExpanded ? 'Hide Answer & Strategy' : 'View Sample Answer & Breakdown'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => onPracticeQuestion && onPracticeQuestion(q)}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Practice Question</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Answer Section */}
                {isExpanded && (
                  <div className="bg-gray-50/70 border-t border-gray-100 p-5 sm:p-6 space-y-4 animate-fade-in text-xs sm:text-sm">
                    {/* Sample answer */}
                    <div className="space-y-2">
                      <span className="font-bold text-gray-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Exemplary Answer Structure (from Successful Candidate)
                      </span>
                      <div className="p-4 bg-white rounded-xl border border-gray-200 text-gray-700 leading-relaxed font-sans whitespace-pre-line">
                        {q.sample_answer || q.sampleAnswer || 'Structure your response clearly using the STAR method or high-level architecture diagram followed by component deep-dives.'}
                      </div>
                    </div>

                    {/* Tips */}
                    {tips.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
                        <span className="font-bold flex items-center gap-1.5 text-amber-800 text-xs">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                          Insider Tips for {company?.name}:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-1">
                          {tips.map((t, idx) => (
                            <li key={idx} className="leading-snug">{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Follow up questions */}
                    {followUps.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="font-semibold text-gray-700 text-xs">
                          Expected Interviewer Follow-ups:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {followUps.map((fu, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs border border-gray-200">
                              {fu}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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

export default CompanyQuestionsTab;
