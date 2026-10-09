"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Copy,
  Check,
  RefreshCw,
  Download,
  AlertTriangle,
  Info,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export const InterviewCalendarFeedCard: React.FC = () => {
  const { toast } = useToast();
  const [feedUrl, setFeedUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchToken = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/calendar/token");
      if (res.ok) {
        const data = await res.json();
        setFeedUrl(data.feedUrl);
      } else {
        throw new Error("Failed to load calendar feed token");
      }
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

  useEffect(() => {
    fetchToken();
  }, []);

  const handleCopy = () => {
    if (!feedUrl) return;
    navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    toast({
      title: "URL Copied",
      description: "Calendar feed link copied to clipboard.",
      variant: "success",
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRegenerate = async () => {
    if (
      !confirm(
        "Are you sure you want to regenerate your calendar token? Any existing calendar subscriptions using the previous link will immediately stop syncing."
      )
    ) {
      return;
    }

    setRegenerating(true);
    try {
      const res = await fetch("/api/calendar/token/regenerate", {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setFeedUrl(data.feedUrl);
        toast({
          title: "Token Regenerated",
          description: "New private calendar feed URL generated. Old link revoked.",
          variant: "success",
        });
      } else {
        throw new Error("Failed to regenerate token");
      }
    } catch (err: any) {
      toast({
        title: "Regeneration Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownload = (scope: "upcoming" | "all" = "all") => {
    window.open(`/api/interviews/ics?scope=${scope}`, "_blank");
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-950">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle>Interview Calendar Sync</CardTitle>
            <CardDescription>
              Subscribe to your live interview schedule in Google Calendar, Apple Calendar, or Outlook via a secure private ICS feed.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tokenized Feed URL section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Interview Calendar Feed URL (Private Token)
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              readOnly
              value={loading ? "Loading private feed link..." : feedUrl}
              className="font-mono text-xs text-slate-600 bg-slate-50 dark:bg-slate-900"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={loading || !feedUrl}
              className="gap-1.5 shrink-0 text-xs font-semibold"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <p className="text-[11px] text-slate-500">
            This URL contains your unique secret token. Keep it private. Anyone with this link can view your scheduled interview rounds.
          </p>
        </div>

        {/* Security & Revocation note */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="text-xs space-y-1">
              <span className="font-semibold text-amber-900 dark:text-amber-200">
                Token Security & Revocation
              </span>
              <p className="text-amber-800 dark:text-amber-300">
                If you ever accidentally share this feed link or want to invalidate access from an old device, click <strong>Regenerate Token</strong> below. It creates a brand-new token and instantly invalidates the previous link.
              </p>
            </div>
          </div>
        </div>

        {/* How to Subscribe guide */}
        <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-blue-600" />
            How to Subscribe (No Google OAuth required)
          </h4>
          <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <strong>Google Calendar:</strong> Click <em>&quot;Other calendars +&quot;</em> &rarr; <em>&quot;From URL&quot;</em>, then paste your Feed URL.
            </li>
            <li>
              <strong>Apple Calendar:</strong> Go to <em>File</em> &rarr; <em>New Calendar Subscription</em>, paste the URL, and select auto-refresh frequency.
            </li>
            <li>
              <strong>Microsoft Outlook:</strong> Select <em>&quot;Add calendar&quot;</em> &rarr; <em>&quot;Subscribe from web&quot;</em>, paste the URL and save.
            </li>
          </ol>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRegenerate}
            disabled={regenerating || loading}
            className="gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
            Regenerate Token
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDownload("all")}
            className="gap-1.5 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            Download All (.ics)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDownload("upcoming")}
            className="gap-1.5 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            Download Upcoming (.ics)
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
