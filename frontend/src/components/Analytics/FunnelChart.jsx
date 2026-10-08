// frontend/src/components/Analytics/FunnelChart.jsx
import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Users, ArrowRight, CheckCircle2, ChevronRight, Info } from 'lucide-react';

export const FunnelChart = ({ funnelData, onActionClick }) => {
  const [hoveredStage, setHoveredStage] = useState(null);

  if (!funnelData || !funnelData.funnel) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500">
        Loading funnel metrics...
      </div>
    );
  }

  const { funnel, conversion_rates, overall_offer_rate, platform_avg_offer_rate, bottleneck, bottleneckReason } = funnelData;

  const stages = [
    {
      id: 'applied',
      name: 'Applied',
      count: funnel.applied || 0,
      convRate: 100,
      dropoff: (funnel.applied || 0) - (funnel.phone_screen || 0),
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      benchmark: 100,
      description: 'Initial job applications submitted across job boards & company portals'
    },
    {
      id: 'phone_screen',
      name: 'Phone Screen',
      count: funnel.phone_screen || 0,
      convRate: conversion_rates.to_phone_screen || 53,
      dropoff: (funnel.phone_screen || 0) - (funnel.technical || 0),
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-700',
      borderColor: 'border-sky-200',
      benchmark: 58,
      description: 'Recruiter screen & introductory qualification calls'
    },
    {
      id: 'technical',
      name: 'Technical Round',
      count: funnel.technical || 0,
      convRate: conversion_rates.to_technical || 50,
      dropoff: (funnel.technical || 0) - (funnel.offer || 0),
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-200',
      benchmark: 60,
      description: 'Live coding interviews, algorithmic questions & system design deep-dives',
      isBottleneck: bottleneck === 'technical_round'
    },
    {
      id: 'offer',
      name: 'Job Offer',
      count: funnel.offer || 0,
      convRate: conversion_rates.to_offer || 25,
      dropoff: 0,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      benchmark: 30,
      description: 'Written formal offers received with compensation breakdown'
    }
  ];

  // Helper for conversion status badge
  const getConversionBadge = (rate, benchmark) => {
    if (rate >= 60) return { label: 'High', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (rate >= 40) return { label: 'Average', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { label: 'Critical Drop', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Funnel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Job Application Pipeline Funnel</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Full conversion pipeline from initial outreach to accepted offers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium block">Overall Offer Rate</span>
            <span className={`text-base font-bold ${overall_offer_rate >= platform_avg_offer_rate ? 'text-emerald-600' : 'text-rose-600'}`}>
              {overall_offer_rate}%
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 font-medium block">Platform Avg</span>
            <span className="text-base font-bold text-slate-700">{platform_avg_offer_rate}%</span>
          </div>
        </div>
      </div>

      {/* Bottleneck Warning Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-200/60 px-2 py-0.5 rounded">
                Pipeline Bottleneck
              </span>
              <span className="text-sm font-semibold text-rose-900">Technical Round Conversion</span>
            </div>
            <p className="text-xs text-rose-700 mt-1">
              {bottleneckReason || 'Only 50% conversion from technical to offer (platform benchmark is 60%). Focus on coding pattern mastery & system design drills.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onActionClick && onActionClick('technical')}
          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex-shrink-0 flex items-center gap-1.5"
        >
          Fix Bottleneck
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Visual Funnel Progression Bars */}
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const maxCount = stages[0].count || 1;
          const widthPercent = Math.max(18, Math.round((stage.count / maxCount) * 100));
          const badge = getConversionBadge(stage.convRate, stage.benchmark);
          const isSelected = hoveredStage === stage.id;

          return (
            <div
              key={stage.id}
              onMouseEnter={() => setHoveredStage(stage.id)}
              onMouseLeave={() => setHoveredStage(null)}
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                stage.isBottleneck
                  ? 'border-rose-300 bg-rose-50/40 hover:bg-rose-50/80 ring-1 ring-rose-200'
                  : isSelected
                  ? 'border-indigo-300 bg-indigo-50/30 shadow-xs'
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-bold text-slate-900">{stage.name}</span>
                  {stage.isBottleneck && (
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                      Primary Bottleneck
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-normal hidden sm:inline">
                    {stage.count} candidates / roles
                  </span>
                  <span className="font-extrabold text-slate-900 text-base">{stage.count}</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative h-6 bg-slate-100 rounded-lg overflow-hidden flex items-center">
                <div
                  className={`h-full bg-gradient-to-r ${stage.color} rounded-lg transition-all duration-500 flex items-center justify-end pr-2 text-white text-[11px] font-bold`}
                  style={{ width: `${widthPercent}%` }}
                >
                  <span className="drop-shadow-xs">{widthPercent}%</span>
                </div>

                {/* Benchmark Indicator Marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-400/80 z-10"
                  style={{ left: `${stage.benchmark}%` }}
                  title={`Platform Benchmark: ${stage.benchmark}%`}
                ></div>
              </div>

              {/* Metrics & Conversion Breakdown Footer */}
              <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-600">Stage Conversion:</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${badge.color}`}>
                    {stage.convRate}% ({badge.label})
                  </span>
                  <span className="text-slate-400">vs Platform Avg {stage.benchmark}%</span>
                </div>
                {stage.dropoff > 0 && (
                  <span className="text-rose-600 font-medium text-[11px]">
                    -{stage.dropoff} drop-offs to next stage
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Funnel Insights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-xs text-slate-500 font-medium">Days to First Interview</span>
          <p className="text-lg font-bold text-slate-800 mt-1">{funnelData.days_to_first_interview || 12} days</p>
          <span className="text-[11px] text-emerald-600 font-medium">2 days faster than avg</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-xs text-slate-500 font-medium">Average Days to Offer</span>
          <p className="text-lg font-bold text-slate-800 mt-1">{funnelData.days_to_offer || 21} days</p>
          <span className="text-[11px] text-slate-500 font-medium">Platform avg: 24 days</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-xs text-slate-500 font-medium">Funnel Percentile</span>
          <p className="text-lg font-bold text-slate-800 mt-1">Top {funnelData.percentile || 35}%</p>
          <span className="text-[11px] text-indigo-600 font-medium">Higher than 65% of applicants</span>
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;
