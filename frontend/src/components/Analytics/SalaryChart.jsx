// frontend/src/components/Analytics/SalaryChart.jsx
import React from 'react';
import { DollarSign, TrendingUp, Sparkles, Target, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const SalaryChart = ({ salaryData, marketData }) => {
  const userSalary = salaryData?.avg_final_offer || 180000;
  const p25 = marketData?.percentile_25 || 160000;
  const p50 = marketData?.percentile_50 || 180000;
  const p75 = marketData?.percentile_75 || 200000;
  const p90 = marketData?.percentile_90 || 225000;

  // Calculate position percentage along 120k to 240k spectrum
  const minVal = 120000;
  const maxVal = 240000;
  const getPct = (val) => Math.min(100, Math.max(0, Math.round(((val - minVal) / (maxVal - minVal)) * 100)));

  const userPct = getPct(userSalary);
  const p25Pct = getPct(p25);
  const p50Pct = getPct(p50);
  const p75Pct = getPct(p75);
  const p90Pct = getPct(p90);

  const negotiationPotential = Math.max(0, p75 - userSalary);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Salary Trends & Negotiation Analytics</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Market compensation benchmark for {marketData?.role || 'Senior SDE'} ({marketData?.location || 'Mountain View, CA'})
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium block">Market Percentile</span>
          <span className="text-base font-bold text-emerald-600">Top {100 - (salaryData?.percentile || 60)}% (60th)</span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Offers Received</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{salaryData?.total_offers || 3}</p>
          <span className="text-[11px] text-slate-400">All negotiated upwards</span>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Avg Initial Offer</span>
          <p className="text-xl font-bold text-slate-900 mt-1">
            ${(salaryData?.avg_starting_offer || 165000).toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">Base salary before leverage</span>
        </div>

        <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl">
          <span className="text-xs text-emerald-700 font-medium">Avg Final Offer</span>
          <p className="text-xl font-bold text-emerald-900 mt-1">
            ${(salaryData?.avg_final_offer || 180000).toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold">
            +{(salaryData?.negotiation_percentage || 9.1)}% negotiated
          </span>
        </div>

        <div className="p-3.5 bg-indigo-50 border border-indigo-200/80 rounded-xl">
          <span className="text-xs text-indigo-700 font-medium">Avg Negotiation Gain</span>
          <p className="text-xl font-bold text-indigo-900 mt-1">
            +${(salaryData?.avg_negotiation || 15000).toLocaleString()}
          </p>
          <span className="text-[11px] text-indigo-700 font-medium">Per offer closed</span>
        </div>
      </div>

      {/* Percentile Distribution Box Plot Visualization */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Market Compensation Spectrum (25th - 90th Percentile)
          </span>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            Next Target: ${salaryData?.predicted_next_salary ? salaryData.predicted_next_salary.toLocaleString() : '185,000'}
          </span>
        </div>

        {/* Visual Percentile Gradient Bar */}
        <div className="relative pt-8 pb-10">
          {/* Main Spectrum Line */}
          <div className="h-3 bg-slate-200 rounded-full relative overflow-hidden">
            {/* 25th - 75th Interquartile Range Fill */}
            <div
              className="absolute top-0 bottom-0 bg-blue-300/80"
              style={{ left: `${p25Pct}%`, width: `${p75Pct - p25Pct}%` }}
            ></div>
          </div>

          {/* 25th Percentile Marker */}
          <div className="absolute top-4 text-center transform -translate-x-1/2" style={{ left: `${p25Pct}%` }}>
            <div className="w-1.5 h-6 bg-slate-400 mx-auto rounded"></div>
            <span className="text-[10px] text-slate-500 font-semibold block mt-1">25th: ${Math.round(p25 / 1000)}k</span>
          </div>

          {/* 50th Median Marker */}
          <div className="absolute top-4 text-center transform -translate-x-1/2" style={{ left: `${p50Pct}%` }}>
            <div className="w-2 h-7 bg-slate-600 mx-auto rounded"></div>
            <span className="text-[11px] text-slate-700 font-bold block mt-1">Median: ${Math.round(p50 / 1000)}k</span>
          </div>

          {/* 75th Percentile Marker */}
          <div className="absolute top-4 text-center transform -translate-x-1/2" style={{ left: `${p75Pct}%` }}>
            <div className="w-1.5 h-6 bg-slate-400 mx-auto rounded"></div>
            <span className="text-[10px] text-slate-500 font-semibold block mt-1">75th: ${Math.round(p75 / 1000)}k</span>
          </div>

          {/* 90th Percentile Marker */}
          <div className="absolute top-4 text-center transform -translate-x-1/2" style={{ left: `${p90Pct}%` }}>
            <div className="w-1.5 h-6 bg-slate-400 mx-auto rounded"></div>
            <span className="text-[10px] text-slate-500 font-semibold block mt-1">90th: ${Math.round(p90 / 1000)}k</span>
          </div>

          {/* User's Exact Pin Marker */}
          <div
            className="absolute top-0 text-center transform -translate-x-1/2 z-20 flex flex-col items-center"
            style={{ left: `${userPct}%` }}
          >
            <div className="bg-emerald-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded shadow-md border border-white">
              You: ${Math.round(userSalary / 1000)}k
            </div>
            <div className="w-3.5 h-3.5 bg-emerald-600 rounded-full border-2 border-white shadow mt-0.5"></div>
          </div>
        </div>

        {/* Negotiation Potential Callout */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-slate-600 font-medium">Negotiation Opportunity to 75th Percentile:</span>
            <span className="font-bold text-slate-900">+${negotiationPotential.toLocaleString()}</span>
          </div>
          <span className="text-emerald-600 font-semibold hidden sm:inline">
            Trend: Your salary negotiation skills are consistently improving
          </span>
        </div>
      </div>

      {/* Offer Negotiation Track Record */}
      {salaryData?.offers_history && salaryData.offers_history.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Documented Negotiation History
          </h4>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Company</th>
                  <th className="p-3">Initial Offer</th>
                  <th className="p-3">Negotiated Offer</th>
                  <th className="p-3">Total Increase</th>
                  <th className="p-3">Lift (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {salaryData.offers_history.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{row.company}</td>
                    <td className="p-3 text-slate-600">${row.start.toLocaleString()}</td>
                    <td className="p-3 font-semibold text-emerald-700">${row.final.toLocaleString()}</td>
                    <td className="p-3 text-emerald-600">+${row.negotiated.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        +{row.increasePct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryChart;
