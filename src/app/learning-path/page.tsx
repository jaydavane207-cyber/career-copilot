"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PathList } from "@/components/learningPath/PathList";
import { GeneratePathDialog } from "@/components/learningPath/GeneratePathDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PathSummary } from "@/lib/learningPath/queries";
import { Compass, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function LearningPathPage() {
  const { toast } = useToast();
  const [paths, setPaths] = useState<PathSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchPaths = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/learning-path/list");
      if (res.ok) {
        const json = await res.json();
        setPaths(json.data || []);
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to load learning paths");
      }
    } catch (err: any) {
      toast({
        title: "Error Loading Paths",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Compass className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Study Planner
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Personalized Learning Paths
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Deterministic, week-by-week roadmaps closing your target skill gaps using curated 100% free documentation, courses, and interview checklists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPaths}
            disabled={loading}
            className="text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-xs sm:text-sm"
          >
            <Sparkles className="h-4 w-4" />
            Generate Learning Path
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </div>
      ) : (
        <PathList
          paths={paths}
          onCreateNewClick={() => setIsDialogOpen(true)}
        />
      )}

      {/* Generate Dialog */}
      <GeneratePathDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          fetchPaths();
        }}
      />
    </div>
  );
}
