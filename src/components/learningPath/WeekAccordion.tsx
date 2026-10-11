"use client";

import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TaskChecklist, LearningTaskItem } from "./TaskChecklist";
import { CheckCircle2, Calendar, Target, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LearningWeekItem {
  id: string;
  weekNumber: number;
  title: string;
  skillIds: any;
  goalSummary?: string | null;
  tasks: LearningTaskItem[];
  progressPercent?: number;
  totalTasks?: number;
  completedTasks?: number;
}

interface WeekAccordionProps {
  weeks: LearningWeekItem[];
  onTaskStatusChange: (taskId: string, newStatus: "PENDING" | "DONE" | "SKIPPED") => Promise<void>;
  disabled?: boolean;
}

export function WeekAccordion({
  weeks,
  onTaskStatusChange,
  disabled = false,
}: WeekAccordionProps) {
  // Find first incomplete week to open by default, or week-1
  const defaultOpenWeek = React.useMemo(() => {
    const firstIncomplete = weeks.find((w) => {
      const done = w.tasks.filter((t) => t.status === "DONE").length;
      return done < w.tasks.length;
    });
    return firstIncomplete ? `week-${firstIncomplete.weekNumber}` : "week-1";
  }, [weeks]);

  return (
    <Accordion
      type="multiple"
      defaultValue={[defaultOpenWeek]}
      className="space-y-3"
    >
      {weeks.map((week) => {
        const skillsList: string[] = Array.isArray(week.skillIds)
          ? week.skillIds
          : typeof week.skillIds === "string"
          ? JSON.parse(week.skillIds || "[]")
          : [];

        const totalTasks = week.tasks.length;
        const completedTasks = week.tasks.filter((t) => t.status === "DONE").length;
        const progressPercent =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const isAllDone = totalTasks > 0 && completedTasks === totalTasks;
        const itemKey = `week-${week.weekNumber}`;

        return (
          <AccordionItem
            key={week.id}
            value={itemKey}
            className={cn(
              "overflow-hidden border transition-all",
              isAllDone
                ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10"
                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            )}
          >
            <AccordionTrigger className="hover:no-underline px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between w-full pr-3">
                {/* Left: Week title + Skills */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 items-center rounded bg-slate-100 px-2 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      W{week.weekNumber}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {week.title}
                    </h3>
                    {isAllDone && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Complete
                      </span>
                    )}
                  </div>

                  {/* Skills chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {skillsList.map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 py-0 font-normal"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Right: Week progress bar */}
                <div className="flex items-center gap-3 sm:w-48 shrink-0">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{completedTasks}/{totalTasks} tasks</span>
                      <span className="font-semibold">{progressPercent}%</span>
                    </div>
                    <Progress
                      value={progressPercent}
                      className="h-1.5"
                      indicatorClassName={isAllDone ? "bg-emerald-600 dark:bg-emerald-500" : "bg-blue-600 dark:bg-blue-500"}
                    />
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="border-t border-slate-100 bg-slate-50/40 p-4 sm:p-5 dark:border-slate-800/80 dark:bg-slate-950/20">
              {week.goalSummary && (
                <div className="mb-3.5 flex items-start gap-2 rounded-md bg-blue-50/60 p-2.5 text-xs text-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
                  <Target className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <p className="leading-relaxed">{week.goalSummary}</p>
                </div>
              )}

              <TaskChecklist
                tasks={week.tasks}
                onTaskStatusChange={onTaskStatusChange}
                disabled={disabled}
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
