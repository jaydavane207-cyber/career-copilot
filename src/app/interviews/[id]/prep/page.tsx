// src/app/interviews/[id]/prep/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  Sparkles,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  Award,
  AlertTriangle,
  Lightbulb,
  Building,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Compass,
  HelpCircle,
  ListCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { InterviewPrepPlan } from "@/lib/interviewPrep/schemas";

export default function InterviewPrepPage() {
  const params = useParams();
  const interviewId = params?.id as string;
  const { toast } = useToast();

  const [data, setData] = useState<InterviewPrepPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interactive checklist state (persisted to localStorage)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  // Expanded questions state
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({
    0: true, // first question expanded by default
  });

  const storageKey = `career_copilot_prep_checklist_${interviewId}`;

  const fetchPrepPlan = useCallback(async () => {
    if (!interviewId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/interviews/${interviewId}/prep-plan`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      } else {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to load prep plan");
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Prep Plan Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [interviewId, toast]);

  useEffect(() => {
    fetchPrepPlan();

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      }
    } catch {
      // Local storage read error handling
    }
  }, [fetchPrepPlan, storageKey]);

  const toggleChecklist = (id: string) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // Local storage write error handling
      }
      return updated;
    });
  };

  const toggleQuestion = (idx: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedChecklistCount = data?.checklist
    ? data.checklist.filter((item) => !!checkedItems[item.id]).length
    : 0;

  const totalChecklistCount = data?.checklist?.length || 1;
  const checklistPercent = Math.round(
    (completedChecklistCount / totalChecklistCount) * 100
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-96 md:col-span-2 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 p-3 text-rose-600 dark:bg-rose-900/40">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Unable to Load Interview Preparation Plan
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {error || "Interview not found. Please verify the interview ID or try again."}
        </p>
        <Link href="/interviews">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Calendar
          </Button>
        </Link>
      </div>
    );
  }

  const startDate = new Date(data.scheduledStart);
  const isCritical = data.urgencyLevel === "critical";
  const isHigh = data.urgencyLevel === "high";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/interviews"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Interviews
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPrepPlan}
            className="text-xs h-8 gap-1.5"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh Plan
          </Button>

          {data.meetingLink && (
            <a
              href={data.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 gap-1.5 shadow-sm">
                <Video className="h-3.5 w-3.5" />
                Join Video Meeting
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${
          isCritical
            ? "border-rose-300 bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:border-rose-900 dark:from-slate-900 dark:to-slate-900"
            : isHigh
            ? "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-indigo-50 dark:border-amber-900 dark:from-slate-900 dark:to-slate-900"
            : "border-slate-200 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900"
        }`}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={isCritical ? "destructive" : isHigh ? "warning" : "default"}
                className="text-xs px-2.5 py-0.5 uppercase tracking-wider font-bold"
              >
                {data.urgencyLevel} Urgency
              </Badge>
              <Badge variant="outline" className="text-xs">
                {data.roundType} Round
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {data.mode === "ONLINE" ? "Online Call" : "On-site Interview"}
              </Badge>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {data.company} &bull; {data.roundTitle}
              </h1>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Target Role: <span className="font-semibold text-slate-900 dark:text-slate-200">{data.role}</span>
              </p>
            </div>

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-600 dark:text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>{format(startDate, "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{format(startDate, "h:mm a")} ({data.durationMin} mins)</span>
              </div>
              {data.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{data.location}</span>
                </div>
              )}
              {data.interviewerName && (
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Interviewer: {data.interviewerName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Countdown Clock Widget */}
          <div className="flex flex-col items-start lg:items-end justify-center rounded-xl bg-white/90 p-5 shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-800/80 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Countdown to Interview
            </span>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {data.timeUntil}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {data.hoursUntil > 0 ? `${data.hoursUntil} hours remaining` : "Scheduled time reached"}
            </p>
          </div>
        </div>

        {/* Candidate Notes if any */}
        {data.notes && (
          <div className="mt-5 rounded-lg bg-white/70 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-slate-100">Your Notes: </span>
            {data.notes}
          </div>
        )}
      </div>

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2 Cols): Daily Prep Plan & Company Questions */}
        <div className="space-y-8 lg:col-span-2">
          {/* Section: Actionable Daily Prep Plan */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-base font-bold">
                  Tailored Daily Preparation Roadmap
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <Tabs defaultValue="today" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="today" className="text-xs font-semibold">
                    Today&apos;s Focus
                  </TabsTrigger>
                  <TabsTrigger value="tomorrow" className="text-xs font-semibold">
                    Leading Up
                  </TabsTrigger>
                  <TabsTrigger value="tday" className="text-xs font-semibold">
                    Interview Day
                  </TabsTrigger>
                </TabsList>

                {/* Today's Tasks */}
                <TabsContent value="today" className="space-y-3">
                  <p className="text-xs text-slate-500 font-medium">
                    High-yield, immediate tasks to complete today for maximum preparation impact:
                  </p>
                  <div className="space-y-2">
                    {data.prepPlan.today.map((taskText, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/50"
                      >
                        <div className="mt-0.5 rounded-full bg-indigo-600 text-white w-4 h-4 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                          {taskText}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Tomorrow's Tasks */}
                <TabsContent value="tomorrow" className="space-y-3">
                  <p className="text-xs text-slate-500 font-medium">
                    Comprehensive practice and reinforcement tasks prior to the round:
                  </p>
                  <div className="space-y-2">
                    {(data.prepPlan.tomorrow || [
                      "Conduct 1 mock interview session under strict exam time limits",
                      "Review company culture values and formulate behavioral talking points",
                      "Prepare 3 strategic questions to ask the interviewer",
                    ]).map((taskText, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/50"
                      >
                        <div className="mt-0.5 rounded-full bg-blue-600 text-white w-4 h-4 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                          {taskText}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Interview Day Tasks */}
                <TabsContent value="tday" className="space-y-3">
                  <p className="text-xs text-slate-500 font-medium">
                    Final hours checklist to maintain peak technical and psychological readiness:
                  </p>
                  <div className="space-y-2">
                    {data.prepPlan.interviewDay.map((taskText, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/50"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                          {taskText}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Section: Company Intelligence & High-Frequency Questions */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base font-bold">
                    {data.companyIntel.name} Intelligence &amp; Top Questions
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  Difficulty: {data.companyIntel.difficulty}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-5">
              {/* Culture & Values overview */}
              <div className="rounded-lg bg-blue-50/50 p-3.5 text-xs text-blue-950 dark:bg-blue-950/20 dark:text-blue-100 space-y-2 border border-blue-100 dark:border-blue-900/50">
                <div className="font-bold uppercase tracking-wider text-[11px] text-blue-800 dark:text-blue-300">
                  Culture &amp; What They Look For:
                </div>
                <p className="leading-relaxed">{data.companyIntel.cultureSummary}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {data.companyIntel.keyValues.map((val, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-blue-700 shadow-xs dark:bg-slate-800 dark:text-blue-300"
                    >
                      &bull; {val}
                    </span>
                  ))}
                </div>
              </div>

              {/* Insider Tips */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Insider Interview Tips:
                </span>
                <ul className="space-y-1.5">
                  {data.companyIntel.tipsForInterview.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Top Interview Questions */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Top High-Frequency Questions:
                </span>
                <div className="space-y-3">
                  {data.companyIntel.topQuestions.map((q, idx) => {
                    const isExpanded = !!expandedQuestions[idx];
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
                      >
                        <div
                          onClick={() => toggleQuestion(idx)}
                          className="flex cursor-pointer items-start justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                        >
                          <div className="space-y-1 pr-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {q.category}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {q.difficulty}
                              </Badge>
                            </div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                              {q.question}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="text-slate-400 p-1"
                            aria-label="Toggle solution details"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-slate-100 bg-slate-50/70 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/40 space-y-2.5">
                            {q.sampleAnswerSnippet && (
                              <div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  Sample Answer Approach:
                                </span>
                                <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {q.sampleAnswerSnippet}
                                </p>
                              </div>
                            )}

                            {q.tips && q.tips.length > 0 && (
                              <div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  Key Pointers to Mention:
                                </span>
                                <ul className="mt-1 list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                                  {q.tips.map((tipItem, tIdx) => (
                                    <li key={tIdx}>{tipItem}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section: Reverse Questions Candidates Should Ask */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-base font-bold">
                  Questions to Ask the Interviewer
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <p className="text-xs text-slate-500">
                End every interview with high-conviction reverse questions demonstrating architectural thinking and cultural engagement:
              </p>
              <div className="space-y-2">
                {data.reverseQuestionsToAsk.map((qText, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-100 p-2.5 text-xs text-slate-700 dark:border-slate-800 dark:text-slate-300"
                  >
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      Q{idx + 1}:
                    </span>
                    <span>&ldquo;{qText}&rdquo;</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Interactive Checklist, Resources, Learning Path */}
        <div className="space-y-8">
          {/* Section: Interactive Pre-Interview Checklist */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListCheck className="h-5 w-5 text-emerald-600" />
                  <CardTitle className="text-base font-bold">Equipment &amp; Readiness Checklist</CardTitle>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {completedChecklistCount}/{totalChecklistCount}
                </span>
              </div>
              <div className="pt-2">
                <Progress value={checklistPercent} className="h-2" />
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-2.5">
              {data.checklist.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-lg p-2.5 text-xs transition ${
                      isChecked
                        ? "bg-emerald-50 text-emerald-900 line-through dark:bg-emerald-950/20 dark:text-emerald-300"
                        : "hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    <button
                      type="button"
                      aria-label={isChecked ? "Uncheck" : "Check"}
                      className="mt-0.5 shrink-0"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                    <span className="leading-snug">{item.text}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Section: Curated 100% Free Learning Resources */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-base font-bold">Curated Free Study Material</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <p className="text-xs text-slate-500">
                100% free courses and reference documentation selected for this round:
              </p>
              <div className="space-y-2">
                {data.resources.map((res) => (
                  <a
                    key={res.id}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-lg border border-slate-200 p-2.5 hover:border-indigo-300 hover:bg-indigo-50/20 dark:border-slate-800 dark:hover:border-indigo-800 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-[10px] px-1 py-0">
                            {res.type}
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {res.source} &bull; {res.durationMinutes}m
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                          {res.title}
                        </p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-1" />
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section: Connected Learning Path */}
          {data.learningPathIntegration && (
            <Card className="shadow-sm border-blue-100 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/40 via-white to-slate-50 dark:from-slate-900 dark:to-slate-900">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base font-bold">Connected Learning Path</CardTitle>
                  </div>
                  <Link href="/learning-path">
                    <Button size="sm" variant="ghost" className="text-xs h-7 gap-1 text-blue-600">
                      View Path &rarr;
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  From active plan: <span className="font-semibold">{data.learningPathIntegration.activePathTitle}</span>
                </p>

                {data.learningPathIntegration.matchingTasks.length > 0 ? (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Relevant Tasks to Complete:
                    </span>
                    {data.learningPathIntegration.matchingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-lg bg-white p-2 text-xs border border-blue-100 shadow-xs dark:bg-slate-800 dark:border-slate-700"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {task.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                            {task.durationMin}m
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    All tasks in your current week are completed. Keep practicing!
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
