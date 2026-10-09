"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Briefcase,
  Plus,
  Calendar,
  Building,
  MoreVertical,
  ExternalLink,
  Clock,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InterviewFormSheet } from "@/components/interviews/InterviewFormSheet";
import { useToast } from "@/components/ui/toast";
import { format } from "date-fns";
import Link from "next/link";

export default function ApplicationsPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Interview round sheet
  const [isAddInterviewOpen, setIsAddInterviewOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const json = await res.json();
        setApplications(json.data || []);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to load applications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleAddRound = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setIsAddInterviewOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Job Applications
          </h1>
          <p className="text-xs text-slate-500">
            Track your pipeline and manage interview rounds for each company.
          </p>
        </div>

        <Link href="/interviews">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
            <Calendar className="h-3.5 w-3.5" />
            View Interview Calendar
          </Button>
        </Link>
      </div>

      {applications.length === 0 && !loading ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <Building className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
            No applications found
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Start tracking jobs and schedule interview rounds.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {app.company}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {app.role}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {app.status}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  {app.salary && <span>💰 {app.salary}</span>}
                  {app.location && <span>📍 {app.location}</span>}
                </div>

                {/* Interviews section */}
                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Interviews ({app.interviews?.length || 0})
                    </span>
                    <button
                      onClick={() => handleAddRound(app.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Plus className="h-3 w-3" />
                      Add Round
                    </button>
                  </div>

                  {app.interviews && app.interviews.length > 0 ? (
                    <div className="space-y-2">
                      {app.interviews.map((round: any) => (
                        <div
                          key={round.id}
                          className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs dark:bg-slate-800/60"
                        >
                          <div className="truncate pr-2">
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {round.title}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              {format(new Date(round.scheduledStart), "MMM d, h:mm a")}
                            </div>
                          </div>
                          <Badge
                            variant={round.status === "COMPLETED" ? "success" : "outline"}
                            className="text-[10px] shrink-0"
                          >
                            {round.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      No interview rounds scheduled yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddRound(app.id)}
                  className="w-full text-xs font-semibold gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Schedule Interview Round
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Interview Round Sheet */}
      <InterviewFormSheet
        open={isAddInterviewOpen}
        onOpenChange={setIsAddInterviewOpen}
        defaultApplicationId={selectedApplicationId}
        applications={applications}
        onSuccess={fetchApplications}
      />
    </div>
  );
}
