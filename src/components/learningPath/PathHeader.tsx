"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Compass,
  RefreshCw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface PathHeaderProps {
  pathId: string;
  title: string;
  durationWeeks: number;
  hoursPerWeek: number;
  focusMode: "BALANCED" | "OA_FIRST" | "INTERVIEW_FIRST";
  overallProgressPercent: number;
  totalTasks: number;
  completedTasks: number;
  onRegenerated?: () => void;
}

export function PathHeader({
  pathId,
  title,
  durationWeeks,
  hoursPerWeek,
  focusMode,
  overallProgressPercent,
  totalTasks,
  completedTasks,
  onRegenerated,
}: PathHeaderProps) {
  const { toast } = useToast();
  const [isRegenerating, setIsRegenerating] = React.useState(false);

  const handleRegenerateRemaining = async () => {
    if (
      !confirm(
        "Regenerate remaining weeks? Completed tasks will remain intact while upcoming tasks are refreshed."
      )
    ) {
      return;
    }

    setIsRegenerating(true);
    try {
      const res = await fetch(`/api/learning-path/${pathId}/regenerate-remaining`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to regenerate remaining weeks");
      }

      toast({
        title: "Roadmap Updated",
        description: "Remaining weeks have been refreshed while preserving completed tasks.",
        variant: "success",
      });

      if (onRegenerated) {
        onRegenerated();
      }
    } catch (err: any) {
      toast({
        title: "Regeneration Error",
        description: err.message || "Failed to regenerate upcoming weeks.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const focusModeLabel =
    focusMode === "OA_FIRST"
      ? "OA First"
      : focusMode === "INTERVIEW_FIRST"
      ? "Interview First"
      : "Balanced";

  return (
    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Top row: Back link + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/learning-path"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all Learning Paths
        </Link>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRegenerateRemaining}
          disabled={isRegenerating}
          className="gap-1.5 text-xs text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isRegenerating ? "animate-spin" : ""}`}
          />
          Regenerate Remaining Weeks
        </Button>
      </div>

      {/* Main title + badges */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1 text-xs font-normal">
              <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              {durationWeeks} Weeks
            </Badge>
            <Badge variant="secondary" className="gap-1 text-xs font-normal">
              <Clock className="h-3 w-3 text-slate-500" />
              {hoursPerWeek} hrs / week
            </Badge>
            <Badge
              variant="outline"
              className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300 text-xs font-normal"
            >
              <Compass className="mr-1 h-3 w-3" />
              {focusModeLabel}
            </Badge>
          </div>
        </div>

        {/* Progress summary card */}
        <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800/80 dark:bg-slate-800/40 sm:min-w-[220px]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100">
              <span>Overall Progress</span>
              <span className="text-blue-600 dark:text-blue-400">
                {overallProgressPercent}%
              </span>
            </div>
            <Progress value={overallProgressPercent} className="h-2" />
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {completedTasks} of {totalTasks} tasks completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
