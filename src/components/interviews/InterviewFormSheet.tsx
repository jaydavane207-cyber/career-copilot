"use client";

import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

export interface InterviewFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interviewToEdit?: any | null;
  defaultApplicationId?: string | null;
  applications: Array<{ id: string; company: string; role: string }>;
  onSuccess: () => void;
}

export const InterviewFormSheet: React.FC<InterviewFormSheetProps> = ({
  open,
  onOpenChange,
  interviewToEdit,
  defaultApplicationId,
  applications,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    applicationId: "",
    title: "",
    type: "TECHNICAL",
    mode: "ONLINE",
    scheduledStart: "",
    durationMin: 45,
    timezone: "Asia/Kolkata",
    meetingLink: "",
    location: "",
    interviewerName: "",
    status: "SCHEDULED",
    outcome: "",
    notes: "",
    feedback: "",
  });

  useEffect(() => {
    if (interviewToEdit) {
      const dt = new Date(interviewToEdit.scheduledStart);
      // Format as YYYY-MM-DDTHH:MM for input datetime-local
      const tzOffset = dt.getTimezoneOffset() * 60000;
      const localISOTime = new Date(dt.getTime() - tzOffset).toISOString().slice(0, 16);

      setFormData({
        applicationId: interviewToEdit.applicationId || interviewToEdit.application?.id || "",
        title: interviewToEdit.title || "",
        type: interviewToEdit.type || "TECHNICAL",
        mode: interviewToEdit.mode || "ONLINE",
        scheduledStart: localISOTime,
        durationMin: interviewToEdit.durationMin || 45,
        timezone: interviewToEdit.timezone || "Asia/Kolkata",
        meetingLink: interviewToEdit.meetingLink || "",
        location: interviewToEdit.location || "",
        interviewerName: interviewToEdit.interviewerName || "",
        status: interviewToEdit.status || "SCHEDULED",
        outcome: interviewToEdit.outcome || "",
        notes: interviewToEdit.notes || "",
        feedback: interviewToEdit.feedback || "",
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      const tzOffset = tomorrow.getTimezoneOffset() * 60000;
      const defaultStart = new Date(tomorrow.getTime() - tzOffset).toISOString().slice(0, 16);

      setFormData({
        applicationId: defaultApplicationId || (applications.length > 0 ? applications[0].id : ""),
        title: "Technical Round 1",
        type: "TECHNICAL",
        mode: "ONLINE",
        scheduledStart: defaultStart,
        durationMin: 45,
        timezone: "Asia/Kolkata",
        meetingLink: "",
        location: "",
        interviewerName: "",
        status: "SCHEDULED",
        outcome: "",
        notes: "",
        feedback: "",
      });
    }
  }, [interviewToEdit, defaultApplicationId, applications, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicationId) {
      toast({
        title: "Missing Application",
        description: "Please select a job application for this interview.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please provide a round title.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        applicationId: formData.applicationId,
        title: formData.title,
        type: formData.type,
        mode: formData.mode,
        scheduledStart: new Date(formData.scheduledStart).toISOString(),
        durationMin: Number(formData.durationMin) || 45,
        timezone: formData.timezone,
        meetingLink: formData.meetingLink ? formData.meetingLink.trim() : null,
        location: formData.location ? formData.location.trim() : null,
        interviewerName: formData.interviewerName ? formData.interviewerName.trim() : null,
        status: formData.status,
        outcome: formData.outcome ? formData.outcome : null,
        notes: formData.notes ? formData.notes.trim() : null,
        feedback: formData.feedback ? formData.feedback.trim() : null,
      };

      const url = interviewToEdit
        ? `/api/interviews/${interviewToEdit.id}/update`
        : `/api/interviews/create`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save interview");
      }

      toast({
        title: interviewToEdit ? "Interview Updated" : "Interview Scheduled",
        description: `Successfully saved "${formData.title}"`,
        variant: "success",
      });

      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {interviewToEdit ? "Edit Interview Round" : "Schedule Interview Round"}
          </SheetTitle>
          <SheetDescription>
            Record interview dates, mode, meeting link, and notes.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Job Application */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Job Application *
            </label>
            <Select
              value={formData.applicationId}
              onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
              required
            >
              <option value="" disabled>
                Select an Application
              </option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company} — {app.role}
                </option>
              ))}
            </Select>
          </div>

          {/* Round Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Round Title *
            </label>
            <Input
              type="text"
              placeholder="e.g. Technical Round 1, System Design, HR"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Type & Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Round Type
              </label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="OA">Online Assessment (OA)</option>
                <option value="TECHNICAL">Technical</option>
                <option value="HR">HR</option>
                <option value="MANAGERIAL">Managerial</option>
                <option value="SCREENING">Screening</option>
                <option value="OTHER">Other</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mode
              </label>
              <Select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              >
                <option value="ONLINE">Online (Virtual)</option>
                <option value="OFFLINE">Offline (In-Person)</option>
              </Select>
            </div>
          </div>

          {/* Date & Time and Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Date & Time *
              </label>
              <Input
                type="datetime-local"
                value={formData.scheduledStart}
                onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Duration (minutes)
              </label>
              <Input
                type="number"
                min="15"
                step="15"
                value={formData.durationMin}
                onChange={(e) => setFormData({ ...formData, durationMin: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Meeting Link or Location */}
          {formData.mode === "ONLINE" ? (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Meeting Link (Zoom, Google Meet, Teams)
              </label>
              <Input
                type="url"
                placeholder="https://meet.google.com/xyz"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Office / Building Location
              </label>
              <Input
                type="text"
                placeholder="e.g. Bangalore Campus, 4th Floor"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          )}

          {/* Interviewer Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Interviewer Name / Panel (Optional)
            </label>
            <Input
              type="text"
              placeholder="e.g. John Doe, Lead Eng"
              value={formData.interviewerName}
              onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
            />
          </div>

          {/* Status & Outcome */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Outcome
              </label>
              <Select
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
              >
                <option value="">Pending / None</option>
                <option value="PASS">Pass / Cleared</option>
                <option value="FAIL">Fail / Rejected</option>
                <option value="PENDING">Pending Verdict</option>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Preparation Notes / Topics
            </label>
            <textarea
              rows={2}
              className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              placeholder="Topics to review, questions asked, prep focus..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Feedback */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Outcome Feedback (Post-interview)
            </label>
            <textarea
              rows={2}
              className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              placeholder="Interviewer comments, areas to improve..."
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
            />
          </div>

          <SheetFooter className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : interviewToEdit ? "Update Round" : "Save Round"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
