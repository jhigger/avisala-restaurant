import * as React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function KDSSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-testid="kds-skeleton"
      className={cn(
        "mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8",
        className,
      )}
    >
      {/* Top Header */}
      <div className="bg-card border-border flex flex-col items-start justify-between gap-4 rounded-3xl border p-5 shadow-xs sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-48 rounded-full" />
          </div>
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>

      {/* 4 Kanban Columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, colIndex) => (
          <div
            key={colIndex}
            data-testid="kds-column-skeleton"
            className="flex flex-col space-y-3"
          >
            {/* Column Header */}
            <div className="border-border bg-muted/40 rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-6 rounded-full" />
              </div>
            </div>

            {/* Ticket Cards */}
            <div className="flex-1 space-y-3">
              {Array.from({ length: colIndex === 0 ? 3 : 2 }).map(
                (_, cardIndex) => (
                  <div
                    key={cardIndex}
                    className="bg-card border-border space-y-3 rounded-2xl border p-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-16 rounded-md" />
                    </div>

                    <div className="space-y-1.5 py-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>

                    <div className="border-border/50 space-y-1 border-t pt-2">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-4/5" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 w-24 rounded-xl" />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
