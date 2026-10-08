// frontend/src/components/Company/CompanySelectionModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Building2,
  X,
  Star,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Users,
  Briefcase,
  HelpCircle,
  Filter
} from 'lucide-react';
import companyService from '../../services/companyService';

export const CompanySelectionModal = ({ isOpen, onClose, onSelect }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('Most popular');
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadCompanies();
    }
  }, [isOpen, selectedIndustry, selectedDifficulty, sortBy]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedIndustry !== 'All') params.industry = selectedIndustry;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (sortBy) params.sort = sortBy;
      if (searchQuery) params.search = searchQuery;

      const data = await companyService.getAllCompanies(params);
      if (data.companies) {
        setCompanies(data.companies);
        if (!selectedCompany && data.companies.length > 0) {
          setSelectedCompany(data.companies[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      loadCompanies();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const industries = ['All', 'Technology', 'Enterprise', 'Fintech', 'E-Commerce', 'Semiconductors', 'Banking'];
  const difficulties = ['All', 'Hard', 'Medium', 'Easy'];
  const sortOptions = ['Most popular', 'Hardest', 'Alphabetical', 'Best culture'];

  // Featured companies (FAANG & top tech)
  const featuredCompanies = useMemo(() => {
    return companies.filter(c => c.featured || ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].includes(c.name)).slice(0, 4);
  }, [companies]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                Choose Target Company
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Access curated interview questions, process breakdowns, and real salary intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 py-4 bg-gray-50/70 border-b border-gray-100 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 50+ companies (e.g. Google, Amazon, Stripe, Flipkart)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            {/* Industry Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-gray-400 font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Industry:
              </span>
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedIndustry === ind
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-200/70 border border-gray-200'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>

            {/* Difficulty & Sort Controls */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-xs">Difficulty:</span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg text-xs py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {difficulties.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-xs">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg text-xs py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {sortOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body: Left Grid + Right Preview */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          
          {/* Companies Grid (Left) */}
          <div className="lg:col-span-7 xl:col-span-8 p-6 space-y-6 overflow-y-auto max-h-[60vh] lg:max-h-[64vh]">
            
            {/* Featured Section (when no active search query) */}
            {!searchQuery && selectedIndustry === 'All' && featuredCompanies.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    Featured & High Hiring Volume
                  </h3>
                  <span className="text-[11px] text-gray-400">FAANG & Top Tier</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {featuredCompanies.map((fc) => (
                    <div
                      key={fc.id}
                      onClick={() => setSelectedCompany(fc)}
                      className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                        selectedCompany?.id === fc.id
                          ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-xs bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gray-50 flex items-center justify-center p-1.5 border border-gray-100">
                        {fc.logo ? (
                          <img src={fc.logo} alt={fc.name} className="w-full h-full object-contain" />
                        ) : (
                          <Building2 className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <p className="font-bold text-xs text-gray-900 truncate">{fc.name}</p>
                      <span className="text-[10px] text-blue-600 font-semibold">{fc.questions_count} Qs</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Company Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">
                  {companies.length} Companies Available
                </span>
              </div>

              {loading ? (
                <div className="py-16 text-center text-gray-400">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm">Loading company catalog...</p>
                </div>
              ) : companies.length === 0 ? (
                <div className="py-16 text-center text-gray-400 space-y-2">
                  <Building2 className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-sm font-medium text-gray-700">No companies match your filters</p>
                  <p className="text-xs text-gray-400">Try adjusting your industry or difficulty filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                  {companies.map((comp) => {
                    const isSelected = selectedCompany?.id === comp.id;
                    const diffBadge = comp.difficulty === 'Hard'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : comp.difficulty === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                    return (
                      <div
                        key={comp.id}
                        onClick={() => setSelectedCompany(comp)}
                        className={`group p-4 rounded-xl border cursor-pointer transition-all text-left flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/40 shadow-sm ring-1 ring-blue-500'
                            : 'border-gray-200 hover:border-blue-200 hover:shadow-xs bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2.5">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center p-1.5 border border-gray-100 flex-shrink-0">
                              {comp.logo ? (
                                <img src={comp.logo} alt={comp.name} className="w-full h-full object-contain" />
                              ) : (
                                <Building2 className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${diffBadge}`}>
                              {comp.difficulty}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {comp.name}
                          </h4>
                          <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            {comp.headquarters}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                          <span className="text-gray-700 font-semibold">{comp.questions_count} Questions</span>
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {comp.average_rating || 4.5}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Selected Company Preview Panel (Right) */}
          <div className="lg:col-span-5 xl:col-span-4 p-6 bg-gray-50/40 flex flex-col justify-between max-h-[60vh] lg:max-h-[64vh] overflow-y-auto">
            {selectedCompany ? (
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-xs border border-gray-200 flex items-center justify-center flex-shrink-0">
                    {selectedCompany.logo ? (
                      <img src={selectedCompany.logo} alt={selectedCompany.name} className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-7 h-7 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {selectedCompany.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {selectedCompany.headquarters}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 leading-relaxed bg-white p-3.5 rounded-xl border border-gray-200/80">
                  {selectedCompany.description || selectedCompany.culture_summary}
                </p>

                {/* Key Insights Stats */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Typical Rounds</span>
                    <p className="text-base font-bold text-gray-900 mt-0.5">
                      {selectedCompany.average_interview_rounds} Rounds
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Process Duration</span>
                    <p className="text-base font-bold text-gray-900 mt-0.5">
                      ~{selectedCompany.average_interview_duration} Days
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Past Questions</span>
                    <p className="text-base font-bold text-blue-600 mt-0.5">
                      {selectedCompany.questions_count} Available
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Success Stories</span>
                    <p className="text-base font-bold text-emerald-600 mt-0.5">
                      {selectedCompany.success_stories} Verified
                    </p>
                  </div>
                </div>

                {/* Culture snippet */}
                {selectedCompany.culture_summary && (
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                    <span className="font-semibold block text-[11px] text-blue-700">Culture & Values Focus:</span>
                    <p className="text-gray-700 leading-snug">{selectedCompany.culture_summary}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">Select a company from the left to view details</p>
              </div>
            )}

            {/* Bottom CTA Action Button */}
            <div className="pt-5 mt-4 border-t border-gray-200">
              <button
                type="button"
                disabled={!selectedCompany}
                onClick={() => {
                  if (selectedCompany && onSelect) {
                    onSelect(selectedCompany);
                    onClose();
                  }
                }}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <span>Prepare for {selectedCompany?.name || 'Company'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanySelectionModal;
