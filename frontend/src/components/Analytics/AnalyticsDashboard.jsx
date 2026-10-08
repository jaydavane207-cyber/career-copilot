// frontend/src/components/Analytics/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  Award,
  DollarSign,
  Clock,
  Layers,
  Flame,
  Users,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { downloadAnalyticsPDF } from '../../utils/analyticsPdfReport';
import { useAuth } from '../../hooks/useAuth';

// Subcomponents
import FunnelChart from './FunnelChart';
import SkillsChart from './SkillsChart';
import SalaryChart from './SalaryChart';
import MarketTrendsChart from './MarketTrendsChart';
import ComparisonPanel from './ComparisonPanel';
import RecommendationsPanel from './RecommendationsPanel';
import PredictionsPanel from './PredictionsPanel';

export const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'funnel' | 'skills' | 'salary' | 'study_roi' | 'market' | 'comparison'
  const [timeRange, setTimeRange] = useState('all_time'); // 'this_week' | 'this_month' | 'all_time'

  // Analytics state
  const [dashboardData, setDashboardData] = useState(null);
  const [marketSkills, setMarketSkills] = useState([]);
  const [marketSalary, setMarketSalary] = useState(null);

  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [dashRes, marketRes, salaryRes] = await Promise.all([
        analyticsService.getDashboardData(),
        analyticsService.getMarketSkills(30),
        analyticsService.getMarketSalary('Senior SDE', 'Mountain View, CA')
      ]);

      if (dashRes && dashRes.success) {
        setDashboardData(dashRes.data);
      }
      if (marketRes && marketRes.success) {
        setMarketSkills(marketRes.data);
      }
      if (salaryRes && salaryRes.success) {
        setMarketSalary(salaryRes.data);
      }
    } catch (err) {
      console.error('Failed to load analytics dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const handleExportPDF = () => {
    setExporting(true);
    try {
      downloadAnalyticsPDF(dashboardData, user?.name || user?.fullName || 'Candidate');
    } catch (e) {
      console.error('PDF export failed:', e);
    } finally {
      setTimeout(() => setExporting(false), 800);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  const funnel = dashboardData?.funnel || {};
  const salary = dashboardData?.salary || {};
  const study = dashboardData?.study || {};
  const skills = dashboardData?.skills || {};
  const roi = dashboardData?.roi || {};
  const comparisons = dashboardData?.comparisons || {};
  const recommendations = dashboardData?.recommendations || [];
  const predictions = dashboardData?.predictions || null;

  const offerRate = funnel.overall_offer_rate || 6.7;
  const platformOfferRate = funnel.platform_avg_offer_rate || 8.2;
  const isOfferAbove = offerRate >= platformOfferRate;

  const avgSalary = salary.avg_final_offer || 180000;
  const platformSalary = salary.platform_avg_salary || 175000;
  const isSalaryAbove = avgSalary >= platformSalary;

  const studyHours = study.total_hours || 126;
  const platformStudyHours = study.platform_avg_hours_to_ready || 100;
  const isStudyAbove = studyHours >= platformStudyHours;

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: Layers },
    { id: 'funnel', label: 'Application Funnel', icon: BarChart3 },
    { id: 'skills', label: 'Skills Performance', icon: Award },
    { id: 'salary', label: 'Salary & Negotiation', icon: DollarSign },
    { id: 'study_roi', label: 'Study & ROI', icon: Clock },
    { id: 'market', label: 'Market Demand', icon: Flame },
    { id: 'comparison', label: 'Cohort Comparison', icon: Users }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Career Analytics Dashboard
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data-driven intelligence engine tracking your funnel conversion, skill ROI, salary gains, and future trajectory.
          </p>
        </div>

        {/* Date Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Range Selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs shadow-2xs">
            <button
              onClick={() => setTimeRange('this_week')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === 'this_week' ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('this_month')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === 'this_month' ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeRange('all_time')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === 'all_time' ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Time
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors shadow-2xs"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          {/* Download PDF Report Button */}
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Generating PDF...' : 'Download Report (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Cards (Top) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Offer Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Application Offer Rate</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isOfferAbove ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {isOfferAbove ? 'Above Avg' : 'Below Avg'}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{offerRate}%</span>
            <span className="text-xs text-slate-400 font-medium">vs platform avg {platformOfferRate}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {funnel.funnel?.offer || 1} offer out of {funnel.funnel?.applied || 15} applications
          </p>
        </div>

        {/* Metric 2: Avg Final Salary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Final Compensation</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Top 40%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              ${(avgSalary / 1000).toFixed(0)}k
            </span>
            <span className="text-xs text-slate-400 font-medium">vs platform avg ${(platformSalary / 1000).toFixed(0)}k</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-2">
            +{salary.negotiation_percentage || 9.1}% gained via negotiation
          </p>
        </div>

        {/* Metric 3: Interview Success */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interview Success Rate</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Needs Polish
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">45%</span>
            <span className="text-xs text-slate-400 font-medium">vs platform avg 50%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            2 offers converted out of 4.4 interview rounds
          </p>
        </div>

        {/* Metric 4: Study Hours */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study Hours Logged</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              +26 hrs More
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600">{studyHours} hrs</span>
            <span className="text-xs text-slate-400 font-medium">vs platform avg {platformStudyHours} hrs</span>
          </div>
          <p className="text-[11px] text-indigo-700 font-medium mt-2">
            Efficiency: {study.efficiency_rating || 'Above Average'}
          </p>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Views */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Application Funnel Card */}
          <FunnelChart
            funnelData={funnel}
            onActionClick={() => setActiveTab('skills')}
          />

          {/* Split 2-column Grid: Recommendations & Predictions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecommendationsPanel
              recommendations={recommendations}
              onActionClick={(rec) => {
                if (rec.priority === 1) setActiveTab('skills');
                else if (rec.priority === 2) setActiveTab('study_roi');
                else setActiveTab('funnel');
              }}
            />
            <PredictionsPanel predictions={predictions} />
          </div>

          {/* Quick Previews: Skills & Salary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkillsChart skillsData={skills} />
            <SalaryChart salaryData={salary} marketData={marketSalary} />
          </div>
        </div>
      )}

      {/* TAB 2: FUNNEL */}
      {activeTab === 'funnel' && (
        <div className="space-y-6 animate-fade-in">
          <FunnelChart funnelData={funnel} />
          <PredictionsPanel predictions={predictions} />
        </div>
      )}

      {/* TAB 3: SKILLS */}
      {activeTab === 'skills' && (
        <div className="space-y-6 animate-fade-in">
          <SkillsChart skillsData={skills} />
          <MarketTrendsChart marketData={marketSkills} userSkills={skills.skills || []} />
        </div>
      )}

      {/* TAB 4: SALARY */}
      {activeTab === 'salary' && (
        <div className="space-y-6 animate-fade-in">
          <SalaryChart salaryData={salary} marketData={marketSalary} />
          <ComparisonPanel comparisons={comparisons} />
        </div>
      )}

      {/* TAB 5: STUDY & ROI */}
      {activeTab === 'study_roi' && (
        <div className="space-y-6 animate-fade-in">
          {/* Study Effectiveness Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Study Effectiveness & Readiness Trajectory</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Measurement of learning velocity, readiness milestones, and mock test score progression
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                Efficiency: {study.efficiency_rating || 'Above Average'}
              </span>
            </div>

            {/* Study Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-xs text-slate-400 font-medium">Total Hours</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{study.total_hours || 126} hrs</p>
                <span className="text-[11px] text-slate-500">Platform avg: 100 hrs</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-xs text-slate-400 font-medium">Starting Readiness</span>
                <p className="text-xl font-extrabold text-slate-600 mt-1">{study.starting_readiness || 35}%</p>
                <span className="text-[11px] text-slate-400">Baseline score</span>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-200/80">
                <span className="text-xs text-indigo-700 font-medium">Current Readiness</span>
                <p className="text-xl font-extrabold text-indigo-900 mt-1">{study.current_readiness || 78}%</p>
                <span className="text-[11px] text-indigo-700 font-bold">+{study.improvement || 43}% improvement</span>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/80">
                <span className="text-xs text-emerald-700 font-medium">Predicted 95% Ready</span>
                <p className="text-sm font-extrabold text-emerald-900 mt-2 truncate">
                  {study.predicted_ready_date || 'Feb 15, 2025'}
                </p>
                <span className="text-[11px] text-emerald-700">Optimal interview readiness</span>
              </div>
            </div>

            {/* Preparation ROI Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  Preparation ROI Analysis (Salary Impact Per Hour Invested)
                </h4>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Best ROI: {roi.best_roi_skill || 'System Design ($625/hr)'}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-3">Skill / Focus Area</th>
                      <th className="p-3">Hours Spent</th>
                      <th className="p-3">Interviews Tested</th>
                      <th className="p-3">Success Impact</th>
                      <th className="p-3">Est. Salary Impact</th>
                      <th className="p-3">ROI / Hour Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {(roi.skills_by_roi || []).map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">
                          {row.skill}
                          {row.is_critical && (
                            <span className="ml-2 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                              Critical
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600">{row.hours_spent} hrs</td>
                        <td className="p-3 text-slate-600">{row.interviews_using}</td>
                        <td className="p-3 text-emerald-700 font-bold">+{row.impact}%</td>
                        <td className="p-3 font-bold text-slate-900">+${row.estimated_salary_impact.toLocaleString()}</td>
                        <td className="p-3 font-extrabold text-emerald-600">${row.roi_per_hour}/hr</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MARKET DEMAND */}
      {activeTab === 'market' && (
        <div className="space-y-6 animate-fade-in">
          <MarketTrendsChart marketData={marketSkills} userSkills={skills.skills || []} />
        </div>
      )}

      {/* TAB 7: COHORT COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="space-y-6 animate-fade-in">
          <ComparisonPanel comparisons={comparisons} />
          <RecommendationsPanel recommendations={recommendations} />
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
