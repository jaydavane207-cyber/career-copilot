// frontend/src/components/Interviews/InterviewCalendar.jsx
import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Video,
  List,
  Grid3X3,
  Columns,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const InterviewCalendar = ({
  interviews = [],
  onSelectInterview,
  onAddInterview
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'day' | 'list'
  const [selectedDayInterviews, setSelectedDayInterviews] = useState(null); // { date, interviews }

  // Color-coded styling per interview type
  const getTypeBadgeClass = (type = '') => {
    switch (type.toLowerCase()) {
      case 'technical':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      case 'system_design':
        return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
      case 'behavioral':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200';
      case 'hr':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200';
    }
  };

  const getTypeDotClass = (type = '') => {
    switch (type.toLowerCase()) {
      case 'technical':
        return 'bg-blue-500';
      case 'system_design':
        return 'bg-purple-500';
      case 'behavioral':
        return 'bg-emerald-500';
      case 'hr':
      default:
        return 'bg-amber-500';
    }
  };

  // Safe Date parsing helper
  const getDateObj = (val) => {
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  // Format YYYY-MM-DD
  const toDateKey = (date) => {
    const d = getDateObj(date);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  // Group interviews by day
  const interviewsByDate = useMemo(() => {
    const map = {};
    interviews.forEach((item) => {
      const key = toDateKey(item.interviewDatetime || item.interview_datetime);
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [interviews]);

  // Navigation handlers
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() - 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setDate(d.getDate() - 1);
    }
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setDate(d.getDate() + 1);
    }
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month Grid Calculation
  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date: d,
        isCurrentMonth: false,
        key: toDateKey(d)
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        isCurrentMonth: true,
        key: toDateKey(d)
      });
    }

    // Next month padding (complete 35 or 42 grid cells)
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        isCurrentMonth: false,
        key: toDateKey(d)
      });
    }

    return days;
  }, [currentDate]);

  // Week View calculation
  const weekData = useMemo(() => {
    const curr = new Date(currentDate);
    const day = curr.getDay(); // 0 = Sun
    const startOfWeek = new Date(curr);
    startOfWeek.setDate(curr.getDate() - day);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push({
        date: d,
        key: toDateKey(d)
      });
    }
    return days;
  }, [currentDate]);

  const todayKey = toDateKey(new Date());

  const formatHeaderTitle = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }
    if (viewMode === 'week') {
      const start = weekData[0].date;
      const end = weekData[6].date;
      return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-[#E5E7EB] overflow-hidden flex flex-col">
      {/* Top Header & Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-gray-50/80 to-white">
        {/* Left: Month / Date Title & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={handlePrev}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
            {formatHeaderTitle()}
          </h2>
        </div>

        {/* Right: View Toggles & Add Interview Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Mode Selector */}
          <div className="flex items-center bg-gray-100/80 p-1 rounded-xl text-xs font-semibold text-gray-600">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'month' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-gray-900'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Month</span>
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'week' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-gray-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Week</span>
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'day' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Day</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-gray-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* Add Interview Button */}
          <button
            onClick={() => onAddInterview && onAddInterview(currentDate)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Interview</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 bg-gray-50/60 border-b border-gray-100 flex items-center gap-4 text-xs font-medium text-gray-600 overflow-x-auto select-none">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Format:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Technical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span>System Design</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Behavioral</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>HR / Screen</span>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 min-h-[500px]">
        {/* ================================================================ */}
        {/* 1. MONTH VIEW */}
        {/* ================================================================ */}
        {viewMode === 'month' && (
          <div className="flex flex-col h-full">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/70 text-center text-xs font-bold text-gray-500 py-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-gray-100">
              {monthData.map((cell) => {
                const dayInterviews = interviewsByDate[cell.key] || [];
                const isToday = cell.key === todayKey;

                return (
                  <div
                    key={cell.key}
                    onClick={() => {
                      if (dayInterviews.length > 0) {
                        setSelectedDayInterviews({ date: cell.date, interviews: dayInterviews });
                      } else {
                        onAddInterview && onAddInterview(cell.date);
                      }
                    }}
                    className={`min-h-[105px] sm:min-h-[120px] p-1.5 sm:p-2 flex flex-col transition-colors group cursor-pointer relative ${
                      cell.isCurrentMonth ? 'bg-white hover:bg-blue-50/30' : 'bg-gray-50/60 text-gray-400'
                    }`}
                  >
                    {/* Date Number Header */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transition-transform ${
                          isToday
                            ? 'bg-blue-600 text-white shadow-2xs scale-105'
                            : 'text-gray-700 group-hover:text-blue-600'
                        }`}
                      >
                        {cell.date.getDate()}
                      </span>

                      {dayInterviews.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700">
                          {dayInterviews.length}
                        </span>
                      )}
                    </div>

                    {/* Interview Event Chips */}
                    <div className="space-y-1 overflow-y-auto flex-1 max-h-[75px] sm:max-h-[90px] pr-0.5">
                      {dayInterviews.slice(0, 3).map((item) => {
                        const timeStr = getDateObj(item.interviewDatetime || item.interview_datetime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        });

                        return (
                          <div
                            key={item.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectInterview && onSelectInterview(item);
                            }}
                            className={`px-2 py-1 rounded-md text-[11px] font-bold border truncate transition-all shadow-2xs hover:scale-102 cursor-pointer flex items-center gap-1 ${getTypeBadgeClass(
                              item.interviewType || item.interview_type
                            )}`}
                            title={`${item.companyName || item.company_name} - ${item.stage} (${timeStr})`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getTypeDotClass(item.interviewType || item.interview_type)}`} />
                            <span className="truncate">
                              {item.companyName || item.company_name} – {item.stage}
                            </span>
                          </div>
                        );
                      })}

                      {dayInterviews.length > 3 && (
                        <div className="text-[10px] font-bold text-gray-500 pl-1 hover:text-blue-600">
                          +{dayInterviews.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* 2. WEEK VIEW */}
        {/* ================================================================ */}
        {viewMode === 'week' && (
          <div className="grid grid-cols-1 sm:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 min-h-[500px]">
            {weekData.map((col) => {
              const dayInterviews = interviewsByDate[col.key] || [];
              const isToday = col.key === todayKey;

              return (
                <div key={col.key} className="p-3 flex flex-col bg-white">
                  {/* Day header */}
                  <div
                    className={`pb-3 mb-3 border-b text-center rounded-xl p-2 ${
                      isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-100'
                    }`}
                  >
                    <p className="text-[11px] font-bold uppercase text-gray-500">
                      {col.date.toLocaleDateString(undefined, { weekday: 'short' })}
                    </p>
                    <p
                      className={`text-lg font-black ${
                        isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {col.date.getDate()}
                    </p>
                  </div>

                  {/* Day Events */}
                  <div className="space-y-2 flex-1">
                    {dayInterviews.length === 0 ? (
                      <div
                        onClick={() => onAddInterview && onAddInterview(col.date)}
                        className="h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/20 cursor-pointer transition-all"
                      >
                        <Plus className="w-4 h-4 mb-1" />
                        <span className="text-[11px] font-semibold">Free day</span>
                      </div>
                    ) : (
                      dayInterviews.map((item) => {
                        const d = getDateObj(item.interviewDatetime || item.interview_datetime);
                        const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return (
                          <div
                            key={item.id}
                            onClick={() => onSelectInterview && onSelectInterview(item)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer shadow-2xs hover:shadow-xs transition-all ${getTypeBadgeClass(
                              item.interviewType || item.interview_type
                            )}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-extrabold truncate text-gray-900">
                                {item.companyName || item.company_name}
                              </span>
                              <span className="text-[10px] font-bold text-gray-500 flex items-center gap-0.5">
                                <Clock className="w-3 h-3" />
                                {timeStr}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-700 truncate font-medium">
                              {item.roleTitle || item.role_title}
                            </p>
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 text-[10px]">
                              <span className="font-semibold">{item.stage}</span>
                              <span className="capitalize">{item.mode || 'Online'}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================ */}
        {/* 3. DAY VIEW */}
        {/* ================================================================ */}
        {viewMode === 'day' && (
          <div className="p-6 max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <div>
                <h3 className="text-base font-extrabold text-blue-900">
                  {currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
                <p className="text-xs text-blue-700">
                  {(interviewsByDate[toDateKey(currentDate)] || []).length} scheduled session(s)
                </p>
              </div>
              <button
                onClick={() => onAddInterview && onAddInterview(currentDate)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule Here</span>
              </button>
            </div>

            <div className="space-y-3">
              {(interviewsByDate[toDateKey(currentDate)] || []).length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-3">
                  <CalendarIcon className="w-10 h-10 text-gray-400 mx-auto" />
                  <p className="text-sm font-bold text-gray-700">No interviews scheduled for this day</p>
                  <button
                    onClick={() => onAddInterview && onAddInterview(currentDate)}
                    className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700"
                  >
                    + Schedule An Interview
                  </button>
                </div>
              ) : (
                (interviewsByDate[toDateKey(currentDate)] || []).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectInterview && onSelectInterview(item)}
                    className="p-4 rounded-2xl border border-gray-200 hover:border-blue-400 bg-white shadow-2xs hover:shadow-sm transition-all cursor-pointer flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-base flex-shrink-0">
                        {(item.companyName || item.company_name || 'C')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-extrabold text-gray-900">
                            {item.companyName || item.company_name}
                          </h4>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getTypeBadgeClass(item.interviewType || item.interview_type)}`}>
                            {item.stage}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">
                          {item.roleTitle || item.role_title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {getDateObj(item.interviewDatetime || item.interview_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({item.durationMinutes || 60}m)
                          </span>
                          <span className="flex items-center gap-1 capitalize">
                            <Video className="w-3.5 h-3.5" />
                            {item.mode || 'Online'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* 4. LIST VIEW */}
        {/* ================================================================ */}
        {viewMode === 'list' && (
          <div className="p-4 sm:p-6 space-y-3">
            {interviews.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-3">
                <CalendarIcon className="w-10 h-10 text-gray-400 mx-auto" />
                <p className="text-sm font-bold text-gray-700">No interviews logged yet</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Keep track of all technical rounds, system design loops, and recruiter screens in one place.
                </p>
                <button
                  onClick={() => onAddInterview && onAddInterview()}
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 cursor-pointer"
                >
                  Schedule Your First Interview
                </button>
              </div>
            ) : (
              interviews.map((item) => {
                const d = getDateObj(item.interviewDatetime || item.interview_datetime);
                const dateStr = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectInterview && onSelectInterview(item)}
                    className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 bg-white shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base flex-shrink-0 border border-blue-200">
                        {(item.companyName || item.company_name || 'C')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-gray-900">
                            {item.companyName || item.company_name}
                          </h4>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-700 font-semibold">{item.roleTitle || item.role_title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeBadgeClass(item.interviewType || item.interview_type)}`}>
                            {item.stage}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
                          <span>{dateStr} at {timeStr}</span>
                          <span>•</span>
                          <span>{item.durationMinutes || 60} mins</span>
                          <span>•</span>
                          <span className="capitalize">{item.mode || 'Online'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        item.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {item.status || 'upcoming'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Small Modal: Day list popup */}
      {selectedDayInterviews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {selectedDayInterviews.date.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedDayInterviews.interviews.length} session(s) scheduled
                </p>
              </div>
              <button
                onClick={() => setSelectedDayInterviews(null)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedDayInterviews.interviews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedDayInterviews(null);
                    onSelectInterview && onSelectInterview(item);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer hover:shadow-xs transition-all ${getTypeBadgeClass(
                    item.interviewType || item.interview_type
                  )}`}
                >
                  <div className="flex items-center justify-between font-bold mb-0.5">
                    <span>{item.companyName || item.company_name}</span>
                    <span>
                      {getDateObj(item.interviewDatetime || item.interview_datetime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 truncate">{item.roleTitle || item.role_title} – {item.stage}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  const d = selectedDayInterviews.date;
                  setSelectedDayInterviews(null);
                  onAddInterview && onAddInterview(d);
                }}
                className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another On This Day</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewCalendar;
