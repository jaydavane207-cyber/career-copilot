// frontend/src/components/MockInterview/StatisticsDashboard.jsx
import React, { useMemo } from 'react';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  PieChart as PieIcon,
  BarChart2,
  Calendar,
  CheckCircle2,
  Star,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { formatDate } from '../../utils/formatters';

const TRACK_COLORS = {
  Behavioral: '#10B981', // Emerald
  Technical: '#4F46E5',  // Indigo
  'System Design': '#8B5CF6' // Purple
};

export const StatisticsDashboard = ({ history = [], onStartTrack }) => {
  // Aggregate KPIs
  const totalInterviews = history.length;

  const totalQuestions = useMemo(() => {
    return history.reduce((acc, curr) => {
      const qCount = curr.sessionStats?.totalQuestions || (curr.answers || curr.questions || []).length || 0;
      return acc + qCount;
    }, 0);
  }, [history]);

  const overallAvgConfidence = useMemo(() => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, curr) => {
      const c = curr.sessionStats?.avgConfidence !== undefined ? curr.sessionStats.avgConfidence : 3;
      return acc + parseFloat(c);
    }, 0);
    return Number((sum / history.length).toFixed(1));
  }, [history]);

  // Confidence trend data over time (sorted chronologically)
  const confidenceTrendData = useMemo(() => {
    if (history.length === 0) return [];
    return [...history]
      .reverse()
      .map((item, index) => {
        const dateStr = item.completedAt || item.date || item.createdAt;
        const formatted = dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Sess ${index + 1}`;
        const conf = item.sessionStats?.avgConfidence !== undefined ? parseFloat(item.sessionStats.avgConfidence) : 3.5;
        const score = Math.round(item.overallScore || 0);

        return {
          sessionIndex: index + 1,
          name: formatted,
          confidence: conf,
          score,
          track: item.interviewType || 'General'
        };
      });
  }, [history]);

  // Question track distribution data
  const trackDistributionData = useMemo(() => {
    const counts = {
      Behavioral: 0,
      Technical: 0,
      'System Design': 0
    };

    history.forEach(item => {
      const type = item.interviewType || 'Technical';
      if (counts[type] !== undefined) {
        counts[type]++;
      } else {
        counts.Technical++;
      }
    });

    return [
      { name: 'Behavioral', count: counts.Behavioral, color: TRACK_COLORS.Behavioral },
      { name: 'Technical', count: counts.Technical, color: TRACK_COLORS.Technical },
      { name: 'System Design', count: counts['System Design'], color: TRACK_COLORS['System Design'] }
    ].filter(d => d.count > 0);
  }, [history]);

  // Weak Question Topics (Questions or categories with confidence <= 2.5 or low scores)
  const weakTopicsList = useMemo(() => {
    const weakMap = {};

    history.forEach(session => {
      const answers = session.answers || session.questions || [];
      answers.forEach(a => {
        const conf = parseInt(a.confidence, 10) || 3;
        const score = parseInt(a.score, 10) || 0;
        const isWeak = conf <= 2 || score < 50;

        if (isWeak) {
          const category = a.category || 'General';
          if (!weakMap[category]) {
            weakMap[category] = {
              category,
              track: a.type || session.interviewType || 'Technical',
              count: 0,
              avgConfidenceSum: 0,
              sampleQuestion: a.question
            };
          }
          weakMap[category].count++;
          weakMap[category].avgConfidenceSum += conf;
        }
      });
    });

    return Object.values(weakMap)
      .map(item => ({
        ...item,
        avgConfidence: Number((item.avgConfidenceSum / item.count).toFixed(1))
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <BarChart2 className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">No Interview Analytics Yet</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Complete at least one mock interview to unlock confidence trend graphs, track breakdowns, and targeted weak topic analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Interview Analytics & Trends</h3>
        <p className="text-xs text-slate-500">Track your interview readiness, pacing, and confidence progression across tracks.</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Interviews */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Interviews Completed</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalInterviews}</p>
          <span className="text-[10px] text-slate-400">Total simulated sessions</span>
        </div>

        {/* Questions Practiced */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Questions Practiced</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalQuestions}</p>
          <span className="text-[10px] text-slate-400">Unique answer attempts</span>
        </div>

        {/* Overall Confidence */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Overall Avg Confidence</span>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-black text-slate-900">{overallAvgConfidence}</p>
            <span className="text-xs font-bold text-slate-400">/ 5.0 ★</span>
          </div>
          <span className="text-[10px] text-slate-400">Self-assessment rating</span>
        </div>

        {/* Top Track */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Most Active Track</span>
          </div>
          <p className="text-base font-black text-slate-900 truncate">
            {trackDistributionData[0]?.name || 'Technical'}
          </p>
          <span className="text-[10px] text-slate-400">
            {trackDistributionData[0]?.count || 0} sessions completed
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Confidence Trend Chart (LineChart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">Average Confidence Trend</h4>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Rating Scale (1.0 to 5.0 Stars)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={confidenceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val, name) => [
                    name === 'confidence' ? `${val} / 5.0 Stars` : `${val}%`,
                    name === 'confidence' ? 'Avg Confidence' : 'Score'
                  ]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                  name="confidence"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Track Breakdown (PieChart) */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">Track Distribution</h4>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trackDistributionData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {trackDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} sessions`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {trackDistributionData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.count} sessions</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weak Question Topics / Targeted Improvement Recommendations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-sm font-bold text-slate-900">Weak Topics & Identified Knowledge Gaps</h4>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Questions rated ≤ 2 Stars</span>
        </div>

        {weakTopicsList.length === 0 ? (
          <div className="p-6 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center text-xs text-emerald-800 space-y-1">
            <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600" />
            <p className="font-bold">Outstanding Confidence Across All Tracks!</p>
            <p className="text-emerald-700 text-[11px]">No low-confidence question topics detected yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {weakTopicsList.map((weak, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {weak.track}
                    </span>
                    <span className="text-[10px] font-bold text-rose-600">
                      {weak.count} {weak.count === 1 ? 'flagged answer' : 'flagged answers'}
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-xs">{weak.category}</h5>
                  <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                    "{weak.sampleQuestion}"
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-amber-200/60">
                  <span className="text-[10px] font-semibold text-slate-500">
                    Avg Confidence: <strong className="text-amber-700">{weak.avgConfidence} / 5.0</strong>
                  </span>
                  {onStartTrack && (
                    <button
                      onClick={() => onStartTrack(weak.track)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                    >
                      Practice
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsDashboard;
