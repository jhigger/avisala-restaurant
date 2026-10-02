import * as React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function OrderTrackingSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-testid="order-tracking-skeleton"
      className={cn(
        "mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8",
        className,
      )}
    >
      {/* Back button placeholder */}
      <Skeleton className="h-8 w-28 rounded-lg" />

      {/* Header Banner Card */}
      <div className="bg-card border-border space-y-4 rounded-3xl border p-6 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* ETA Banner */}
        <div className="border-border/60 bg-muted/30 rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3.5 w-64" />
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Fulfillment Stepper Timeline */}
      <div
        data-testid="order-timeline-skeleton"
        className="bg-card border-border space-y-6 rounded-3xl border p-6 shadow-xs"
      >
        <div className="space-y-1">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3.5 w-60" />
        </div>

        {/* 4 Stepper nodes */}
        <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center space-y-2 text-center"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Items + Customer Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Items Breakdown (2 cols) */}
        <div className="bg-card border-border space-y-4 rounded-3xl border p-6 shadow-xs md:col-span-2">
          <Skeleton className="h-5 w-32" />
          <div className="divide-border/60 space-y-3 divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-14" />
              </div>
            ))}
          </div>

          <div className="border-border/60 space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>

        {/* Delivery / Contact Card (1 col) */}
        <div className="bg-card border-border space-y-4 rounded-3xl border p-6 shadow-xs">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
