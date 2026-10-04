// frontend/src/components/Dashboard/ReadinessBreakdownChart.jsx
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Layers, Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc, p) => acc + (typeof p.value === 'number' ? p.value : 0), 0);
    return (
      <div className="bg-slate-900 text-white rounded-xl p-3.5 shadow-xl border border-slate-800 text-xs space-y-2 max-w-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-bold text-slate-200">Readiness Contribution</span>
          <span className="font-black text-emerald-400">{total.toFixed(1)} / 100 pts</span>
        </div>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-300">{entry.name}:</span>
              </div>
              <span className="font-bold text-white">+{Number(entry.value).toFixed(1)} pts</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ReadinessBreakdownChart = ({
  breakdown = [],
  chartStackedData = [],
  readinessScore = 0
}) => {
  // Fallback data if chartStackedData is not passed
  const chartData = (chartStackedData && chartStackedData.length > 0)
    ? chartStackedData
    : [
        {
          name: 'Readiness Contributions',
          'Resume Match': breakdown.find(b => b.name === 'Resume Match')?.contribution || 0,
          'Skills Gap': breakdown.find(b => b.name === 'Skills Gap')?.contribution || 0,
          'Study Progress': breakdown.find(b => b.name === 'Study Progress')?.contribution || 0,
          'Interview Practice': breakdown.find(b => b.name === 'Interview Practice')?.contribution || 0,
          total: readinessScore
        }
      ];

  const modules = [
    { key: 'Resume Match', weight: '20%', color: '#3B82F6', maxPts: 20 },
    { key: 'Skills Gap', weight: '30%', color: '#10B981', maxPts: 30 },
    { key: 'Study Progress', weight: '25%', color: '#8B5CF6', maxPts: 25 },
    { key: 'Interview Practice', weight: '25%', color: '#F59E0B', maxPts: 25 }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Readiness Score Breakdown
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Stacked contributions showing points contributed by each preparation module to your {readinessScore}% score.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>Total: <strong className="text-indigo-600 font-black">{readinessScore}</strong> / 100</span>
        </div>
      </div>

      {/* Recharts Stacked Horizontal Bar Chart */}
      <div className="w-full h-24 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748B' }}
              tickFormatter={(v) => `${v} pts`}
            />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Resume Match" stackId="readiness" fill="#3B82F6" radius={[4, 0, 0, 4]} />
            <Bar dataKey="Skills Gap" stackId="readiness" fill="#10B981" />
            <Bar dataKey="Study Progress" stackId="readiness" fill="#8B5CF6" />
            <Bar dataKey="Interview Practice" stackId="readiness" fill="#F59E0B" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Module Contributions Pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
        {modules.map((m) => {
          const item = breakdown.find(b => b.name === m.key) || {};
          const contribution = item.contribution !== undefined ? item.contribution : 0;
          const score = item.score !== undefined ? item.score : 0;

          return (
            <div
              key={m.key}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="font-bold text-slate-800">{m.key}</span>
                </div>
                <span className="font-extrabold text-slate-900">+{contribution} pts</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Score: {score}%</span>
                <span>Max: {m.maxPts} pts ({m.weight})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadinessBreakdownChart;
