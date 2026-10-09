import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ToastProvider } from "@/components/ui/toast";
import { Calendar, LayoutDashboard, Briefcase, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Career Copilot - Interview Tracker & Calendar",
  description: "Track and organize job applications and interview rounds with calendar integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6">
                  <Link href="/dashboard" className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                    <span className="rounded-lg bg-blue-600 px-2 py-1 text-xs text-white">CC</span>
                    <span className="tracking-tight text-slate-900 dark:text-white">Career Copilot</span>
                  </Link>
                  <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/interviews"
                      className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                      <Calendar className="h-4 w-4" />
                      Interviews
                    </Link>
                    <Link
                      href="/applications"
                      className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                      <Briefcase className="h-4 w-4" />
                      Applications
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/settings/calendar"
                    className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Calendar Sync
                  </Link>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
