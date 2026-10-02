import * as React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function MenuItemCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-testid="menu-item-skeleton-card"
      className={cn(
        "bg-card border-border flex flex-col overflow-hidden rounded-2xl border shadow-xs",
        className,
      )}
    >
      {/* Thumbnail placeholder with badge slots */}
      <div className="bg-muted/40 relative h-44 w-full">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>

      {/* Card Details */}
      <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>

        {/* Dietary tags */}
        <div className="flex gap-1 pt-1">
          <Skeleton className="h-4 w-10 rounded-full" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>

        {/* Price & Action */}
        <div className="border-border/60 flex items-center justify-between border-t pt-3">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function MenuItemSkeletonGrid({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      data-testid="menu-item-skeleton-grid"
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <MenuItemCardSkeleton key={i} />
      ))}
    </div>
  );
}
