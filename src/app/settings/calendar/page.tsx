import React from "react";
import { InterviewCalendarFeedCard } from "@/components/settings/InterviewCalendarFeedCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CalendarSettingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/interviews"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Interviews
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Calendar & Feed Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure synchronization preferences, export schedules, and manage private feed security.
        </p>
      </div>

      <InterviewCalendarFeedCard />
    </div>
  );
}
