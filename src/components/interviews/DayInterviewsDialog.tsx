"use client";

import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { InterviewCard } from "./InterviewCard";

export interface DayInterviewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  interviews: any[];
  onEdit: (interview: any) => void;
  onComplete: (interview: any) => void;
  onDelete: (id: string) => void;
}

export const DayInterviewsDialog: React.FC<DayInterviewsDialogProps> = ({
  open,
  onOpenChange,
  date,
  interviews,
  onEdit,
  onComplete,
  onDelete,
}) => {
  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Interviews for {format(date, "EEEE, MMMM d, yyyy")}
          </DialogTitle>
          <DialogDescription>
            {interviews.length === 0
              ? "No interviews scheduled on this day."
              : `${interviews.length} interview round${interviews.length > 1 ? "s" : ""} on schedule.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {interviews.map((item) => (
            <InterviewCard
              key={item.id}
              interview={item}
              onEdit={onEdit}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
