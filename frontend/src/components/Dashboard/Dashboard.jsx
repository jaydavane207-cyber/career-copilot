// frontend/src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import UserProfileCard from './UserProfileCard';
import ReadinessScore from './ReadinessScore';
import MetricsCards from './MetricsCards';
import NextSteps from './NextSteps';
import ActivityTimeline from './ActivityTimeline';
import Recommendations from './Recommendations';
import { dashboardService } from '../../services/dashboardService';
import { LoadingSpinner } from '../Common/LoadingSpinner';

/**
 * Dashboard Component
 * Protected primary cockpit for Career Copilot:
 * - Displays active user profile and allows editing via GET/POST /api/user
 * - Unified 0-100% career readiness score breakdown
 * - Application metrics across Indian tech job pipeline
 * - Algorithmic next steps and target role recommendations
 */
export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getSummary();
      if (res.success) {
        setData(res.summary);
      }
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating career readiness insights..." />;
  }

  return (
    <div className="space-y-6">
      {/* User Profile Card (Connected with GET & POST /api/user) */}
      <UserProfileCard />

      {/* Readiness Overview */}
      <ReadinessScore
        score={data?.readinessScore}
        breakdown={data?.readinessBreakdown}
      />

      {/* Metrics Row */}
      <MetricsCards metrics={data?.metrics} />

      {/* Next Steps & Applications Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NextSteps nextSteps={data?.nextSteps} />
        <ActivityTimeline recentJobs={data?.recentJobs} />
      </div>

      {/* AI Strategy recommendations */}
      <Recommendations targetRole={data?.targetRole} />
    </div>
  );
};

export default Dashboard;
