// frontend/src/components/StudyPlanner/PlanDashboard.jsx
import React, { useState, useEffect } from 'react';
import CreatePlan from './CreatePlan';
import DailyChecklist from './DailyChecklist';
import ProgressChart from './ProgressChart';
import { studyService } from '../../services/studyService';
import { LoadingSpinner } from '../Common/LoadingSpinner';

export const PlanDashboard = () => {
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchActivePlan = async () => {
    try {
      setLoading(true);
      const res = await studyService.getActivePlan();
      if (res.success) {
        setActivePlan(res.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePlan();
  }, []);

  const handleToggleTask = async (planId, taskId) => {
    try {
      const res = await studyService.toggleTask(planId, taskId);
      if (res.success) {
        setActivePlan(res.plan);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading custom study plan..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Adaptive Study Planner</h2>
        <p className="text-xs text-slate-500">Structured weekly roadmap and daily checklists tailored to bridge your skill deficits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <CreatePlan onPlanCreated={(plan) => setActivePlan(plan)} />
          {activePlan && (
            <ProgressChart
              progress={activePlan.progress}
              title={activePlan.title}
            />
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {activePlan ? (
            <DailyChecklist
              modules={activePlan.weeklyModules}
              onToggleTask={handleToggleTask}
              planId={activePlan.id}
            />
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <p className="font-semibold text-sm">No Active Study Plan</p>
              <p className="text-xs mt-1">Configure your target timeline on the left to generate an algorithmic study plan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDashboard;
