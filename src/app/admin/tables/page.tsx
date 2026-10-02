"use client";

import React, { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import type { DiningTableDetail, ReservationDetail } from "~/types/domain";
import { CalendarCheck, Users, ArrowLeft, UserCheck } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { AdminTablesSkeleton } from "~/components/skeletons/admin-tables-skeleton";

export default function AdminTablesPage() {
  const utils = api.useUtils();
  const [selectedRealmFilter, setSelectedRealmFilter] = useState("ALL");

  const { data: tables, isLoading: tablesLoading } =
    api.reserve.getTables.useQuery();
  const { data: reservations, isLoading: reservationsLoading } =
    api.reserve.getReservations.useQuery();

  const updateTableStatusMutation = api.reserve.updateTableStatus.useMutation({
    async onMutate(variables) {
      await utils.reserve.getTables.cancel();
      const previousTables = utils.reserve.getTables.getData();

      utils.reserve.getTables.setData(undefined, (old) => {
        if (!old) return old;
        return old.map((table: DiningTableDetail) =>
          table.id === variables.tableId
            ? { ...table, status: variables.status }
            : table,
        );
      });

      return { previousTables };
    },
    onError(err, variables, context) {
      if (context?.previousTables) {
        utils.reserve.getTables.setData(undefined, context.previousTables);
      }
    },
    onSettled() {
      void utils.reserve.getTables.invalidate();
    },
  });

  const updateReservationStatusMutation = api.reserve.updateStatus.useMutation({
    async onMutate(variables) {
      await utils.reserve.getReservations.cancel();
      await utils.reserve.getTables.cancel();
      const previousReservations = utils.reserve.getReservations.getData();
      const previousTables = utils.reserve.getTables.getData();

      // Find the reservation being updated
      const targetRes = previousReservations?.find(
        (r: ReservationDetail) => r.id === variables.reservationId,
      );

      // Optimistically update reservation
      utils.reserve.getReservations.setData(undefined, (old) => {
        if (!old) return old;
        return old.map((res: ReservationDetail) =>
          res.id === variables.reservationId
            ? { ...res, status: variables.status }
            : res,
        );
      });

      // If seating a reservation with an assigned table, optimistically mark table OCCUPIED
      if (targetRes?.tableId) {
        const tableId = targetRes.tableId;
        utils.reserve.getTables.setData(undefined, (old) => {
          if (!old) return old;
          return old.map((table: DiningTableDetail) => {
            if (table.id === tableId) {
              if (variables.status === "SEATED")
                return { ...table, status: "OCCUPIED" };
              if (
                variables.status === "COMPLETED" ||
                variables.status === "CANCELLED"
              )
                return { ...table, status: "AVAILABLE" };
            }
            return table;
          });
        });
      }

      return { previousReservations, previousTables };
    },
    onError(err, variables, context) {
      if (context?.previousReservations) {
        utils.reserve.getReservations.setData(
          undefined,
          context.previousReservations,
        );
      }
      if (context?.previousTables) {
        utils.reserve.getTables.setData(undefined, context.previousTables);
      }
    },
    onSettled() {
      void utils.reserve.getReservations.invalidate();
      void utils.reserve.getTables.invalidate();
    },
  });

  const filteredTables =
    tables?.filter((t: DiningTableDetail) => {
      if (selectedRealmFilter !== "ALL" && t.realm !== selectedRealmFilter)
        return false;
      return true;
    }) ?? [];

  const handleSeatReservation = (resId: string) => {
    updateReservationStatusMutation.mutate({
      reservationId: resId,
      status: "SEATED",
    });
  };

  const handleCompleteReservation = (resId: string) => {
    updateReservationStatusMutation.mutate({
      reservationId: resId,
      status: "COMPLETED",
    });
  };

  if ((!tables && tablesLoading) || (!reservations && reservationsLoading)) {
    return <AdminTablesSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
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
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-600">
              <CalendarCheck className="h-3 w-3" />
              Table Floor Plan &amp; Host Desk
            </span>
          </div>
          <h1 className="text-foreground text-2xl font-black tracking-tight">
            Elemental Halls Seating &amp; Reservations
          </h1>
          <p className="text-muted-foreground text-xs">
            Manage table turnover, seat arriving guests, and oversee capacity
            across all four kingdoms.
          </p>
        </div>

        {/* Realm Selector Filter */}
        <div className="bg-muted/60 border-border flex flex-wrap items-center gap-1 rounded-xl border p-1">
          {[
            "ALL",
            "LIREO_TERRACE",
            "HATHORIAN_HEARTH",
            "SAPIRO_HALL",
            "ADAMYA_LAGOON",
          ].map((r: string) => (
            <button
              key={r}
              onClick={() => setSelectedRealmFilter(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedRealmFilter === r
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "ALL"
                ? "All Realms"
                : r === "LIREO_TERRACE"
                  ? "Lireo"
                  : r === "HATHORIAN_HEARTH"
                    ? "Hathoria"
                    : r === "SAPIRO_HALL"
                      ? "Sapiro"
                      : "Adamya"}
            </button>
          ))}
        </div>
      </div>

      {/* FLOOR PLAN TABLE GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-lg font-bold">
            Table Status Grid
          </h2>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />{" "}
              Available
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Occupied
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />{" "}
              Reserved
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTables.map((table: DiningTableDetail) => {
            const isAvailable = table.status === "AVAILABLE";
            const isOccupied = table.status === "OCCUPIED";
            const isReserved = table.status === "RESERVED";

            return (
              <div
                key={table.id}
                className={`bg-card space-y-3 rounded-2xl border p-5 shadow-xs transition-all ${
                  isOccupied
                    ? "border-red-500/40 bg-red-500/2"
                    : isReserved
                      ? "border-amber-500/40 bg-amber-500/2"
                      : "border-emerald-500/40 bg-emerald-500/2"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-muted text-foreground flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black">
                      {table.tableNumber}
                    </span>
                    <div>
                      <p className="text-foreground text-xs font-bold">
                        {table.realm.replace("_", " ")}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1 text-[10px]">
                        <Users className="h-3 w-3" />
                        <span>Up to {table.capacity} guests</span>
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={`text-[10px] font-bold ${
                      isOccupied
                        ? "bg-red-600 text-white"
                        : isReserved
                          ? "bg-amber-600 text-white"
                          : "bg-emerald-600 text-white"
                    }`}
                  >
                    {table.status}
                  </Badge>
                </div>

                {/* Status Toggle Actions */}
                <div className="border-border/50 grid grid-cols-3 gap-1 border-t pt-2 text-center">
                  <button
                    onClick={() =>
                      updateTableStatusMutation.mutate({
                        tableId: table.id,
                        status: "AVAILABLE",
                      })
                    }
                    className={`rounded-md border py-1 text-[10px] font-bold transition-all ${
                      isAvailable
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Free
                  </button>

                  <button
                    onClick={() =>
                      updateTableStatusMutation.mutate({
                        tableId: table.id,
                        status: "OCCUPIED",
                      })
                    }
                    className={`rounded-md border py-1 text-[10px] font-bold transition-all ${
                      isOccupied
                        ? "border-red-600 bg-red-600 text-white"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Seat
                  </button>

                  <button
                    onClick={() =>
                      updateTableStatusMutation.mutate({
                        tableId: table.id,
                        status: "RESERVED",
                      })
                    }
                    className={`rounded-md border py-1 text-[10px] font-bold transition-all ${
                      isReserved
                        ? "border-amber-600 bg-amber-600 text-white"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Hold
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RESERVATIONS LOG & GUEST CHECK-IN */}
      <div className="bg-card border-border space-y-4 rounded-3xl border p-6 shadow-xs">
        <h2 className="text-foreground text-lg font-bold">
          Guest Reservations &amp; Check-In Queue
        </h2>

        <div className="divide-border/60 divide-y">
          {reservations?.map((res: ReservationDetail) => (
            <div
              key={res.id}
              className="flex flex-col justify-between gap-3 py-3.5 text-xs sm:flex-row sm:items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-sm font-bold">
                    {res.guestName}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    Ref: {res.bookingReference}
                  </Badge>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {res.partySize} Guests
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  {res.realmPreference.replace("_", " ")}{" "}
                  {res.table
                    ? `(Table ${res.table.tableNumber})`
                    : "(Unassigned)"}{" "}
                  • Slot:{" "}
                  <span className="text-foreground font-medium">
                    {res.timeSlot}
                  </span>{" "}
                  • Phone: {res.guestPhone}
                </p>
                {res.specialRequests && (
                  <p className="text-[10px] text-amber-600 italic dark:text-amber-400">
                    Request: &quot;{res.specialRequests}&quot;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
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

                {res.status === "CONFIRMED" && (
                  <Button
                    onClick={() => handleSeatReservation(res.id)}
                    size="sm"
                    className="flex h-8 items-center gap-1 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Seat Patron</span>
                  </Button>
                )}

                {res.status === "SEATED" && (
                  <Button
                    onClick={() => handleCompleteReservation(res.id)}
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs font-semibold"
                  >
                    Complete Dining
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
