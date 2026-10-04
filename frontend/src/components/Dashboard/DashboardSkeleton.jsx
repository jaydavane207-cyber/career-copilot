// frontend/src/components/Dashboard/DashboardSkeleton.jsx
import React from 'react';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Header & Readiness Score Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
            {/* Circle Skeleton */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-slate-200 flex-shrink-0" />
            <div className="space-y-3 w-48 sm:w-64 text-center sm:text-left">
              <div className="h-4 bg-slate-200 rounded w-24 mx-auto sm:mx-0" />
              <div className="h-7 bg-slate-200 rounded w-44 mx-auto sm:mx-0" />
              <div className="h-4 bg-slate-200 rounded w-36 mx-auto sm:mx-0" />
              <div className="h-6 bg-slate-200 rounded-xl w-52 mx-auto sm:mx-0" />
            </div>
          </div>
          <div className="h-9 bg-slate-200 rounded-xl w-32" />
        </div>
      </div>

      {/* 2x2 Key Metrics Skeleton */}
      <div className="space-y-3">
        <div className="h-5 bg-slate-200 rounded w-28" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200" />
                  <div className="space-y-1.5">
                    <div className="h-4 bg-slate-200 rounded w-28" />
                    <div className="h-3 bg-slate-200 rounded w-16" />
                  </div>
                </div>
                <div className="h-6 bg-slate-200 rounded-xl w-14" />
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full w-full" />
              <div className="h-3 bg-slate-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-slate-200" />
            <div className="h-3 bg-slate-200 rounded w-20" />
            <div className="h-6 bg-slate-200 rounded w-12" />
          </div>
        ))}
      </div>

      {/* Breakdown Chart Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="h-5 bg-slate-200 rounded w-48" />
        <div className="h-20 bg-slate-200 rounded-xl w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Next Steps & Activity Timeline Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="h-5 bg-slate-200 rounded w-40" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-200 rounded-xl" />
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="h-5 bg-slate-200 rounded w-40" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
