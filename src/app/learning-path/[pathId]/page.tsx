"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { PathHeader } from "@/components/learningPath/PathHeader";
import { WeekAccordion } from "@/components/learningPath/WeekAccordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const pathId = params?.pathId as string;

  const [pathData, setPathData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPathDetail = useCallback(async () => {
    if (!pathId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/learning-path/${pathId}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to load learning path");
      }
      const json = await res.json();
      setPathData(json.data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error Loading Path",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [pathId, toast]);

  useEffect(() => {
    fetchPathDetail();
  }, [fetchPathDetail]);

  const handleTaskStatusChange = async (
    taskId: string,
    newStatus: "PENDING" | "DONE" | "SKIPPED"
  ) => {
    if (!pathData) return;

    // Optimistic UI update
    setPathData((prev: any) => {
      if (!prev) return prev;

      let newTotal = 0;
      let newCompleted = 0;

      const updatedWeeks = prev.weeks.map((week: any) => {
        const updatedTasks = week.tasks.map((task: any) => {
          if (task.id === taskId) {
            return { ...task, status: newStatus };
          }
          return task;
        });

        const weekTotal = updatedTasks.length;
        const weekCompleted = updatedTasks.filter((t: any) => t.status === "DONE").length;
        newTotal += weekTotal;
        newCompleted += weekCompleted;

        return {
          ...week,
          tasks: updatedTasks,
          totalTasks: weekTotal,
          completedTasks: weekCompleted,
          progressPercent:
            weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0,
        };
      });

      return {
        ...prev,
        weeks: updatedWeeks,
        totalTasks: newTotal,
        completedTasks: newCompleted,
        overallProgressPercent:
          newTotal > 0 ? Math.round((newCompleted / newTotal) * 100) : 0,
      };
    });

    try {
      const res = await fetch(`/api/learning-path/task/${taskId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task status");
      }
    } catch (err: any) {
      toast({
        title: "Status Update Error",
        description: err.message || "Failed to update task status",
        variant: "destructive",
      });
      // Revert/refresh on failure
      fetchPathDetail();
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !pathData) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Roadmap Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {error || "The requested learning path does not exist or you lack authorization."}
        </p>
        <Link href="/learning-path">
          <Button variant="outline" size="sm" className="gap-1.5 mt-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Learning Paths
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <PathHeader
        pathId={pathData.id}
        title={pathData.title}
        durationWeeks={pathData.durationWeeks}
        hoursPerWeek={pathData.hoursPerWeek}
        focusMode={pathData.focusMode}
        overallProgressPercent={pathData.overallProgressPercent}
        totalTasks={pathData.totalTasks}
        completedTasks={pathData.completedTasks}
        onRegenerated={fetchPathDetail}
      />

      {/* Week-by-Week Accordion */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Weekly Breakdown ({pathData.weeks.length} Weeks)
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Click any week to inspect or mark tasks
          </span>
        </div>

        <WeekAccordion
          weeks={pathData.weeks}
          onTaskStatusChange={handleTaskStatusChange}
        />
      </div>
    </div>
  );
}
