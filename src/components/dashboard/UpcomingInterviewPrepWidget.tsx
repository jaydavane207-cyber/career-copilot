// src/components/dashboard/UpcomingInterviewPrepWidget.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  Video,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const UpcomingInterviewPrepWidget: React.FC = () => {
  const [prepList, setPrepList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadUpcomingPrep() {
      try {
        const res = await fetch("/api/interviews/upcoming/prep?limit=3&days=14");
        if (res.ok) {
          const json = await res.json();
          setPrepList(json.data || []);
        }
      } catch (err) {
        console.error("Failed to load interview prep widget:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUpcomingPrep();

    // Load saved checklist state from localStorage
    try {
      const saved = localStorage.getItem("career_copilot_prep_widget_tasks");
      if (saved) {
        setCheckedTasks(JSON.parse(saved));
      }
    } catch {
      // Local storage parse error handling
    }
  }, []);

  const toggleTask = (taskKey: string) => {
    setCheckedTasks((prev) => {
      const updated = { ...prev, [taskKey]: !prev[taskKey] };
      try {
        localStorage.setItem("career_copilot_prep_widget_tasks", JSON.stringify(updated));
      } catch {
        // Local storage write error handling
      }
      return updated;
    });
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return <Badge variant="destructive" className="animate-pulse">Critical (&lt; 24h)</Badge>;
      case "high":
        return <Badge variant="warning">High Priority</Badge>;
      case "moderate":
        return <Badge variant="default">Coming Up</Badge>;
      default:
        return <Badge variant="secondary">Scheduled</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="h-5 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
            <div className="h-16 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (prepList.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <CardTitle className="text-base font-bold">Interview Prep Automation</CardTitle>
          </div>
          <Link
            href="/interviews"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Calendar
            <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-indigo-50 p-3 text-indigo-500 dark:bg-slate-800">
              <BookOpen className="h-5 w-5" />
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              No upcoming interview rounds scheduled
            </p>
            <p className="max-w-xs text-[11px] text-slate-400">
              Schedule your next interview round to automatically generate custom company prep plans, checklists, and countdown alerts.
            </p>
            <Link href="/interviews" className="mt-3">
              <Button size="sm" variant="outline" className="text-xs h-8">
                Schedule Interview
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const primaryInterview = prepList[0];

  return (
    <Card className="shadow-sm border-indigo-100 dark:border-indigo-950/40">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <CardTitle className="text-base font-bold">
            Interview Prep &amp; Today&apos;s Focus
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {getUrgencyBadge(primaryInterview.urgencyLevel)}
          <Link
            href={`/interviews/${primaryInterview.interviewId}/prep`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Full Plan &rarr;
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main highlight card */}
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/40 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {primaryInterview.company}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {primaryInterview.roundType}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {primaryInterview.roundTitle} &bull; {primaryInterview.role}
              </p>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-indigo-100/70 px-2.5 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200">
              <Clock className="h-3.5 w-3.5" />
              <span>In {primaryInterview.timeUntil}</span>
            </div>
          </div>

          {/* Today's Tasks Checklist */}
          <div className="mt-3 space-y-1.5 border-t border-indigo-100/60 pt-3 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today&apos;s Recommended Prep Tasks:
            </span>
            {primaryInterview.todayTopTasks.map((taskText: string, idx: number) => {
              const taskKey = `${primaryInterview.interviewId}-${idx}`;
              const isDone = !!checkedTasks[taskKey];
              return (
                <div
                  key={taskKey}
                  onClick={() => toggleTask(taskKey)}
                  className={`flex cursor-pointer items-start gap-2 rounded-lg p-1.5 text-xs transition ${
                    isDone
                      ? "bg-emerald-50 text-emerald-800 line-through dark:bg-emerald-950/20 dark:text-emerald-300"
                      : "hover:bg-indigo-50/60 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <button
                    type="button"
                    aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                    className="mt-0.5 text-indigo-600 dark:text-indigo-400"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </button>
                  <span className="flex-1 leading-snug">{taskText}</span>
                </div>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-indigo-100/40 dark:border-slate-800">
            <Link href={`/interviews/${primaryInterview.interviewId}/prep`} className="flex-1 min-w-[140px]">
              <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Open Full Prep Plan
              </Button>
            </Link>

            {primaryInterview.meetingLink && (
              <a
                href={primaryInterview.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="outline" className="text-xs h-8 gap-1 text-slate-700 dark:text-slate-200">
                  <Video className="h-3.5 w-3.5 text-blue-600" />
                  Join Link
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            )}

            <Link href="/interviews">
              <Button size="sm" variant="ghost" className="text-xs h-8 text-slate-600 dark:text-slate-400">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Calendar
              </Button>
            </Link>
          </div>
        </div>

        {/* Other upcoming interviews if any */}
        {prepList.length > 1 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Following Rounds:
            </span>
            {prepList.slice(1).map((item) => (
              <Link
                key={item.interviewId}
                href={`/interviews/${item.interviewId}/prep`}
                className="flex items-center justify-between rounded-lg p-2 text-xs border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60 transition"
              >
                <div className="truncate mr-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.company}
                  </span>{" "}
                  &bull; <span className="text-slate-500">{item.roundTitle || item.roundType}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-400 text-[11px]">in {item.timeUntil}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
