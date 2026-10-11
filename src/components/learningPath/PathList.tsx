"use client";

import * as React from "react";
import Link from "next/link";
import { PathSummary } from "@/lib/learningPath/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Compass,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  BookMarked,
  CheckCircle2,
} from "lucide-react";

interface PathListProps {
  paths: PathSummary[];
  onCreateNewClick: () => void;
}

export function PathList({ paths, onCreateNewClick }: PathListProps) {
  if (!paths || paths.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <Compass className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
          No Learning Paths Yet
        </h3>
        <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Generate an intelligent, week-by-week study roadmap calibrated to your target career role and skill gaps with 100% free resources.
        </p>
        <div className="mt-6">
          <Button
            onClick={onCreateNewClick}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            Generate Learning Path
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Active Roadmaps ({paths.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Follow your structured week-by-week milestones and check off tasks.
          </p>
        </div>
        <Button
          onClick={onCreateNewClick}
          size="sm"
          className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Create New
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {paths.map((path) => {
          const formattedDate = new Date(path.createdAt).toLocaleDateString(
            undefined,
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          );

          const isCompleted = path.progressPercent === 100;

          return (
            <Link
              key={path.id}
              href={`/learning-path/${path.id}`}
              className="group block rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
            >
              <div className="flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400 transition-colors">
                      {path.title}
                    </h3>
                    <Badge
                      variant={isCompleted ? "success" : "secondary"}
                      className="text-[10px] shrink-0 font-medium"
                    >
                      {isCompleted ? "Completed" : `Week ${path.currentWeekNumber || 1}`}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {path.durationWeeks} Weeks
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {path.hoursPerWeek} hrs/week
                    </span>
                    <span>•</span>
                    <span>{path.focusMode.replace("_", " ")}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {path.completedTasks} / {path.totalTasks} tasks done
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {path.progressPercent}%
                    </span>
                  </div>
                  <Progress
                    value={path.progressPercent}
                    className="h-2"
                    indicatorClassName={isCompleted ? "bg-emerald-600 dark:bg-emerald-500" : "bg-blue-600 dark:bg-blue-500"}
                  />
                </div>

                {/* Footer link */}
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1">
                  <span>Created {formattedDate}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                    View Roadmap
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
