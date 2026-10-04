// frontend/src/components/StudyPlanner/ProgressChart.jsx
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { studyService } from '../../services/studyService';

export const ProgressChart = ({ targetDate = 'Target Date' }) => {
  const [progressData, setProgressData] = useState(null);
  const [chartPoints, setChartPoints] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await studyService.getProgress();
        if (res.success && res.progress) {
          setProgressData(res.progress);
          const currentPct = res.progress.percentage || 0;

          // Generate dynamic curve reflecting user's progress vs expected
          const points = [
            { day: 'Week 1', actual: Math.round(currentPct * 0.2), expected: 15 },
            { day: 'Week 2', actual: Math.round(currentPct * 0.45), expected: 30 },
            { day: 'Week 3', actual: Math.round(currentPct * 0.7), expected: 50 },
            { day: 'Week 4', actual: Math.round(currentPct * 0.85), expected: 70 },
            { day: 'Current', actual: currentPct, expected: 80 }
          ];
          setChartPoints(points);
        }
      } catch (e) {
        console.error('Failed to load study progress:', e);
      }
    };
    fetchProgress();
  }, []);

  const isOnTrack = progressData?.isOnTrack !== false;

  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] space-y-4">
      {/* H2: "Your Progress" */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
        <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px]">
          Your Progress Velocity
        </h2>
        <span className="text-[12px] text-[#6B7280]">
          Actual vs Target Timeline
        </span>
      </div>

      <div className="h-[220px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} domain={[0, 100]} unit="%" />
            <Tooltip
              formatter={(val) => [`${val}%`, '']}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            {/* Blue line: Actual progress */}
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Completion"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#3B82F6' }}
              activeDot={{ r: 6 }}
            />
            {/* Green dotted line: Expected progress */}
            <Line
              type="monotone"
              dataKey="expected"
              name="Benchmark Target"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trend text */}
      <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[13px]">
        <span className={`font-semibold ${isOnTrack ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {isOnTrack ? `✓ On pace to finish by ${targetDate}` : `⚠️ Behind schedule for ${targetDate}`}
        </span>
        <span className="text-[#6B7280] text-[12px]">
          {progressData?.completedTasks || 0} / {progressData?.totalTasks || 0} tasks finished
        </span>
      </div>
    </div>
  );
};

export default ProgressChart;
