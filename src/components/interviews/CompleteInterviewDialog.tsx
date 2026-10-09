"use client";

import React, { useState } from "react";
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

export interface CompleteInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: any | null;
  onSuccess: () => void;
}

export const CompleteInterviewDialog: React.FC<CompleteInterviewDialogProps> = ({
  open,
  onOpenChange,
  interview,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [outcome, setOutcome] = useState("PASS");
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (interview) {
      setOutcome(interview.outcome || "PASS");
      setFeedback(interview.feedback || "");
      setNotes(interview.notes || "");
    }
  }, [interview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interview) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/interviews/${interview.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcome,
          feedback: feedback.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to mark interview as completed");
      }

      toast({
        title: "Interview Completed",
        description: `Marked "${interview.title}" as completed with outcome "${outcome}"`,
        variant: "success",
      });

      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!interview) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Interview as Completed</DialogTitle>
          <DialogDescription>
            Record the outcome and any interviewer feedback for {interview.application.company} — {interview.title}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Interview Outcome *
            </label>
            <Select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              required
            >
              <option value="PASS">Passed / Cleared to next round</option>
              <option value="FAIL">Not Selected / Rejected</option>
              <option value="PENDING">Pending / Awaiting Feedback</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Interviewer Feedback (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Questions asked, interviewer comments, strengths/weaknesses..."
              className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Personal Reflection / Notes
            </label>
            <textarea
              rows={2}
              placeholder="What to do differently next time..."
              className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
              {loading ? "Saving..." : "Confirm & Complete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
