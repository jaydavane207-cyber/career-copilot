// frontend/src/pages/CompanyPrep.jsx
import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Sparkles,
  Zap,
  Layers,
  HelpCircle,
  TrendingUp,
  DollarSign,
  Trophy,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import companyService from '../services/companyService';
import CompanySelectionModal from '../components/Company/CompanySelectionModal';
import CompanyOverviewPanel from '../components/Company/CompanyOverviewPanel';
import CompanyInterviewProcess from '../components/Company/CompanyInterviewProcess';
import CompanyQuestionsTab from '../components/Company/CompanyQuestionsTab';
import CompanySalaryTab from '../components/Company/CompanySalaryTab';
import CompanySuccessStoriesTab from '../components/Company/CompanySuccessStoriesTab';
import CompanyReviewsTab from '../components/Company/CompanyReviewsTab';
import StartPreparationFlow from '../components/Company/StartPreparationFlow';
import PersonalizedPrepPanel from '../components/Company/PersonalizedPrepPanel';
import CompanyQuestionPracticePage from '../components/Company/CompanyQuestionPracticePage';

export const CompanyPrep = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'process' | 'questions' | 'salary' | 'stories' | 'reviews'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals & State
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isPrepFlowOpen, setIsPrepFlowOpen] = useState(false);
  const [practicingQuestion, setPracticingQuestion] = useState(null);

  // User's active preparation plan (if any)
  const [userPreps, setUserPreps] = useState([]);
  const [currentPrep, setCurrentPrep] = useState(null);

  const popularPills = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Stripe', 'Flipkart', 'Netflix', 'Uber'];

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // 1. Check user preparations
      let existingPreps = [];
      try {
        const pRes = await companyService.getUserPreparations();
        if (pRes.preparations) {
          existingPreps = pRes.preparations;
          setUserPreps(existingPreps);
        }
      } catch (e) {
        // user might be guest / unauthenticated
      }

      // 2. Load companies and pick first or user's active company
      const cRes = await companyService.getAllCompanies();
      const allCompanies = cRes.companies || [];

      if (allCompanies.length > 0) {
        let target = allCompanies[0];
        if (existingPreps.length > 0) {
          const matched = allCompanies.find(c => c.id === existingPreps[0].company_id);
          if (matched) {
            target = matched;
            setCurrentPrep(existingPreps[0]);
          }
        }
        selectCompany(target);
      }
    } catch (err) {
      console.error('Failed to initialize company prep page:', err);
      setError('Failed to load company directory.');
    } finally {
      setLoading(false);
    }
  };

  const selectCompany = async (company) => {
    setSelectedCompany(company);
    setPracticingQuestion(null);
    try {
      const details = await companyService.getCompanyDetails(company.id);
      setCompanyDetails(details);

      // Check if user has an existing prep plan for this selected company
      const matchedPrep = userPreps.find(p => p.company_id === company.id);
      setCurrentPrep(matchedPrep || null);
    } catch (err) {
      console.error('Error fetching company details:', err);
    }
  };

  const handleSelectPill = async (companyName) => {
    try {
      const res = await companyService.getAllCompanies({ search: companyName });
      if (res.companies && res.companies.length > 0) {
        selectCompany(res.companies[0]);
      }
    } catch (err) {
      console.error('Error searching pill company:', err);
    }
  };

  const handlePrepFlowComplete = (newPlan) => {
    setIsPrepFlowOpen(false);
    setCurrentPrep(newPlan.preparation || newPlan);
    // Reload user preparations
    companyService.getUserPreparations().then(res => {
      if (res.preparations) setUserPreps(res.preparations);
    }).catch(() => {});
  };

  const tabs = [
    { id: 'overview', label: 'Company Overview', icon: Building2 },
    { id: 'process', label: 'Interview Process', icon: Layers },
    { id: 'questions', label: 'Past Questions', icon: HelpCircle, badge: companyDetails?.stats?.questions_count },
    { id: 'salary', label: 'Salary Data', icon: DollarSign },
    { id: 'stories', label: 'Success Stories', icon: Trophy, badge: companyDetails?.stats?.success_stories },
    { id: 'reviews', label: 'Culture & Reviews', icon: MessageSquare }
  ];

  return (
    <div className="space-y-6 pb-16 animate-fade-in text-gray-900">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-sm relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-blue-100 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Feature 6 • Company-Specific Interview Intelligence</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Prepare for Your Dream Interview at {selectedCompany?.name || 'Top Tech Companies'}
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
            Ace your target company with real past interview questions, round-by-round rejection hurdles, 
            salary negotiation benchmarks, and insider tips from hired candidates.
          </p>

          {/* Quick Select Popular Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-blue-200 font-medium mr-1">Popular:</span>
            {popularPills.map((pill) => (
              <button
                key={pill}
                onClick={() => handleSelectPill(pill)}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  selectedCompany?.name === pill
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
                }`}
              >
                {pill}
              </button>
            ))}

            <button
              onClick={() => setIsSelectModalOpen(true)}
              className="ml-auto px-4 py-1.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold transition-all shadow-xs flex items-center gap-1.5 text-xs"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Change Company (50+)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Preparation Panel Banner (if user has active prep for this company) */}
      {currentPrep && !practicingQuestion && (
        <PersonalizedPrepPanel
          company={selectedCompany}
          prepData={currentPrep}
          onPracticeQuestion={(q) => setPracticingQuestion(q)}
          onTabChange={(t) => setActiveTab(t)}
        />
      )}

      {/* Active Question Practice Page Mode */}
      {practicingQuestion ? (
        <CompanyQuestionPracticePage
          company={selectedCompany}
          question={practicingQuestion}
          onBack={() => setPracticingQuestion(null)}
          prepId={currentPrep?.id}
          onProgressUpdated={(updated) => setCurrentPrep(updated)}
        />
      ) : (
        /* Main Company Hub Tabs */
        <div className="space-y-6">
          
          {/* Navigation Tab Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel Content */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <CompanyOverviewPanel
                company={selectedCompany}
                details={companyDetails}
                onStartPreparation={() => setIsPrepFlowOpen(true)}
              />
            )}

            {activeTab === 'process' && (
              <CompanyInterviewProcess
                company={selectedCompany}
                initialRole={currentPrep?.role || 'Senior Software Engineer'}
              />
            )}

            {activeTab === 'questions' && (
              <CompanyQuestionsTab
                company={selectedCompany}
                onPracticeQuestion={(q) => setPracticingQuestion(q)}
              />
            )}

            {activeTab === 'salary' && (
              <CompanySalaryTab
                company={selectedCompany}
              />
            )}

            {activeTab === 'stories' && (
              <CompanySuccessStoriesTab
                company={selectedCompany}
              />
            )}

            {activeTab === 'reviews' && (
              <CompanyReviewsTab
                company={selectedCompany}
              />
            )}
          </div>

        </div>
      )}

      {/* Modals */}
      <CompanySelectionModal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        onSelect={(comp) => selectCompany(comp)}
      />

      <StartPreparationFlow
        company={selectedCompany}
        isOpen={isPrepFlowOpen}
        onClose={() => setIsPrepFlowOpen(false)}
        onComplete={handlePrepFlowComplete}
      />

    </div>
  );
};

export default CompanyPrep;
