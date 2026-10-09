"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar as CalendarIcon,
  Download,
  Plus,
  Search,
  Filter,
  History,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { InterviewList } from "@/components/interviews/InterviewList";
import { CalendarMonth } from "@/components/interviews/CalendarMonth";
import { DayInterviewsDialog } from "@/components/interviews/DayInterviewsDialog";
import { InterviewFormSheet } from "@/components/interviews/InterviewFormSheet";
import { CompleteInterviewDialog } from "@/components/interviews/CompleteInterviewDialog";
import { useToast } from "@/components/ui/toast";

export default function InterviewsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [interviews, setInterviews] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Modals & Sheets
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<any | null>(null);
  const [completingInterview, setCompletingInterview] = useState<any | null>(null);

  // Calendar Day Click Dialog
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dayInterviews, setDayInterviews] = useState<any[]>([]);
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch interviews
      const res = await fetch("/api/interviews/list");
      if (res.ok) {
        const json = await res.json();
        setInterviews(json.data || []);
      }

      // 2. Fetch applications list for form dropdown
      const appsRes = await fetch("/api/applications");
      if (appsRes.ok) {
        const appsJson = await appsRes.json();
        setApplications(appsJson.data || []);
      }
    } catch (err: any) {
      console.error("Error loading interview data:", err);
      toast({
        title: "Load Error",
        description: "Failed to load interviews or applications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (interview: any) => {
    setEditingInterview(interview);
    setIsFormOpen(true);
  };

  const handleComplete = (interview: any) => {
    setCompletingInterview(interview);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this interview round?")) return;

    try {
      const res = await fetch(`/api/interviews/${id}/delete`, {
        method: "POST",
      });
      if (res.ok) {
        toast({
          title: "Interview Deleted",
          description: "Round removed successfully.",
          variant: "success",
        });
        fetchData();
        if (isDayDialogOpen) {
          setIsDayDialogOpen(false);
        }
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleSelectDay = (date: Date, dayItems: any[]) => {
    setSelectedDay(date);
    setDayInterviews(dayItems);
    setIsDayDialogOpen(true);
  };

  const handleDownloadIcs = (scope: "upcoming" | "all" = "upcoming") => {
    window.open(`/api/interviews/ics?scope=${scope}`, "_blank");
  };

  // Partition upcoming vs history
  const upcomingInterviews = interviews.filter(
    (item) => item.status === "SCHEDULED"
  );
  const historyInterviews = interviews.filter(
    (item) => item.status !== "SCHEDULED"
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Interview Tracker & Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage preparation rounds, outcomes, and calendar synchronization across applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadIcs("upcoming")}
            className="gap-1.5 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            Download .ics
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setEditingInterview(null);
              setIsFormOpen(true);
            }}
            className="gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Schedule Round
          </Button>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="upcoming" className="gap-1.5 text-xs">
                <Clock className="h-3.5 w-3.5" />
                Upcoming ({upcomingInterviews.length})
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-1.5 text-xs">
                <CalendarIcon className="h-3.5 w-3.5" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-1.5 text-xs">
                <History className="h-3.5 w-3.5" />
                History ({historyInterviews.length})
              </TabsTrigger>
            </TabsList>

            {/* Quick search and type filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Filter company or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-8"
                />
              </div>

              <div className="w-32">
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="text-xs h-8"
                >
                  <option value="ALL">All Types</option>
                  <option value="OA">OA</option>
                  <option value="TECHNICAL">Technical</option>
                  <option value="HR">HR</option>
                  <option value="MANAGERIAL">Managerial</option>
                  <option value="SCREENING">Screening</option>
                  <option value="OTHER">Other</option>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={fetchData}
                className="h-8 w-8 p-0 text-slate-500"
                title="Refresh"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Tab 1: Upcoming Agenda */}
          <TabsContent value="upcoming" className="pt-2">
            <InterviewList
              interviews={upcomingInterviews}
              mode="upcoming"
              searchQuery={searchQuery}
              typeFilter={typeFilter}
              onEdit={handleEdit}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onAddInterview={() => {
                setEditingInterview(null);
                setIsFormOpen(true);
              }}
            />
          </TabsContent>

          {/* Tab 2: Calendar Month View */}
          <TabsContent value="calendar" className="pt-2">
            <CalendarMonth
              interviews={interviews}
              onSelectDay={handleSelectDay}
            />
          </TabsContent>

          {/* Tab 3: History */}
          <TabsContent value="history" className="pt-2">
            <InterviewList
              interviews={historyInterviews}
              mode="history"
              searchQuery={searchQuery}
              typeFilter={typeFilter}
              onEdit={handleEdit}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onAddInterview={() => {
                setEditingInterview(null);
                setIsFormOpen(true);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sheet Form for Add / Edit */}
      <InterviewFormSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        interviewToEdit={editingInterview}
        applications={applications}
        onSuccess={fetchData}
      />

      {/* Complete Interview Dialog */}
      <CompleteInterviewDialog
        open={!!completingInterview}
        onOpenChange={(open) => !open && setCompletingInterview(null)}
        interview={completingInterview}
        onSuccess={fetchData}
      />

      {/* Day Details Modal */}
      <DayInterviewsDialog
        open={isDayDialogOpen}
        onOpenChange={setIsDayDialogOpen}
        date={selectedDay}
        interviews={dayInterviews}
        onEdit={handleEdit}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />
    </div>
  );
}
