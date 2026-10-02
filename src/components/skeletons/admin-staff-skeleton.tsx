import * as React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function AdminStaffSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-testid="admin-staff-skeleton"
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
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      {/* Royal Staff Brigade Cards */}
      <div data-testid="staff-brigade-skeleton" className="space-y-3">
        <Skeleton className="h-6 w-44" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-border bg-card flex flex-col items-center space-y-2 rounded-2xl border p-4 text-center shadow-xs"
            >
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex w-full flex-col items-center space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Weekly 7-Day Shift Roster */}
      <div
        data-testid="staff-roster-skeleton"
        className="bg-card border-border space-y-6 rounded-3xl border p-6 shadow-xs"
      >
        <div className="space-y-1">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-3.5 w-80 max-w-full" />
        </div>

        {/* 7 Day Columns */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <div
              key={dayIndex}
              data-testid="staff-day-skeleton"
              className="bg-muted/30 border-border flex flex-col space-y-2.5 rounded-2xl border p-3"
            >
              {/* Day header */}
              <div className="border-border/60 flex items-center justify-between border-b pb-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-5 rounded-full" />
              </div>

              {/* Shifts */}
              <div className="space-y-2">
                {Array.from({ length: dayIndex % 2 === 0 ? 2 : 1 }).map(
                  (_, sIndex) => (
                    <div
                      key={sIndex}
                      className="bg-card border-border space-y-2 rounded-xl border p-2.5 shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-3.5 w-16" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full rounded-md" />
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
