// frontend/src/components/Dashboard/ReadinessScore.jsx
import React, { useState, useEffect } from 'react';
import { Target, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Helper to determine score status & colors:
 * Red (0-33%), Yellow (34-66%), Green (67-100%)
 */
export const getScoreStatusConfig = (score = 0) => {
  if (score <= 33) {
    return {
      status: 'Needs Preparation',
      color: '#EF4444',
      badgeBg: 'bg-red-500/20 text-white border-red-300/40'
    };
  }
  if (score <= 66) {
    return {
      status: 'Getting There',
      color: '#F59E0B',
      badgeBg: 'bg-amber-400/20 text-white border-amber-300/40'
    };
  }
  return {
    status: 'Ready!',
    color: '#10B981',
    badgeBg: 'bg-emerald-400/20 text-white border-emerald-300/40'
  };
};

export const ReadinessScore = ({
  score = 0,
  targetRole = 'Frontend Developer',
  readinessLabel,
  onRefresh,
  isRefreshing = false,
  lastUpdated
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || user?.fullName || 'Candidate';
  const validScore = Math.min(100, Math.max(0, Math.round(score || 0)));

  // Smooth animation for circular score transition
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = validScore;
    if (end === 0) {
      setAnimatedScore(0);
      return;
    }
    const duration = 600;
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
  }, [validScore]);

  const statusConfig = getScoreStatusConfig(validScore);
  const statusText = readinessLabel || statusConfig.status;

  // SVG Circular progress dimensions (200px diameter)
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white p-[32px] sm:p-[40px_32px] rounded-[12px] mb-[32px] shadow-[0_4px_12px_rgba(59,130,246,0.25)] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Column: Greeting, Subtext, & Large CTA button */}
        <div className="space-y-4 max-w-xl text-center lg:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[12px] font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-100" />
            <span>AI Career Copilot Cockpit</span>
          </div>

          <h1 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[40px] font-bold text-white tracking-[-0.5px]">
            Welcome back, {displayName}!
          </h1>

          <p className="text-[16px] leading-[24px] text-blue-100 tracking-[0.25px]">
            You're <span className="font-bold text-white">{validScore}%</span> ready for{' '}
            <span className="font-semibold text-white underline decoration-white/40 underline-offset-4">
              {targetRole || 'Frontend Developer'}
            </span>
          </p>

          <p className="text-[13px] text-blue-100/90 leading-relaxed max-w-md hidden sm:block">
            Weighted index combining ATS Resume Coverage (20%), Skill Matrix (30%), Study Roadmap (25%), and Mock Interview Performance (25%).
          </p>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button
              type="button"
              onClick={() => {
                const nextSection = document.getElementById('next-steps-section');
                if (nextSection) {
                  nextSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/study-plan');
                }
              }}
              className="bg-white hover:bg-blue-50 text-[#2563EB] text-[15px] font-bold py-[12px] px-[28px] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-lg active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-2"
            >
              <span>Continue Preparation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="px-3.5 py-2.5 rounded-[8px] bg-white/15 hover:bg-white/25 text-white text-[13px] font-medium transition-all inline-flex items-center gap-1.5 border border-white/20"
                title="Sync latest scores"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
              </button>
            )}
          </div>

          {lastUpdated && (
            <p className="text-[11px] text-blue-200/80">
              Last synchronized: {lastUpdated}
            </p>
          )}
        </div>

        {/* Right Column: Readiness Score Card (Hero) - 200px diameter */}
        <div className="flex flex-col items-center flex-shrink-0 bg-white/10 backdrop-blur-md rounded-[16px] p-6 border border-white/20 shadow-inner">
          <div className="relative w-[200px] h-[200px] flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Animated Progress ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={statusConfig.color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <span className="text-[38px] font-extrabold text-white leading-none tracking-tight">
                {animatedScore}%
              </span>
              <span className="text-[13px] font-semibold text-blue-100 uppercase tracking-wider mt-1">
                % Ready
              </span>
            </div>
          </div>

          {/* Status Label below */}
          <div className="mt-3 text-center space-y-1">
            <div className={`px-3 py-1 rounded-full text-[12px] font-bold border ${statusConfig.badgeBg}`}>
              {statusText}
            </div>
            <div className="flex items-center justify-center gap-1 text-[12px] text-blue-100 font-medium">
              <Target className="w-3.5 h-3.5" />
              <span>Target: {targetRole || 'Frontend Developer'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadinessScore;
