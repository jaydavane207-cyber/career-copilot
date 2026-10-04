// frontend/src/components/Dashboard/ReadinessScore.jsx
import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Target, Clock, RefreshCw, Sparkles, AlertCircle, CheckCircle, Flame } from 'lucide-react';

/**
 * Color coding helper:
 * Red (0-33): "Start Here"
 * Yellow (34-66): "Getting There"
 * Green (67-100): "Ready!"
 */
export const getScoreColorConfig = (score = 0) => {
  if (score <= 33) {
    return {
      status: 'Start Here',
      pathColor: '#EF4444', // Red-500
      trailColor: '#FEE2E2', // Red-100
      textColor: '#B91C1C', // Red-700
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      pillColor: 'bg-rose-500',
      icon: AlertCircle
    };
  }
  if (score <= 66) {
    return {
      status: 'Getting There',
      pathColor: '#F59E0B', // Amber-500
      trailColor: '#FEF3C7', // Amber-100
      textColor: '#B45309', // Amber-700
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      pillColor: 'bg-amber-500',
      icon: Flame
    };
  }
  return {
    status: 'Ready!',
    pathColor: '#10B981', // Emerald-500
    trailColor: '#D1FAE5', // Emerald-100
    textColor: '#047857', // Emerald-700
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pillColor: 'bg-emerald-500',
    icon: CheckCircle
  };
};

export const ReadinessScore = ({
  score = 0,
  targetRole = 'Frontend Developer',
  readinessLabel,
  timeEstimate,
  onRefresh,
  isRefreshing = false,
  lastUpdated
}) => {
  // Smooth animation for circular score transition
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, Math.round(score || 0)));
    if (end === 0) {
      setAnimatedScore(0);
      return;
    }

    const duration = 800; // ms
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const colorConfig = getScoreColorConfig(score);
  const StatusIcon = colorConfig.icon;
  const labelText = readinessLabel || colorConfig.status;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Score & Primary Progress Ring */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto text-center sm:text-left">
          {/* Large Circular Progress Bar */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 relative">
            <CircularProgressbar
              value={animatedScore}
              text={`${animatedScore}%`}
              styles={buildStyles({
                strokeLinecap: 'round',
                textSize: '24px',
                pathTransitionDuration: 0.5,
                pathColor: colorConfig.pathColor,
                textColor: '#0F172A', // Slate-900
                trailColor: colorConfig.trailColor,
                backgroundColor: '#F8FAFC'
              })}
            />
          </div>

          {/* Details column */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Career Readiness Index
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${colorConfig.badgeBg}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {labelText}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
                <span>Overall Readiness</span>
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm font-semibold text-indigo-600 mt-0.5">
                <Target className="w-4 h-4 flex-shrink-0" />
                <span>Target Role: {targetRole || 'Frontend Developer'}</span>
              </div>
            </div>

            {/* Time Estimate to be Ready */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 w-fit mx-auto sm:mx-0">
              <Clock className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span>
                {timeEstimate || (score >= 67 ? 'Ready to apply for jobs!' : '~2-3 weeks at current prep pace')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Score Status, Refresh & Pacing Helper */}
        <div className="flex flex-col items-center md:items-end justify-between self-stretch gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-2xs disabled:opacity-50"
              title="Refresh dashboard data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
              <span>{isRefreshing ? 'Updating...' : 'Sync Now'}</span>
            </button>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Auto-refreshes every 60s
            </span>
          </div>

          <div className="text-center md:text-right space-y-1">
            <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs font-medium text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Weighted: Resume (20%) + Skills (30%) + Study (25%) + Interview (25%)</span>
            </div>
            {lastUpdated && (
              <p className="text-[10px] text-slate-400">
                Last checked: {lastUpdated}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadinessScore;
