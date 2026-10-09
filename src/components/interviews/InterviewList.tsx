"use client";

import React, { useMemo } from "react";
import { InterviewCard } from "./InterviewCard";
import {
  isToday,
  isTomorrow,
  isThisWeek,
  isPast,
  startOfToday,
} from "date-fns";
import { CalendarX, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface InterviewListProps {
  interviews: any[];
  mode: "upcoming" | "history";
  searchQuery?: string;
  typeFilter?: string;
  onEdit: (interview: any) => void;
  onComplete: (interview: any) => void;
  onDelete: (id: string) => void;
  onAddInterview: () => void;
}

export const InterviewList: React.FC<InterviewListProps> = ({
  interviews,
  mode,
  searchQuery = "",
  typeFilter = "ALL",
  onEdit,
  onComplete,
  onDelete,
  onAddInterview,
}) => {
  // Filter by query and type
  const filtered = useMemo(() => {
    return interviews.filter((item) => {
      if (typeFilter !== "ALL" && item.type !== typeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const comp = item.application?.company?.toLowerCase() || "";
        const role = item.application?.role?.toLowerCase() || "";
        const title = item.title?.toLowerCase() || "";
        if (!comp.includes(query) && !role.includes(query) && !title.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [interviews, searchQuery, typeFilter]);

  // If in history mode, simply sort by scheduledStart desc
  if (mode === "history") {
    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-800">
          <CalendarX className="h-12 w-12 text-slate-400" />
          <h3 className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-200">
            No Interview History Found
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Completed, cancelled, or past interviews will be archived here for your records.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filtered.map((item) => (
          <InterviewCard
            key={item.id}
            interview={item}
            onEdit={onEdit}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Upcoming Mode: Group by Today / Tomorrow / This week / Later
  const todayStart = startOfToday();

  const groups = useMemo(() => {
    const today: any[] = [];
    const tomorrow: any[] = [];
    const thisWeek: any[] = [];
    const later: any[] = [];
    const pastOverdue: any[] = [];

    filtered.forEach((item) => {
      const dt = new Date(item.scheduledStart);
      if (isPast(dt) && dt < todayStart) {
        pastOverdue.push(item);
      } else if (isToday(dt)) {
        today.push(item);
      } else if (isTomorrow(dt)) {
        tomorrow.push(item);
      } else if (isThisWeek(dt, { weekStartsOn: 1 })) {
        thisWeek.push(item);
      } else {
        later.push(item);
      }
    });

    return { pastOverdue, today, tomorrow, thisWeek, later };
  }, [filtered, todayStart]);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
        <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-950">
          <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-200">
          No interviews scheduled
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Keep track of technical rounds, HR calls, and assessments in one clean timeline.
        </p>
        <Button onClick={onAddInterview} className="mt-4 gap-1.5 text-xs font-semibold">
          <Plus className="h-4 w-4" />
          Add Interview
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overdue / Past Scheduled Section */}
      {groups.pastOverdue.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Needs Update / Overdue
            </span>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              {groups.pastOverdue.length}
            </span>
          </div>
          <div className="space-y-3">
            {groups.pastOverdue.map((item) => (
              <InterviewCard
                key={item.id}
                interview={item}
                onEdit={onEdit}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {/* Today */}
      {groups.today.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Today
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {groups.today.length}
            </span>
          </div>
          <div className="space-y-3">
            {groups.today.map((item) => (
              <InterviewCard
                key={item.id}
                interview={item}
                onEdit={onEdit}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tomorrow */}
      {groups.tomorrow.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Tomorrow
            </span>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {groups.tomorrow.length}
            </span>
          </div>
          <div className="space-y-3">
            {groups.tomorrow.map((item) => (
              <InterviewCard
                key={item.id}
                interview={item}
                onEdit={onEdit}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {/* This Week */}
      {groups.thisWeek.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              This Week
            </span>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {groups.thisWeek.length}
            </span>
          </div>
          <div className="space-y-3">
            {groups.thisWeek.map((item) => (
              <InterviewCard
                key={item.id}
                interview={item}
                onEdit={onEdit}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {/* Later */}
      {groups.later.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Later
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {groups.later.length}
            </span>
          </div>
          <div className="space-y-3">
            {groups.later.map((item) => (
              <InterviewCard
                key={item.id}
                interview={item}
                onEdit={onEdit}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
