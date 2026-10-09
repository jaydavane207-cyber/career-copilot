"use client";

import React, { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CalendarMonthProps {
  interviews: any[];
  onSelectDay: (date: Date, dayInterviews: any[]) => void;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = ({
  interviews,
  onSelectDay,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const interviewsByDay = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const interview of interviews) {
      const dateKey = format(new Date(interview.scheduledStart), "yyyy-MM-dd");
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(interview);
    }
    return map;
  }, [interviews]);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Month Header & Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleToday}
            className="h-8 text-xs font-semibold px-2.5"
          >
            Today
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePrevMonth}
            className="h-8 w-8 p-0"
            title="Previous Month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleNextMonth}
            className="h-8 w-8 p-0"
            title="Next Month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDayNames.map((d) => (
          <div
            key={d}
            className="py-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayInterviews = interviewsByDay.get(dateKey) || [];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);
          const hasEvents = dayInterviews.length > 0;

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDay(day, dayInterviews)}
              className={`relative flex min-h-[75px] flex-col items-center justify-between rounded-lg p-1.5 transition text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !isCurrentMonth
                  ? "bg-slate-50/50 text-slate-300 dark:bg-slate-950/40 dark:text-slate-700"
                  : isCurrentDay
                  ? "bg-blue-50/70 border border-blue-300 dark:bg-blue-950/40 dark:border-blue-800"
                  : "bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    isCurrentDay
                      ? "bg-blue-600 text-white font-bold"
                      : isCurrentMonth
                      ? "text-slate-800 dark:text-slate-200"
                      : "text-slate-400 dark:text-slate-600"
                  }`}
                >
                  {format(day, "d")}
                </span>

                {hasEvents && (
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {dayInterviews.length}
                  </span>
                )}
              </div>

              {/* Event indicators */}
              <div className="w-full mt-1 space-y-1">
                {dayInterviews.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="truncate rounded bg-blue-100/70 px-1 py-0.5 text-[10px] font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                    title={`${item.application.company}: ${item.title}`}
                  >
                    {item.application.company}
                  </div>
                ))}
                {dayInterviews.length > 2 && (
                  <div className="text-[9px] font-semibold text-slate-400 pl-1">
                    +{dayInterviews.length - 2} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
