import * as React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function AdminTablesSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-testid="admin-tables-skeleton"
      className={cn(
        "mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8",
        className,
      )}
    >
      {/* Top Header */}
      <div className="bg-card border-border flex flex-col items-start justify-between gap-4 rounded-3xl border p-5 shadow-xs sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-44 rounded-full" />
          </div>
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        {/* Realm Selector Filter Skeleton */}
        <div className="bg-muted/40 border-border flex flex-wrap items-center gap-1 rounded-xl border p-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Table Status Grid */}
      <div data-testid="tables-grid-skeleton" className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border-border space-y-3 rounded-2xl border p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              <div className="border-border/50 flex items-center justify-between border-t pt-3">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Active Reservations Panel */}
      <div className="bg-card border-border space-y-4 rounded-3xl border p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3.5 w-64" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        <div className="divide-border/60 divide-y">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
