// src/components/dashboard/InterviewReminderBanner.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Clock, ArrowRight, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const InterviewReminderBanner: React.FC = () => {
  const [nextInterview, setNextInterview] = useState<any | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUpcoming() {
      try {
        const res = await fetch("/api/interviews/upcoming/prep?limit=1&days=3");
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setNextInterview(json.data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load interview reminder banner:", err);
      } finally {
        setLoading(false);
      }
    }

    checkUpcoming();
  }, []);

  if (loading || !nextInterview || dismissed) {
    return null;
  }

  const isCritical = nextInterview.urgencyLevel === "critical";

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 shadow-sm transition-all ${
        isCritical
          ? "border-rose-300 bg-gradient-to-r from-rose-50 via-red-50 to-amber-50 text-rose-950 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-100"
          : "border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 rounded-lg p-2 ${
              isCritical
                ? "bg-rose-500 text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {isCritical ? "Critical Alert" : "Upcoming Interview Reminder"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold">
                <Clock className="h-3 w-3 text-amber-600" />
                In {nextInterview.timeUntil}
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold">
              {nextInterview.company} &bull; {nextInterview.roundTitle || nextInterview.roundType} ({nextInterview.role})
            </p>
            {nextInterview.todayTopTasks && nextInterview.todayTopTasks.length > 0 && (
              <p className="mt-0.5 text-xs opacity-90">
                Top task for today: <span className="font-medium underline">{nextInterview.todayTopTasks[0]}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Link href={`/interviews/${nextInterview.interviewId}/prep`}>
            <Button
              size="sm"
              className={`gap-1.5 font-semibold text-xs text-white shadow-sm ${
                isCritical
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Open Prep Plan
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
