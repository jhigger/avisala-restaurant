import React from "react";
import { MenuItemSkeletonGrid } from "~/components/skeletons/menu-item-skeleton";
import { Skeleton } from "~/components/ui/skeleton";

export default function MenuLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Menu Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl md:w-72" />
      </div>

      {/* Kingdom Tabs Skeleton */}
      <div className="bg-muted/40 border-border grid grid-cols-2 gap-2 rounded-2xl border p-1.5 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-xl" />
        ))}
      </div>

      {/* Categories & Dietary Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-7 w-36 rounded-full" />
      </div>

      {/* 8-Card Grid Skeleton */}
      <MenuItemSkeletonGrid count={8} />
    </div>
  );
}
