// frontend/src/components/Analytics/ComparisonPanel.jsx
import React from 'react';
import { Users, TrendingUp, TrendingDown, Award, CheckCircle2, AlertCircle } from 'lucide-react';

export const ComparisonPanel = ({ comparisons = {} }) => {
  const metrics = [
    {
      key: 'offer_rate',
      name: 'Application Offer Rate',
      data: comparisons.offer_rate || { user_value: 6.7, platform_avg: 8.2, difference: -1.5, percentile: 37 },
      format: (val) => `${val}%`,
      inverse: false,
      description: 'Percentage of submitted applications converting into accepted written offers'
    },
    {
      key: 'salary',
      name: 'Average Final Compensation',
      data: comparisons.salary || { user_value: 180000, platform_avg: 175000, difference: 5000, percentile: 60 },
      format: (val) => `$${Number(val).toLocaleString()}`,
      inverse: false,
      description: 'Final base salary + performance compensation negotiated across closed offers'
    },
    {
      key: 'study_hours',
      name: 'Curriculum Study Hours',
      data: comparisons.study_hours || { user_value: 126, platform_avg: 100, difference: 26, percentile: 70 },
      format: (val) => `${val} hrs`,
      inverse: false,
      description: 'Hours invested across algorithm practice, system design, and mock interviews'
    },
    {
      key: 'interview_success',
      name: 'Interview Stage Success',
      data: comparisons.interview_success || { user_value: 45.0, platform_avg: 50.0, difference: -5.0, percentile: 45 },
      format: (val) => `${val}%`,
      inverse: false,
      description: 'Candidate passing rate through individual live coding and system design rounds'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Platform Cohort Benchmark Comparison</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Side-by-side benchmarking against 5,000+ active candidates in your experience tier
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium block">Comparison Cohort</span>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
            Full-Stack & Software Engineers (Mid-Senior)
          </span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((m) => {
          const item = m.data;
          const isBetter = item.difference >= 0;
          const diffDisplay = Math.abs(item.difference);

          return (
            <div
              key={m.key}
              className={`p-4 rounded-xl border transition-all ${
                isBetter
                  ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
                  : 'border-rose-200 bg-rose-50/20 hover:border-rose-300'
              }`}
            >
              {/* Metric Title & Percentile Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  isBetter
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border-rose-200'
                }`}>
                  Top {100 - (item.percentile || 50)}% ({item.percentile}th percentile)
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-3">{m.description}</p>

              {/* Side-by-side values */}
              <div className="grid grid-cols-3 gap-2 bg-white rounded-lg p-3 border border-slate-200 text-center">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block">You</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {m.format(item.user_value)}
                  </span>
                </div>

                <div className="border-x border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 block">Platform Avg</span>
                  <span className="text-base font-semibold text-slate-600">
                    {m.format(item.platform_avg)}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400 block">Delta</span>
                  <span className={`text-base font-extrabold ${isBetter ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isBetter ? `+${diffDisplay}` : `-${diffDisplay}`}
                    {m.key === 'salary' ? '' : m.key === 'study_hours' ? 'h' : '%'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cohort Insight Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>
            <strong>Key Finding:</strong> Your study consistency (+26 hrs) and negotiation execution (+$5k) are outperforming platform averages. Closing the technical screen conversion gap (+10%) will elevate your overall offer rate into the top 15% tier.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPanel;
