"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Clock,
  BookOpen,
  Code2,
  RotateCcw,
  Video,
  FileText,
  HelpCircle,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface LearningTaskItem {
  id: string;
  type: "LEARN" | "PRACTICE" | "REVISE" | "MOCK";
  title: string;
  description?: string | null;
  durationMin: number;
  resourceUrl?: string | null;
  resourceTitle?: string | null;
  skillIds: any;
  status: "PENDING" | "DONE" | "SKIPPED";
  completedAt?: string | Date | null;
}

interface TaskChecklistProps {
  tasks: LearningTaskItem[];
  onTaskStatusChange: (taskId: string, newStatus: "PENDING" | "DONE" | "SKIPPED") => Promise<void>;
  disabled?: boolean;
}

export function TaskChecklist({
  tasks,
  onTaskStatusChange,
  disabled = false,
}: TaskChecklistProps) {
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const handleToggleDone = async (task: LearningTaskItem) => {
    if (disabled || updatingId) return;
    setUpdatingId(task.id);
    try {
      const nextStatus = task.status === "DONE" ? "PENDING" : "DONE";
      await onTaskStatusChange(task.id, nextStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSkip = async (task: LearningTaskItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || updatingId) return;
    setUpdatingId(task.id);
    try {
      const nextStatus = task.status === "SKIPPED" ? "PENDING" : "SKIPPED";
      await onTaskStatusChange(task.id, nextStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="py-4 text-center text-xs text-slate-400">
        No tasks assigned for this week.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 rounded-lg border border-slate-150 bg-white dark:divide-slate-800/80 dark:border-slate-800 dark:bg-slate-900/40">
      {tasks.map((task) => {
        const isDone = task.status === "DONE";
        const isSkipped = task.status === "SKIPPED";
        const isBusy = updatingId === task.id;

        return (
          <div
            key={task.id}
            className={cn(
              "group flex flex-col gap-2 p-3.5 transition-colors sm:flex-row sm:items-start sm:justify-between sm:gap-4",
              isDone && "bg-slate-50/50 dark:bg-slate-900/20 opacity-80",
              isSkipped && "bg-slate-50/40 dark:bg-slate-900/10 opacity-60"
            )}
          >
            {/* Left: Checkbox + Content */}
            <div className="flex flex-1 items-start gap-3">
              <button
                type="button"
                onClick={() => handleToggleDone(task)}
                disabled={disabled || isBusy}
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500",
                  isDone
                    ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500"
                    : "border-slate-300 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900",
                  isSkipped && "border-slate-400 bg-slate-200 dark:border-slate-600 dark:bg-slate-800"
                )}
                title={isDone ? "Mark as pending" : "Mark as done"}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                ) : isSkipped ? (
                  <SkipForward className="h-3.5 w-3.5 text-slate-500" />
                ) : (
                  <Circle className="h-3.5 w-3.5 opacity-0 group-hover:opacity-30" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <TaskTypeBadge type={task.type} />
                  <span
                    className={cn(
                      "text-xs font-semibold text-slate-900 dark:text-slate-100",
                      isDone && "line-through text-slate-500 dark:text-slate-400",
                      isSkipped && "italic text-slate-500"
                    )}
                  >
                    {task.title}
                  </span>
                  <span className="flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <Clock className="h-3 w-3" />
                    {task.durationMin}m
                  </span>
                </div>

                {task.description && (
                  <p
                    className={cn(
                      "text-xs leading-relaxed text-slate-600 dark:text-slate-300",
                      isDone && "text-slate-400 dark:text-slate-500"
                    )}
                  >
                    {task.description}
                  </p>
                )}

                {/* Free Resource Link Row */}
                {task.resourceUrl && (
                  <div className="pt-1">
                    <a
                      href={task.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-[11px] font-medium text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-50/80 dark:border-slate-800 dark:bg-slate-800/80 dark:text-blue-400 dark:hover:border-blue-700"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[280px] sm:max-w-md">
                        {task.resourceTitle || "Free Resource Link"}
                      </span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 self-end sm:self-start">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => handleSkip(task, e)}
                disabled={disabled || isBusy}
                className="h-7 px-2 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {isSkipped ? "Unskip" : "Skip"}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskTypeBadge({ type }: { type: LearningTaskItem["type"] }) {
  switch (type) {
    case "LEARN":
      return (
        <Badge
          variant="secondary"
          className="border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/80 dark:bg-blue-950/40 dark:text-blue-300 text-[10px] px-1.5 py-0"
        >
          <FileText className="mr-1 h-2.5 w-2.5" />
          LEARN
        </Badge>
      );
    case "PRACTICE":
      return (
        <Badge
          variant="secondary"
          className="border border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800/80 dark:bg-purple-950/40 dark:text-purple-300 text-[10px] px-1.5 py-0"
        >
          <Code2 className="mr-1 h-2.5 w-2.5" />
          PRACTICE
        </Badge>
      );
    case "REVISE":
      return (
        <Badge
          variant="secondary"
          className="border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/80 dark:bg-amber-950/40 dark:text-amber-300 text-[10px] px-1.5 py-0"
        >
          <RotateCcw className="mr-1 h-2.5 w-2.5" />
          REVISE
        </Badge>
      );
    case "MOCK":
      return (
        <Badge
          variant="secondary"
          className="border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] px-1.5 py-0"
        >
          <HelpCircle className="mr-1 h-2.5 w-2.5" />
          MOCK
        </Badge>
      );
    default:
      return <Badge variant="secondary">{type}</Badge>;
  }
}
