// frontend/src/components/Interviews/InterviewPrepWidget.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  Plus
} from 'lucide-react';
import interviewService from '../../services/interviewService';

export const InterviewPrepWidget = ({ onOpenAddModal }) => {
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState(null);
  const [prepPlan, setPrepPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await interviewService.getUpcomingInterviews(1);
      const first = (res?.data || res)?.[0];
      if (first) {
        setUpcoming(first);
        const planRes = await interviewService.getPrepPlan(first.id);
        if (planRes?.data) {
          setPrepPlan(planRes.data);
          // Pre-populate completed tasks
          const initialCompleted = new Set();
          (planRes.data.dailyPlan || []).forEach((day) => {
            (day.tasks || []).forEach((t) => {
              if (t.completed) initialCompleted.add(t.id || t.label);
            });
          });
          setCompletedTasks(initialCompleted);
        }
      } else {
        setUpcoming(null);
        setPrepPlan(null);
      }
    } catch (e) {
      console.warn('Failed to load upcoming interview widget:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTaskToggle = async (task) => {
    if (!upcoming) return;
    const taskId = task.id || task.label;
    const isNowCompleted = !completedTasks.has(taskId);

    // Optimistic toggle
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (isNowCompleted) next.add(taskId);
      else next.delete(taskId);
      return next;
    });

    if (isNowCompleted) {
      try {
        await interviewService.logPrepTask(upcoming.id, {
          taskType: task.type || 'prep_material',
          description: task.label
        });
      } catch (err) {
        console.error('Failed to log task:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-6 bg-gray-200 rounded w-2/3" />
        <div className="h-16 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!upcoming) {
    return (
      <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white rounded-2xl p-5 border border-blue-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-gray-900">
              No Upcoming Interviews Scheduled
            </h4>
            <p className="text-xs text-gray-600">
              Schedule your next round to unlock personalized daily preparation plans and AI answer evaluations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => navigate('/interviews/calendar')}
            className="px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Open Calendar
          </button>
          <button
            onClick={() => {
              if (onOpenAddModal) onOpenAddModal();
              else navigate('/interviews/calendar');
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Interview</span>
          </button>
        </div>
      </div>
    );
  }

  // Today's top tasks preview
  const todayDay = prepPlan?.dailyPlan?.[0];
  const todayTasks = (todayDay?.tasks || []).slice(0, 3);
  const companyName = upcoming.companyName || upcoming.company_name;
  const roleTitle = upcoming.roleTitle || upcoming.role_title;

  return (
    <div className="bg-white rounded-2xl border border-blue-200/90 shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg text-white shadow-2xs flex-shrink-0">
            {companyName ? companyName[0].toUpperCase() : 'I'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                Next Interview
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-950 shadow-2xs">
                {prepPlan?.timeUntil || 'Upcoming'}
              </span>
            </div>
            <h3 className="text-base font-extrabold tracking-tight">
              {companyName} – <span className="text-blue-100 font-semibold">{upcoming.stage}</span>
            </h3>
            <p className="text-xs text-blue-100">
              {roleTitle} • {new Date(upcoming.interviewDatetime || upcoming.interview_datetime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(upcoming.interviewDatetime || upcoming.interview_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <button
            onClick={() => navigate('/interviews/calendar')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Calendar
          </button>
          <button
            onClick={() => navigate(`/interviews/${upcoming.id}/prep`)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>View Prep Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Today's Tasks Preview */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Today's Priority Tasks</span>
          </h4>
          {prepPlan?.stats && (
            <span className="text-xs font-bold text-gray-500">
              Readiness: <strong className="text-blue-600">{prepPlan.stats.readinessScore}%</strong>
            </span>
          )}
        </div>

        <div className="space-y-2">
          {todayTasks.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No tasks pending for today.</p>
          ) : (
            todayTasks.map((task) => {
              const taskId = task.id || task.label;
              const isDone = completedTasks.has(taskId);

              return (
                <div
                  key={taskId}
                  onClick={() => handleTaskToggle(task)}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                    isDone
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : 'bg-gray-50/70 border-gray-200 hover:border-blue-300 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400 hover:text-blue-600 flex-shrink-0" />
                    )}
                    <span className={`text-xs font-medium truncate ${isDone ? 'line-through text-gray-400' : ''}`}>
                      {task.label}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-500 flex-shrink-0 shadow-2xs">
                    {task.category || 'Prep'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrepWidget;
