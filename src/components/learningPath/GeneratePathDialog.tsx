"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { Sparkles, Compass, Clock, Calendar, Target, CheckCircle2 } from "lucide-react";
import { getAllRoleTemplates } from "@/lib/learningPath/roleTemplates";

interface GeneratePathDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (pathId: string) => void;
}

export function GeneratePathDialog({
  open,
  onOpenChange,
  onSuccess,
}: GeneratePathDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [targetRoleKey, setTargetRoleKey] = React.useState("sde-1");
  const [durationWeeks, setDurationWeeks] = React.useState(6);
  const [hoursPerWeek, setHoursPerWeek] = React.useState(6);
  const [focusMode, setFocusMode] = React.useState<"BALANCED" | "OA_FIRST" | "INTERVIEW_FIRST">("BALANCED");
  const [useResumeKeywords, setUseResumeKeywords] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const roles = React.useMemo(() => getAllRoleTemplates(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/learning-path/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRoleKey,
          durationWeeks: Number(durationWeeks),
          hoursPerWeek: Number(hoursPerWeek),
          focusMode,
          sourceResumeAnalysisId: useResumeKeywords ? "latest-resume-analysis" : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate learning path");
      }

      toast({
        title: "Roadmap Generated Successfully!",
        description: "Your personalized week-by-week study plan is ready.",
        variant: "success",
      });

      onOpenChange(false);

      if (onSuccess) {
        onSuccess(data.pathId);
      } else {
        router.push(`/learning-path/${data.pathId}`);
      }
    } catch (err: any) {
      toast({
        title: "Generation Error",
        description: err.message || "Something went wrong while generating the roadmap.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 sm:p-7">
        <DialogHeader>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
            <Compass className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Deterministic Planner • $0 Free Resources
            </span>
          </div>
          <DialogTitle className="text-xl font-bold">Generate Personalized Learning Path</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            Create an actionable, week-by-week roadmap targeted to your specific skill gaps with 100% free curated resources.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Target Role */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Target className="h-3.5 w-3.5 text-blue-600" />
              Target Career Role
            </label>
            <Select
              value={targetRoleKey}
              onChange={(e) => setTargetRoleKey(e.target.value)}
              className="bg-white dark:bg-slate-900 font-medium"
            >
              {roles.map((role) => (
                <option key={role.key} value={role.key}>
                  {role.title}
                </option>
              ))}
            </Select>
            <p className="text-[11px] text-slate-400">
              Prioritizes core benchmarks and algorithmic/system foundations for this role.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                Duration (Weeks)
              </label>
              <Select
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
                className="bg-white dark:bg-slate-900"
              >
                <option value={4}>4 Weeks (Intensive)</option>
                <option value={6}>6 Weeks (Standard)</option>
                <option value={8}>8 Weeks (Comprehensive)</option>
                <option value={12}>12 Weeks (Mastery)</option>
              </Select>
            </div>

            {/* Hours Per Week */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Clock className="h-3.5 w-3.5 text-blue-600" />
                Hours / Week
              </label>
              <Select
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="bg-white dark:bg-slate-900"
              >
                <option value={4}>4 hrs / week (~35m/day)</option>
                <option value={6}>6 hrs / week (~50m/day)</option>
                <option value={8}>8 hrs / week (~1h/day)</option>
                <option value={10}>10 hrs / week (~1.5h/day)</option>
                <option value={12}>12 hrs / week (~2h/day)</option>
              </Select>
            </div>
          </div>

          {/* Focus Mode */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Focus Mode & Time Distribution
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFocusMode("BALANCED")}
                className={`rounded-lg border p-2.5 text-left text-xs transition-all ${
                  focusMode === "BALANCED"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-200 font-semibold shadow-xs"
                    : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
                }`}
              >
                <div className="font-medium text-slate-900 dark:text-slate-100">Balanced</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">45% practice • 30% learn</div>
              </button>

              <button
                type="button"
                onClick={() => setFocusMode("OA_FIRST")}
                className={`rounded-lg border p-2.5 text-left text-xs transition-all ${
                  focusMode === "OA_FIRST"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-200 font-semibold shadow-xs"
                    : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
                }`}
              >
                <div className="font-medium text-slate-900 dark:text-slate-100">OA First</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">60% practice • 25% learn</div>
              </button>

              <button
                type="button"
                onClick={() => setFocusMode("INTERVIEW_FIRST")}
                className={`rounded-lg border p-2.5 text-left text-xs transition-all ${
                  focusMode === "INTERVIEW_FIRST"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-200 font-semibold shadow-xs"
                    : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
                }`}
              >
                <div className="font-medium text-slate-900 dark:text-slate-100">Interview First</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">35% practice • 25% mock</div>
              </button>
            </div>
          </div>

          {/* Gap Signal / Resume Analysis */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={useResumeKeywords}
                onChange={(e) => setUseResumeKeywords(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="space-y-0.5 text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Base on latest Resume Analysis missing keywords
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Adds a 15% priority boost to skills flagged as missing in your resume scan.
                </p>
              </div>
            </label>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>Generating Roadmap...</>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Learning Path
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
