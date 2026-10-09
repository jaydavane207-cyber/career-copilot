"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format, isToday, isTomorrow } from "date-fns";
import { Calendar, Clock, Video, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const UpcomingInterviewsWidget: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUpcoming() {
      try {
        const now = new Date();
        const next7Days = new Date();
        next7Days.setDate(now.getDate() + 7);

        const res = await fetch(
          `/api/interviews/list?from=${now.toISOString()}&to=${next7Days.toISOString()}&status=SCHEDULED`
        );
        if (res.ok) {
          const json = await res.json();
          setInterviews((json.data || []).slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load upcoming interviews widget:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUpcoming();
  }, []);

  const formatScheduleDay = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, MMM d");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          <CardTitle className="text-base font-bold">Upcoming Interviews (next 7 days)</CardTitle>
        </div>
        <Link
          href="/interviews"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-2 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-slate-100 p-2.5 text-slate-400 dark:bg-slate-800">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              No interviews scheduled in the next 7 days
            </p>
            <p className="text-[11px] text-slate-400">
              Stay ahead by scheduling upcoming interview rounds.
            </p>
            <Link href="/interviews" className="mt-3">
              <Button size="sm" variant="outline" className="text-xs h-7">
                Schedule Interview
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {interviews.map((item) => {
              const start = new Date(item.scheduledStart);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="space-y-0.5 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {item.application.company}
                      </span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.title} • {item.application.role}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right text-[11px]">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatScheduleDay(start)}
                      </div>
                      <div className="text-slate-400 flex items-center justify-end gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {format(start, "h:mm a")}
                      </div>
                    </div>

                    {item.meetingLink && (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                        title="Join Meeting"
                      >
                        <Video className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
