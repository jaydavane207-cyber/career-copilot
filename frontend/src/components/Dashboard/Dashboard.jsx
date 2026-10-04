// frontend/src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import UserProfileCard from './UserProfileCard';
import ReadinessScore from './ReadinessScore';
import MetricsCards from './MetricsCards';
import QuickStats from './QuickStats';
import ReadinessBreakdownChart from './ReadinessBreakdownChart';
import NextSteps from './NextSteps';
import ActivityTimeline from './ActivityTimeline';
import Recommendations from './Recommendations';
import DashboardSkeleton from './DashboardSkeleton';
import NoDataBanner from './NoDataBanner';
import { dashboardService } from '../../services/dashboardService';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Unified Cockpit Dashboard
 * - Consumes GET /api/dashboard in a single call
 * - Auto-refreshes every 60 seconds (or on-demand)
 * - Large circular progress indicator with 0-33 Red, 34-66 Yellow, 67-100 Green color coding
 * - 2x2 grid for metrics (Resume, Skills, Study, Interview)
 * - Quick stats section (Applications, Interviews, Hours, Problems)
 * - Stacked bar breakdown chart via Recharts
 * - Prioritized Next Steps with "Go to..." navigation
 * - Recent Activity Timeline (last 5 milestones)
 * - Recommend Actions Widget
 * - Responsive: stacks gracefully on mobile
 */
export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [error, setError] = useState(null);

  const formatCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const fetchDashboardData = useCallback(async (isManual = false) => {
    try {
      if (isManual) {
        setRefreshing(true);
      }
      setError(null);

      const res = await dashboardService.getDashboard();
      if (res && res.success) {
        setData(res);
        setLastUpdated(formatCurrentTime());
      } else {
        throw new Error(res?.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err?.response?.data?.message || err?.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch and 60-second auto-refresh interval
  useEffect(() => {
    fetchDashboardData(false);

    const intervalId = setInterval(() => {
      fetchDashboardData(false);
    }, 60000); // 60 seconds

    return () => clearInterval(intervalId);
  }, [fetchDashboardData]);

  // Loading skeleton while fetching initial data
  if (loading) {
    return (
      <div className="space-y-6">
        <UserProfileCard />
        <DashboardSkeleton />
      </div>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <div className="space-y-6">
        <UserProfileCard />
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-rose-900">Unable to load dashboard</h3>
            <p className="text-xs text-rose-600 max-w-md mx-auto">{error}</p>
          </div>
          <button
            onClick={() => fetchDashboardData(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Detect empty state: no resume score and zero jobs/problems
  const isNoData =
    (data?.readinessScore === 0 || !data?.readinessScore) &&
    (data?.summary?.totalJobsApplied === 0 || !data?.summary?.totalJobsApplied) &&
    (data?.summary?.codesProblemsLogged === 0 || !data?.summary?.codesProblemsLogged);

  return (
    <div className="space-y-6">
      {/* User Profile Card (Editable profile with targetRole) */}
      <UserProfileCard />

      {/* No Data State Banner */}
      {isNoData && (
        <NoDataBanner targetRole={data?.targetRole || 'Frontend Developer'} />
      )}

      {/* Top Section: Overall Readiness Score */}
      <ReadinessScore
        score={data?.readinessScore || 0}
        targetRole={data?.targetRole || 'Frontend Developer'}
        readinessLabel={data?.readinessLabel}
        timeEstimate={data?.timeEstimate}
        onRefresh={() => fetchDashboardData(true)}
        isRefreshing={refreshing}
        lastUpdated={lastUpdated}
      />

      {/* Key Metrics Cards (2x2 Grid) */}
      <MetricsCards
        resumeScore={data?.resumeScore || 0}
        skillGapScore={data?.skillGapScore || 0}
        studyProgress={data?.studyProgress || 0}
        interviewScore={data?.interviewScore || 0}
      />

      {/* Quick Stats Section */}
      <QuickStats summary={data?.summary || {}} />

      {/* Readiness Breakdown Chart (Recharts Stacked Bar) */}
      <ReadinessBreakdownChart
        breakdown={data?.breakdown || []}
        chartStackedData={data?.chartStackedData || []}
        readinessScore={data?.readinessScore || 0}
      />

      {/* Next Steps & Activity Timeline: Two columns on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NextSteps
          nextSteps={data?.nextSteps || []}
          nextActions={data?.nextActions || []}
        />
        <ActivityTimeline
          recentActivities={data?.recentActivities || []}
          recentJobs={data?.recentJobs || []}
        />
      </div>

      {/* Recommend Actions Widget */}
      <Recommendations
        recommendations={data?.recommendations || []}
        targetRole={data?.targetRole || 'Frontend Developer'}
      />
    </div>
  );
};

export default Dashboard;
