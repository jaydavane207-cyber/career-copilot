import React from "react";
import { UpcomingInterviewsWidget } from "@/components/dashboard/UpcomingInterviewsWidget";
import { Calendar, Briefcase, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <span>Career Copilot 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interview Tracker & Application Hub
          </h1>
          <p className="text-sm text-blue-100 font-medium">
            Stay prepared, keep track of upcoming technical & HR rounds, and seamlessly sync your calendar feed.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link href="/interviews">
              <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-sm">
                Open Interview Calendar
              </Button>
            </Link>
            <Link href="/settings/calendar">
              <Button size="sm" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold">
                Calendar Feed URL
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Widget & Quick stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming interviews widget */}
        <div className="lg:col-span-2">
          <UpcomingInterviewsWidget />
        </div>

        {/* Quick action card */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Quick Shortcuts
            </h3>
            <div className="space-y-2">
              <Link
                href="/interviews"
                className="flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Agenda & Month Grid</span>
                </div>
                <span className="text-slate-400">&rarr;</span>
              </Link>

              <Link
                href="/applications"
                className="flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-600" />
                  <span>Applications Pipeline</span>
                </div>
                <span className="text-slate-400">&rarr;</span>
              </Link>

              <Link
                href="/settings/calendar"
                className="flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Private Calendar Feed Link</span>
                </div>
                <span className="text-slate-400">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
