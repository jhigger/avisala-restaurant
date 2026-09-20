"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import type { OrderSummary } from "~/types/domain";
import {
  Flame,
  Clock,
  CheckCircle2,
  ChefHat,
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

export default function KDSPage() {
  const utils = api.useUtils();

  // Poll orders every 3 seconds
  const { data: orders } = api.order.getAll.useQuery(undefined, {
    refetchInterval: 3000,
  });

  const updateStatusMutation = api.order.updateStatus.useMutation({
    async onMutate(variables) {
      await utils.order.getAll.cancel();
      const previousOrders = utils.order.getAll.getData();

      utils.order.getAll.setData(undefined, (old) => {
        if (!old) return old;
        return old.map((order: OrderSummary) =>
          order.id === variables.orderId
            ? { ...order, status: variables.status }
            : order,
        );
      });

      return { previousOrders };
    },
    onError(err, variables, context) {
      if (context?.previousOrders) {
        utils.order.getAll.setData(undefined, context.previousOrders);
      }
    },
    onSettled() {
      void utils.order.getAll.invalidate();
    },
  });

  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedMinutes = (dateString: Date | string) => {
    const created = new Date(dateString).getTime();
    return Math.floor((currentTime - created) / 60000);
  };

  const pendingOrders: OrderSummary[] =
    orders?.filter((o: OrderSummary) => o.status === "PENDING") ?? [];
  const preparingOrders: OrderSummary[] =
    orders?.filter((o: OrderSummary) => o.status === "PREPARING") ?? [];
  const readyOrders: OrderSummary[] =
    orders?.filter((o: OrderSummary) => o.status === "READY") ?? [];
  const fulfilledOrders: OrderSummary[] =
    orders?.filter((o: OrderSummary) => o.status === "FULFILLED").slice(0, 5) ??
    [];

  const handleAdvanceStatus = (
    orderId: string,
    currentStatus:
      "PENDING" | "PREPARING" | "READY" | "FULFILLED" | "CANCELLED",
  ) => {
    let nextStatus:
      "PENDING" | "PREPARING" | "READY" | "FULFILLED" | "CANCELLED" =
      "PREPARING";
    if (currentStatus === "PENDING") nextStatus = "PREPARING";
    else if (currentStatus === "PREPARING") nextStatus = "READY";
    else if (currentStatus === "READY") nextStatus = "FULFILLED";

    updateStatusMutation.mutate({ orderId, status: nextStatus });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="bg-card border-border flex flex-col items-start justify-between gap-4 rounded-3xl border p-5 shadow-xs sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Operations Portal</span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600">
              <Flame className="h-3 w-3" />
              Kitchen Display System (KDS)
            </span>
          </div>
          <h1 className="text-foreground text-2xl font-black tracking-tight">
            Hearth Station Fulfillment Board
          </h1>
          <p className="text-muted-foreground text-xs">
            Advance orders through kitchen preparation to dispatch. Changes
            instantly reflect on patron tracking screens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-500" />
            Live Synced (3s)
          </span>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* COLUMN 1: PENDING */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-700 dark:text-red-300">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <Clock className="h-3.5 w-3.5" />
              <span>Pending New ({pendingOrders.length})</span>
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {pendingOrders.map((order: OrderSummary) => {
              const elapsed = getElapsedMinutes(order.createdAt);
              const isUrgent = elapsed >= 15;

              return (
                <div
                  key={order.id}
                  className={`bg-card space-y-3 rounded-2xl border p-4 shadow-xs transition-all ${
                    isUrgent
                      ? "border-red-500 ring-1 ring-red-500/40"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-foreground text-sm font-extrabold">
                      #{order.orderNumber}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {order.orderType === "DELIVERY" ? "Delivery" : "Takeout"}
                    </Badge>
                  </div>

                  <div className="text-muted-foreground text-xs">
                    <p className="text-foreground font-semibold">
                      {order.customerName}
                    </p>
                    <p
                      className={`mt-0.5 text-[10px] font-bold ${isUrgent ? "animate-pulse text-red-600" : ""}`}
                    >
                      ⏱ Elapsed: {elapsed} mins ago
                    </p>
                  </div>

                  {/* Dishes list */}
                  <div className="border-border/60 space-y-1 border-t border-b py-2 text-xs">
                    {order.items.map((item: OrderSummary["items"][number]) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-[11px]"
                      >
                        <span className="text-foreground font-medium">
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        {item.spiceLevel !== null && item.spiceLevel > 0 && (
                          <span className="font-bold text-red-500">
                            Lv.{item.spiceLevel}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-1.5 text-[10px] text-amber-700 italic dark:text-amber-300">
                      Note: &quot;{order.specialInstructions}&quot;
                    </p>
                  )}

                  <Button
                    onClick={() => handleAdvanceStatus(order.id, "PENDING")}
                    disabled={updateStatusMutation.isPending}
                    className="flex h-8 w-full items-center justify-center gap-1.5 bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700"
                  >
                    <ChefHat className="h-3.5 w-3.5" />
                    <span>Start Cooking</span>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: PREPARING */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-700 dark:text-amber-300">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <ChefHat className="h-3.5 w-3.5" />
              <span>In Kitchen Prep ({preparingOrders.length})</span>
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {preparingOrders.map((order: OrderSummary) => {
              const elapsed = getElapsedMinutes(order.createdAt);
              const isUrgent = elapsed >= 25;

              return (
                <div
                  key={order.id}
                  className={`bg-card space-y-3 rounded-2xl border p-4 shadow-xs transition-all ${
                    isUrgent
                      ? "border-red-500 ring-1 ring-red-500/40"
                      : "border-amber-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-foreground text-sm font-extrabold">
                      #{order.orderNumber}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {order.orderType === "DELIVERY" ? "Delivery" : "Takeout"}
                    </Badge>
                  </div>

                  <div className="text-muted-foreground text-xs">
                    <p className="text-foreground font-semibold">
                      {order.customerName}
                    </p>
                    <p
                      className={`mt-0.5 text-[10px] font-bold ${isUrgent ? "animate-pulse text-red-600" : "text-amber-600"}`}
                    >
                      ⏱ Elapsed: {elapsed} mins ago
                    </p>
                  </div>

                  <div className="border-border/60 space-y-1 border-t border-b py-2 text-xs">
                    {order.items.map((item: OrderSummary["items"][number]) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-[11px]"
                      >
                        <span className="text-foreground font-medium">
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        {item.spiceLevel !== null && item.spiceLevel > 0 && (
                          <span className="font-bold text-red-500">
                            Lv.{item.spiceLevel}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-1.5 text-[10px] text-amber-700 italic dark:text-amber-300">
                      Note: &quot;{order.specialInstructions}&quot;
                    </p>
                  )}

                  <Button
                    onClick={() => handleAdvanceStatus(order.id, "PREPARING")}
                    disabled={updateStatusMutation.isPending}
                    className="flex h-8 w-full items-center justify-center gap-1.5 bg-amber-600 py-2 text-xs font-bold text-white hover:bg-amber-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Mark Ready for Pickup/Dispatch</span>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: READY */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-sky-700 dark:text-sky-300">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Ready for Handover ({readyOrders.length})</span>
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {readyOrders.map((order: OrderSummary) => (
              <div
                key={order.id}
                className="bg-card space-y-3 rounded-2xl border border-sky-500/40 p-4 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-sm font-extrabold">
                    #{order.orderNumber}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {order.orderType === "DELIVERY"
                      ? "Dispatched"
                      : "Waiting Guest"}
                  </Badge>
                </div>

                <div className="text-muted-foreground text-xs">
                  <p className="text-foreground font-semibold">
                    {order.customerName}
                  </p>
                  <p className="mt-0.5 text-[10px]">{order.customerPhone}</p>
                </div>

                <Button
                  onClick={() => handleAdvanceStatus(order.id, "READY")}
                  disabled={updateStatusMutation.isPending}
                  className="flex h-8 w-full items-center justify-center gap-1.5 bg-sky-600 py-2 text-xs font-bold text-white hover:bg-sky-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Complete &amp; Fulfill</span>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 4: FULFILLED */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-300">
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Fulfilled Banquets</span>
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {fulfilledOrders.map((order: OrderSummary) => (
              <div
                key={order.id}
                className="border-border/70 bg-card space-y-1 rounded-2xl border p-3.5 text-xs opacity-75"
              >
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-bold">
                    #{order.orderNumber}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">
                    Delivered
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  {order.customerName}
                </p>
                <p className="font-bold text-amber-600">
                  ₱{order.totalAmount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
