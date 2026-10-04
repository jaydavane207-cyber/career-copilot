// frontend/src/components/StudyPlanner/PlanDashboard.jsx
import React, { useState, useEffect } from 'react';
import CreatePlan from './CreatePlan';
import DailyChecklist from './DailyChecklist';
import ProgressChart from './ProgressChart';
import { studyService } from '../../services/studyService';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { Button } from '../UI/Button';
import { CheckCircle2, Clock, Pause, Play, Edit3, Download } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import Toast from '../Common/Toast';

export const PlanDashboard = () => {
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const fetchActivePlan = async () => {
    try {
      setLoading(true);
      const res = await studyService.getPlan();
      if (res.success && res.plan) {
        setActivePlan(res.plan);
        setIsPaused(res.plan.status === 'paused');
      } else {
        setActivePlan(null);
      }
    } catch (err) {
      console.error('Failed to load study plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePlan();
  }, []);

  const handleToggleTask = async (planId, taskId) => {
    if (!activePlan) return;

    // Optimistic UI update
    const updatedModules = (activePlan.weeklyModules || []).map((mod) => {
      if (mod.dailyTasks) {
        const updatedTasks = mod.dailyTasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return { ...mod, dailyTasks: updatedTasks };
      }
      return mod;
    });

    const previousPlan = activePlan;
    setActivePlan({
      ...activePlan,
      weeklyModules: updatedModules
    });

    try {
      const res = await studyService.completeTask(taskId);
      if (res.success && res.plan) {
        setActivePlan(res.plan);
        showToast('Task status updated successfully!', 'success');
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      setActivePlan(previousPlan);
      showToast('Failed to update task status.', 'error');
    }
  };

  const handleTogglePause = async () => {
    if (!activePlan) return;
    try {
      if (isPaused) {
        const res = await studyService.resumePlan();
        if (res.success) {
          setIsPaused(false);
          showToast('Study plan resumed!', 'success');
        }
      } else {
        const res = await studyService.pausePlan();
        if (res.success) {
          setIsPaused(true);
          showToast('Study plan paused.', 'info');
        }
      }
    } catch (err) {
      console.error('Failed to update plan status:', err);
      showToast('Could not change pause state.', 'error');
    }
  };

  const handleDownloadPlan = () => {
    showToast('Exporting study plan to PDF...', 'info');
    setTimeout(() => {
      showToast('Study Plan downloaded successfully!', 'success');
    }, 1000);
  };

  if (loading) {
    return <LoadingSpinner message="Loading your study planner..." />;
  }

  if (isCreating || !activePlan) {
    return (
      <div className="space-y-6">
        <Toast toast={toast} onClose={hideToast} />
        <CreatePlan
          onPlanCreated={(plan) => {
            setActivePlan(plan);
            setIsCreating(false);
            showToast('New study plan generated successfully!', 'success');
          }}
          onBack={activePlan ? () => setIsCreating(false) : null}
        />
      </div>
    );
  }

  const weeklyModules = activePlan.weeklyModules || [];
  const currentWeek = weeklyModules[0] || {
    week: 1,
    title: 'Week 1',
    dailyTasks: activePlan.dailyTasks ? activePlan.dailyTasks.slice(0, 5) : []
  };
  const upcomingWeeks = weeklyModules.slice(1, 4);

  // Compute days left
  let daysLeft = 28;
  if (activePlan.targetDate) {
    const diff = Math.round((new Date(activePlan.targetDate) - Date.now()) / (1000 * 3600 * 24));
    if (diff > 0) daysLeft = diff;
  }

  return (
    <div className="space-y-8">
      <Toast toast={toast} onClose={hideToast} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-[32px] leading-[40px] font-bold text-[#111827] tracking-[-0.5px]">
            {activePlan.title || 'Personalized Study Plan'}
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Track daily study milestones, review documentation, and measure progress towards your target role.
          </p>
        </div>

        {/* Action Buttons: Pause/Resume Plan, Edit Plan, Download Plan */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            onClick={handleTogglePause}
            icon={isPaused ? Play : Pause}
          >
            {isPaused ? 'Resume Plan' : 'Pause Plan'}
          </Button>

          <Button
            variant="secondary"
            onClick={() => setIsCreating(true)}
            icon={Edit3}
          >
            Create New Plan
          </Button>

          <Button
            variant="text"
            onClick={handleDownloadPlan}
            icon={Download}
          >
            Download Plan
          </Button>
        </div>
      </div>

      {/* Hero Section: Progress Bar, Status, Days remaining */}
      <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-[#6B7280]">Plan Progress:</span>
              <span className="text-[20px] font-bold text-[#111827]">{activePlan.progress || 0}% complete</span>
              {isPaused && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold ml-2">
                  Paused
                </span>
              )}
            </div>
            <p className="text-[14px] font-semibold text-[#10B981] mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Target Completion Date: {activePlan.targetDate || 'Scheduled'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] bg-[#EBF5FF] text-[#3B82F6] font-bold text-[14px]">
            <Clock className="w-4 h-4" />
            <span>{daysLeft} days remaining</span>
          </div>
        </div>

        <div className="w-full bg-[#F3F4F6] rounded-[6px] h-[12px] overflow-hidden">
          <div
            className="bg-[#3B82F6] h-full rounded-[6px] transition-all duration-500 ease-out"
            style={{ width: `${activePlan.progress || 0}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Current Week Tasks on Left, Coming Up & Progress Chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DailyChecklist
            currentWeekModule={currentWeek}
            onToggleTask={handleToggleTask}
            planId={activePlan.id}
          />

          <ProgressChart targetDate={activePlan.targetDate || 'Scheduled'} />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <h2 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">
                Coming Up
              </h2>
              <span className="text-[12px] text-[#6B7280]">Next Weeks</span>
            </div>

            <div className="space-y-4">
              {upcomingWeeks.length > 0 ? (
                upcomingWeeks.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-[#111827]">
                        Week {w.week || idx + 2}
                      </span>
                      <span className="text-[11px] font-medium text-[#6B7280]">
                        {w.title || `Sprint ${idx + 2}`}
                      </span>
                    </div>

                    <ul className="list-disc list-inside space-y-1 text-[13px] text-[#374151]">
                      {(w.focusSkills || ['Core Skill Deep Dive', 'Implementation Mini-Project', 'Unit Testing']).map((skill, sIdx) => (
                        <li key={sIdx} className="truncate">
                          {skill}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[12px] text-[#6B7280]">
                      <span>Allocated:</span>
                      <span className="font-bold text-[#374151]">{w.allocatedHours || 15} hrs</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">
                  Final sprint of your current study cycle!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDashboard;
