"use client";

import React from "react";
import { format, isPast, differenceInHours } from "date-fns";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  Edit2,
  Trash2,
  ExternalLink,
  User,
  AlertTriangle,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface InterviewCardProps {
  interview: {
    id: string;
    title: string;
    type: string;
    mode: string;
    scheduledStart: string | Date;
    durationMin: number;
    timezone: string;
    meetingLink?: string | null;
    location?: string | null;
    interviewerName?: string | null;
    status: string;
    outcome?: string | null;
    notes?: string | null;
    feedback?: string | null;
    application: {
      id: string;
      company: string;
      role: string;
    };
  };
  onEdit: (interview: any) => void;
  onComplete: (interview: any) => void;
  onDelete: (id: string) => void;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onEdit,
  onComplete,
  onDelete,
}) => {
  const startDate = new Date(interview.scheduledStart);
  const now = new Date();
  const hoursUntil = differenceInHours(startDate, now);
  const isOverdue = isPast(startDate) && interview.status === "SCHEDULED";
  const isSoon =
    !isPast(startDate) && hoursUntil <= 24 && hoursUntil >= 0 && interview.status === "SCHEDULED";

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "TECHNICAL":
        return "default";
      case "OA":
        return "secondary";
      case "HR":
      case "SCREENING":
        return "outline";
      case "MANAGERIAL":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getOutcomeBadge = () => {
    if (!interview.outcome) return null;
    if (interview.outcome === "PASS") {
      return <Badge variant="success">Passed</Badge>;
    }
    if (interview.outcome === "FAIL") {
      return <Badge variant="destructive">Not Selected</Badge>;
    }
    return <Badge variant="warning">Pending Result</Badge>;
  };

  return (
    <div
      className={`group relative rounded-xl border p-5 transition-all bg-white dark:bg-slate-900 shadow-sm hover:shadow-md ${
        isSoon
          ? "border-amber-300 bg-amber-50/20 dark:border-amber-800"
          : isOverdue
          ? "border-rose-300 bg-rose-50/20 dark:border-rose-800"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-base text-slate-900 dark:text-slate-100">
              {interview.application.company}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {interview.application.role}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {interview.title}
            </h4>
            <Badge variant={getTypeBadgeVariant(interview.type)}>
              {interview.type}
            </Badge>
            {isSoon && (
              <Badge variant="warning" className="animate-pulse">
                Soon (Next 24h)
              </Badge>
            )}
            {isOverdue && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Missed / Past?
              </Badge>
            )}
            {interview.status === "COMPLETED" && (
              <Badge variant="success" className="flex items-center gap-1">
                <Check className="w-3 h-3" /> Completed
              </Badge>
            )}
            {getOutcomeBadge()}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {interview.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <Video className="h-3.5 w-3.5" />
              Join
              <ExternalLink className="h-3 w-3 ml-0.5 opacity-80" />
            </a>
          )}

          {interview.status === "SCHEDULED" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onComplete(interview)}
              className="h-8 gap-1 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Complete
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(interview)}
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            title="Edit Round"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(interview.id)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
            title="Delete Round"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Date, Time & Mode Meta */}
      <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          <span>{format(startDate, "EEE, MMM d, yyyy")}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>
            {format(startDate, "h:mm a")} ({interview.durationMin} mins)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {interview.mode === "ONLINE" ? (
            <>
              <Video className="h-3.5 w-3.5 text-indigo-400" />
              <span>Online</span>
            </>
          ) : (
            <>
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{interview.location || "On-site"}</span>
            </>
          )}
        </div>

        {interview.interviewerName && (
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>Interviewer: {interview.interviewerName}</span>
          </div>
        )}
      </div>

      {/* Notes or Feedback snippet */}
      {(interview.notes || interview.feedback) && (
        <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
          {interview.notes && (
            <p className="line-clamp-2">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Notes: </span>
              {interview.notes}
            </p>
          )}
          {interview.feedback && (
            <p className="mt-1 line-clamp-2">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Feedback: </span>
              {interview.feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
