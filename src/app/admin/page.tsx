"use client";

import React from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import type {
  OrderSummary,
  ReservationDetail,
  DiningTableDetail,
  IngredientDetail,
} from "~/types/domain";
import { Flame, CalendarCheck, ChefHat, AlertTriangle } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { AdminDashboardSkeleton } from "~/components/skeletons/admin-dashboard-skeleton";

export default function AdminDashboardPage() {
  const { data: orders, isLoading: ordersLoading } =
    api.order.getAll.useQuery();
  const { data: tables, isLoading: tablesLoading } =
    api.reserve.getTables.useQuery();
  const { data: reservations, isLoading: reservationsLoading } =
    api.reserve.getReservations.useQuery();
  const { data: ingredients } = api.inventory.getAll.useQuery();
  const { data: staff } = api.staff.getAll.useQuery();

  const isInitialLoading =
    (!orders && ordersLoading) ||
    (!tables && tablesLoading) ||
    (!reservations && reservationsLoading);

  if (isInitialLoading) {
    return <AdminDashboardSkeleton />;
  }

  // Metrics computation
  const activeOrders =
    orders?.filter(
      (o: OrderSummary) => o.status !== "FULFILLED" && o.status !== "CANCELLED",
    ) ?? [];
  const pendingOrders =
    orders?.filter((o: OrderSummary) => o.status === "PENDING") ?? [];
  const occupiedTables =
    tables?.filter((t: DiningTableDetail) => t.status === "OCCUPIED") ?? [];
  const reservedTables =
    tables?.filter((t: DiningTableDetail) => t.status === "RESERVED") ?? [];
  const lowStockIngredients =
    ingredients?.filter((i: IngredientDetail) => i.isLowStock) ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="bg-card border-border flex flex-col items-start justify-between gap-4 rounded-3xl border p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-amber-600"
            >
              Operations Control Center
            </Badge>
            <span className="text-muted-foreground text-xs">
              • Real-Time Synchronization
            </span>
          </div>
          <h1 className="text-foreground mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            Back-of-House Administration
          </h1>
          <p className="text-muted-foreground text-xs">
            Monitor kitchen fulfillment, manage floor tables, track pantry
            stocks, and coordinate staff rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/kds">
            <Button className="flex items-center gap-1.5 bg-amber-600 text-xs font-bold text-white hover:bg-amber-700">
              <Flame className="h-4 w-4" />
              <span>Launch Kitchen Display</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Orders */}
        <Link
          href="/admin/kds"
          className="bg-card border-border group space-y-3 rounded-2xl border p-5 shadow-xs transition-all hover:border-red-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-bold uppercase">
              Active Orders
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground text-3xl font-black">
              {activeOrders.length}
            </div>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              <span className="font-bold text-red-600">
                {pendingOrders.length} pending
              </span>{" "}
              kitchen prep
            </p>
          </div>
        </Link>

        {/* Floor Seating */}
        <Link
          href="/admin/tables"
          className="bg-card border-border group space-y-3 rounded-2xl border p-5 shadow-xs transition-all hover:border-sky-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-bold uppercase">
              Table Occupancy
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground text-3xl font-black">
              {occupiedTables.length} / {tables?.length ?? 14}
            </div>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              <span className="font-bold text-amber-600">
                {reservedTables.length} reserved
              </span>{" "}
              tables today
            </p>
          </div>
        </Link>

        {/* Inventory Alerts */}
        <Link
          href="/admin/inventory"
          className="bg-card border-border group space-y-3 rounded-2xl border p-5 shadow-xs transition-all hover:border-amber-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-bold uppercase">
              Low-Stock Alerts
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground text-3xl font-black">
              {lowStockIngredients.length}
            </div>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              Ingredients below safe threshold
            </p>
          </div>
        </Link>

        {/* Staff on Duty */}
        <Link
          href="/admin/staff"
          className="bg-card border-border group space-y-3 rounded-2xl border p-5 shadow-xs transition-all hover:border-emerald-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-bold uppercase">
              Active Staff Roster
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <ChefHat className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground text-3xl font-black">
              {staff?.length ?? 6}
            </div>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              Across 4 stations (Kitchen, Floor, Bar, Rider)
            </p>
          </div>
        </Link>
      </div>

      {/* DETAILED WORKFLOW PANELS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* RECENT ORDERS FEED */}
        <div className="bg-card border-border space-y-4 rounded-3xl border p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-foreground text-base font-bold">
                Live Order Stream
              </h3>
              <p className="text-muted-foreground text-xs">
                Recent customer orders awaiting fulfillment
              </p>
            </div>
            <Link href="/admin/kds">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold"
              >
                Open KDS Board
              </Button>
            </Link>
          </div>

          <div className="divide-border/60 divide-y">
            {orders?.slice(0, 5).map((order: OrderSummary) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3 py-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-bold">
                      #{order.orderNumber}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {order.orderType}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-[11px]">
                    {order.customerName} • {order.items.length} dishes • ₱
                    {Number(order.totalAmount).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-[10px] font-bold ${
                      order.status === "FULFILLED"
                        ? "bg-emerald-600 text-white"
                        : order.status === "READY"
                          ? "bg-sky-600 text-white"
                          : order.status === "PREPARING"
                            ? "bg-amber-600 text-white"
                            : "bg-red-600 text-white"
                    }`}
                  >
                    {order.status}
                  </Badge>
                  <Link href={`/orders/${order.orderNumber}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                    >
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UPCOMING RESERVATIONS */}
        <div className="bg-card border-border space-y-4 rounded-3xl border p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-foreground text-base font-bold">
                Upcoming Reservations
              </h3>
              <p className="text-muted-foreground text-xs">
                Guest bookings across the 4 dining realms
              </p>
            </div>
            <Link href="/admin/tables">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold"
              >
                View Floorplan
              </Button>
            </Link>
          </div>

          <div className="divide-border/60 divide-y">
            {reservations?.slice(0, 5).map((res: ReservationDetail) => (
              <div
                key={res.id}
                className="flex items-center justify-between gap-3 py-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-bold">
                      {res.guestName}
                    </span>
                    <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px]">
                      {res.partySize} Guests
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-[11px]">
                    {res.realmPreference.replace("_", " ")} • {res.timeSlot}
                  </p>
                </div>

                <Badge
                  className={`text-[10px] font-bold ${
                    res.status === "SEATED"
                      ? "bg-emerald-600 text-white"
                      : res.status === "CONFIRMED"
                        ? "bg-sky-600 text-white"
                        : "bg-muted text-foreground"
                  }`}
                >
                  {res.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
