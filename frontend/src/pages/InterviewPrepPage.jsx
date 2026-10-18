// frontend/src/pages/InterviewPrepPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Building2,
  Briefcase,
  Target,
  Code2,
  Mic,
  BookOpen,
  Share2,
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import interviewService from '../services/interviewService';
import companyService from '../services/companyService';
import AnswerPracticeCard from '../components/Interviews/AnswerPracticeCard';

export const InterviewPrepPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prepPlan, setPrepPlan] = useState(null);
  const [companyInsights, setCompanyInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [checklistState, setChecklistState] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  });

  const loadPrepPlan = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await interviewService.getPrepPlan(id);
      if (res && res.data) {
        setPrepPlan(res.data);
        // Mark initially completed tasks
        const initialCompleted = new Set();
        (res.data.dailyPlan || []).forEach((day) => {
          (day.tasks || []).forEach((t) => {
            if (t.completed) initialCompleted.add(t.id || t.label);
          });
        });
        setCompletedTasks(initialCompleted);

        // Fetch company specific insights if available
        if (res.data.company) {
          try {
            const compRes = await companyService.getAllCompanies({ search: res.data.company });
            const matched = (compRes?.companies || []).find((c) =>
              c.name.toLowerCase().includes(res.data.company.toLowerCase())
            );
            if (matched) {
              const [details, qRes] = await Promise.all([
                companyService.getCompanyDetails(matched.id).catch(() => null),
                companyService.getCompanyQuestions(matched.id, { limit: 4 }).catch(() => null)
              ]);
              setCompanyInsights({
                info: details?.company || matched,
                questions: qRes?.questions || []
              });
            }
          } catch (e) {
            // non-fatal
          }
        }
      } else {
        throw new Error('Prep plan data not found');
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to load interview prep plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadPrepPlan();
  }, [id]);

  const handleTaskToggle = async (task) => {
    const taskId = task.id || task.label;
    const isNowDone = !completedTasks.has(taskId);

    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (isNowDone) next.add(taskId);
      else next.delete(taskId);
      return next;
    });

    if (isNowDone) {
      try {
        await interviewService.logPrepTask(id, {
          taskType: task.type || 'prep_material',
          description: task.label
        });
      } catch (e) {
        console.error('Failed to log task:', e);
      }
    }
  };

  const handleChecklistToggle = (index) => {
    setChecklistState((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-44 bg-gray-200 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-100 rounded-2xl" />
          <div className="h-96 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !prepPlan) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Failed to load interview prep plan</h2>
        <p className="text-sm text-gray-500">{error || 'Interview record not found.'}</p>
        <button
          onClick={() => navigate('/interviews/calendar')}
          className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700"
        >
          Return to Interviews Calendar
        </button>
      </div>
    );
  }

  const interviewDate = new Date(prepPlan.interviewDatetime);
  const formattedDateTime = `${interviewDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })} at ${interviewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  // Calculate dynamic readiness
  const totalTasks = prepPlan.stats?.totalTasks || 1;
  const completedCount = completedTasks.size;
  const calculatedReadiness = Math.min(
    98,
    Math.max(50, Math.round((completedCount / totalTasks) * 35) + 60)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/interviews/calendar')}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Interviews Calendar</span>
        </button>

        <div className="flex items-center gap-2">
          {prepPlan.quickLinks?.calendarEvent && (
            <a
              href={prepPlan.quickLinks.calendarEvent}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5 transition-colors"
            >
              <span>+ Add to Google Calendar</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl text-white shadow-sm flex-shrink-0 border border-white/20">
              {prepPlan.company ? prepPlan.company[0].toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
                  {prepPlan.stage}
                </span>
                <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-yellow-400 text-yellow-950 shadow-2xs">
                  ⏰ {prepPlan.timeUntil}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-black/20 text-blue-100 capitalize">
                  {prepPlan.interviewType?.replace('_', ' ')} format
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {prepPlan.company} Preparation Plan
              </h1>
              <p className="text-sm text-blue-100 mt-0.5 font-medium">
                Target Role: <strong>{prepPlan.role}</strong> • {formattedDateTime} ({prepPlan.durationMinutes} mins)
              </p>
            </div>
          </div>

          {/* Quick Meet Link Button */}
          {prepPlan.meetLink && (
            <a
              href={prepPlan.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-white hover:bg-blue-50 text-blue-800 font-extrabold text-sm shadow-md transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer active:scale-98"
            >
              <Video className="w-4 h-4 text-blue-600" />
              <span>Join Video Call</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            </a>
          )}
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Daily Prep Plan & AI Practice (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Daily Prep Plan Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Smart Daily Preparation Schedule
                  </h3>
                  <p className="text-xs text-gray-500">
                    Tailored specifically for your remaining time ({prepPlan.timeUntil})
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                {completedCount} / {totalTasks} Tasks Done
              </span>
            </div>

            {/* Daily Days Loop */}
            <div className="space-y-6">
              {(prepPlan.dailyPlan || []).map((day, dIdx) => (
                <div key={day.date || dIdx} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>{day.dayLabel}</span>
                    </h4>
                    {day.focus && (
                      <span className="text-[11px] text-gray-500 font-medium italic">
                        Focus: {day.focus}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {(day.tasks || []).map((task) => {
                      const taskId = task.id || task.label;
                      const isDone = completedTasks.has(taskId);

                      return (
                        <div
                          key={taskId}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                            isDone
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-gray-50/80 border-gray-200 hover:border-blue-300 hover:bg-white'
                          }`}
                        >
                          <div
                            onClick={() => handleTaskToggle(task)}
                            className="flex items-start sm:items-center gap-3 cursor-pointer select-none flex-1 min-w-0"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0 transition-colors" />
                            )}
                            <div className="min-w-0">
                              <p className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                {task.label}
                              </p>
                              {task.estimatedMinutes && (
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  ~{task.estimatedMinutes} mins • {task.category || 'General Prep'}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                            {task.link && (
                              <Link
                                to={task.link}
                                className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-600 border border-gray-200 hover:border-blue-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                              >
                                <span>Go to Practice</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company-Specific Interview Process & Common Questions */}
          {companyInsights && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">
                      {prepPlan.company} Interview Intelligence
                    </h3>
                    <p className="text-xs text-gray-500">
                      Process rounds, difficulty rating, and high-frequency questions
                    </p>
                  </div>
                </div>

                <Link
                  to={`/company-prep?company=${encodeURIComponent(prepPlan.company)}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Full Company Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Rounds & Difficulty Pill */}
              {companyInsights.info && (
                <div className="flex items-center gap-3 flex-wrap text-xs">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 font-bold rounded-lg border border-purple-200">
                    Difficulty: {companyInsights.info.interview_difficulty || companyInsights.info.interviewDifficulty || 'Hard'}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200">
                    Typical Rounds: {companyInsights.info.average_interview_rounds || companyInsights.info.averageInterviewRounds || 4} Loops
                  </span>
                </div>
              )}

              {/* Questions */}
              {companyInsights.questions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                    Top Questions Asked at {prepPlan.company}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {companyInsights.questions.map((q, qIdx) => (
                      <div
                        key={q.id || qIdx}
                        className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-gray-900 block truncate">"{q.question}"</span>
                          <span className="text-[10px] text-gray-500">{q.category || 'Technical'} • {q.difficulty || 'Medium'}</span>
                        </div>
                        <Link
                          to={`/company-prep?tab=questions&search=${encodeURIComponent(prepPlan.company)}`}
                          className="text-blue-600 hover:text-blue-800 font-bold text-[11px] flex-shrink-0"
                        >
                          Practice
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Answer Practice Component */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Answer Feedback Practice</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Practice high-frequency interview questions for {prepPlan.company} and receive real-time hiring bar scoring.
                </p>
              </div>
            </div>

            <AnswerPracticeCard
              question={`Tell me about a time you led a challenging project at scale for a ${prepPlan.role} role.`}
              role={prepPlan.role}
              company={prepPlan.company}
              onSaveAsNote={async (noteContent) => {
                try {
                  const currentNotes = prepPlan.notes || '';
                  await interviewService.updateInterview(id, {
                    notes: `${currentNotes}\n\n[AI Answer Log]:\n${noteContent}`
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
            />
          </div>
        </div>

        {/* Right Column: Readiness Stats, Checklist, Quick Links (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Readiness Score Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Interview Readiness Score</span>
            </h4>

            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white rounded-xl border border-blue-200/80">
              <div>
                <span className="text-3xl font-black text-blue-700">
                  {calculatedReadiness}%
                </span>
                <p className="text-xs font-bold text-gray-700 mt-0.5">
                  {calculatedReadiness >= 80 ? 'High Confidence' : 'Preparation in Progress'}
                </p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>Tasks Done: <strong>{completedCount}/{totalTasks}</strong></p>
                <p>Urgency: <strong className="capitalize">{prepPlan.urgencyLevel}</strong></p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${calculatedReadiness}%` }}
              />
            </div>

            {prepPlan.stats?.primaryWeakSkill && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Target className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Focus Area Identified</p>
                  <p className="text-[11px] text-amber-800">
                    Your biggest skill gap is <strong>{prepPlan.stats.primaryWeakSkill}</strong>. We prioritized this in your daily plan.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* General Pre-Interview Checklist */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Pre-Interview Day Checklist</span>
            </h4>

            <div className="space-y-2.5">
              {(prepPlan.checklist || []).map((item, idx) => {
                const isChecked = checklistState[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => handleChecklistToggle(idx)}
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-gray-50/70 border-gray-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={isChecked ? 'line-through text-gray-400 font-medium' : 'font-medium'}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Integration Box */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Integrated Modules</span>
            </h4>

            <div className="space-y-2">
              <Link
                to={`/company-prep?company=${encodeURIComponent(prepPlan.company)}`}
                className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 bg-gray-50/50 hover:bg-blue-50/30 flex items-center justify-between text-xs font-bold text-gray-800 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>{prepPlan.company} Process & Questions</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </Link>

              <Link
                to="/mock-interview"
                className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 bg-gray-50/50 hover:bg-blue-50/30 flex items-center justify-between text-xs font-bold text-gray-800 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-600" />
                  <span>Full AI Mock Interview Loop</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </Link>

              <Link
                to="/coding"
                className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 bg-gray-50/50 hover:bg-blue-50/30 flex items-center justify-between text-xs font-bold text-gray-800 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <span>Coding & Algorithms Practice</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </Link>

              <Link
                to="/skills"
                className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 bg-gray-50/50 hover:bg-blue-50/30 flex items-center justify-between text-xs font-bold text-gray-800 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>Review Skill Gap Matrix</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrepPage;
