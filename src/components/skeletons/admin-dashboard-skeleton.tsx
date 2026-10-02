import * as React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function AdminDashboardSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-testid="admin-dashboard-skeleton"
      className={cn(
        "mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8",
        className,
      )}
    >
      {/* Header Skeleton */}
      <div className="bg-card border-border flex flex-col items-start justify-between gap-4 rounded-3xl border p-6 shadow-xs sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-44 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-44 rounded-xl" />
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            data-testid="admin-kpi-skeleton"
            className="bg-card border-border space-y-3 rounded-2xl border p-5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* 2 Feed Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Live Order Stream Panel */}
        <div
          data-testid="admin-feed-orders-skeleton"
          className="bg-card border-border space-y-4 rounded-3xl border p-6 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-52" />
            </div>
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>

          <div className="divide-border/60 divide-y">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-40" />
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reservations Feed Panel */}
        <div
          data-testid="admin-feed-reservations-skeleton"
          className="bg-card border-border space-y-4 rounded-3xl border p-6 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-48" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>

          <div className="divide-border/60 divide-y">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-36" />
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
