// frontend/src/components/CodingTracker/ProblemsChart.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const COLORS = [
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#14b8a6'  // Teal
];

export const ProblemsChart = ({ distribution = {}, topicBreakdown = [] }) => {
  // Format data for Recharts
  let chartData = [];
  if (Array.isArray(topicBreakdown) && topicBreakdown.length > 0) {
    chartData = topicBreakdown.slice(0, 8).map(t => ({
      name: t.topic,
      Solved: t.solved,
      Struggled: t.struggled || (t.total - t.solved),
      Total: t.total,
      successRate: t.successRate
    }));
  } else {
    chartData = Object.entries(distribution)
      .slice(0, 8)
      .map(([topic, count]) => ({
        name: topic,
        Total: count,
        Solved: count
      }));
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
          <p className="font-bold text-slate-100">{label}</p>
          <div className="flex items-center gap-2 text-indigo-300">
            <span>Total Logged:</span>
            <span className="font-bold text-white">{data.Total}</span>
          </div>
          {data.Solved !== undefined && (
            <div className="flex items-center gap-2 text-emerald-400">
              <span>Solved:</span>
              <span className="font-bold text-white">{data.Solved}</span>
            </div>
          )}
          {data.Struggled !== undefined && data.Struggled > 0 && (
            <div className="flex items-center gap-2 text-rose-400">
              <span>Struggled:</span>
              <span className="font-bold text-white">{data.Struggled}</span>
            </div>
          )}
          {data.successRate !== undefined && (
            <div className="flex items-center gap-2 text-amber-300 pt-0.5 border-t border-slate-700">
              <span>Success Rate:</span>
              <span className="font-bold text-white">{data.successRate}%</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Problems by Topic</h4>
            <p className="text-[11px] text-slate-400">Algorithmic domain distribution</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
          Top Topics
        </span>
      </div>

      {chartData.length > 0 ? (
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#64748b' }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={35}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Solved" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              {chartData.some(d => d.Struggled > 0) && (
                <Bar dataKey="Struggled" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-xs text-slate-400 italic">
          No topic data logged yet. Practice a problem to populate graph!
        </div>
      )}
    </div>
  );
};

export default ProblemsChart;
