"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import type { StaffMember, ShiftItem } from "~/types/domain";
import { DayOfWeek } from "@prisma/client";
import {
  ChefHat,
  Clock,
  Plus,
  ArrowLeft,
  Trash2,
  Flame,
  Droplets,
  Wind,
  Mountain,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";

export default function AdminStaffPage() {
  const utils = api.useUtils();

  const { data: staffList } = api.staff.getAll.useQuery();
  const { data: shifts } = api.staff.getShifts.useQuery();

  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(DayOfWeek.Monday);
  const [startTime, setStartTime] = useState("10:00 AM");
  const [endTime, setEndTime] = useState("06:00 PM");
  const [station, setStation] = useState("Kitchen Hearth");

  const createShiftMutation = api.staff.createShift.useMutation({
    async onMutate(variables) {
      await utils.staff.getShifts.cancel();
      const previousShifts = utils.staff.getShifts.getData();
      const staffMember = staffList?.find(
        (m: StaffMember) => m.id === variables.staffId,
      );

      if (staffMember) {
        const optimisticShift: ShiftItem = {
          id: `temp-${Date.now()}`,
          staffId: variables.staffId,
          dayOfWeek: variables.dayOfWeek,
          startTime: variables.startTime,
          endTime: variables.endTime,
          station: variables.station,
          staff: staffMember,
        };

        utils.staff.getShifts.setData(undefined, (old) => {
          if (!old) return [optimisticShift];
          return [...old, optimisticShift];
        });
      }

      setIsAddShiftOpen(false);

      return { previousShifts };
    },
    onError(err, variables, context) {
      if (context?.previousShifts) {
        utils.staff.getShifts.setData(undefined, context.previousShifts);
      }
    },
    onSettled() {
      void utils.staff.getShifts.invalidate();
      void utils.staff.getAll.invalidate();
    },
  });

  const deleteShiftMutation = api.staff.deleteShift.useMutation({
    async onMutate(variables) {
      await utils.staff.getShifts.cancel();
      const previousShifts = utils.staff.getShifts.getData();

      utils.staff.getShifts.setData(undefined, (old) => {
        if (!old) return old;
        return old.filter((s: ShiftItem) => s.id !== variables.id);
      });

      return { previousShifts };
    },
    onError(err, variables, context) {
      if (context?.previousShifts) {
        utils.staff.getShifts.setData(undefined, context.previousShifts);
      }
    },
    onSettled() {
      void utils.staff.getShifts.invalidate();
      void utils.staff.getAll.invalidate();
    },
  });

  const days: DayOfWeek[] = [
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday,
    DayOfWeek.Saturday,
    DayOfWeek.Sunday,
  ];
  const stations = [
    "Kitchen Hearth",
    "Elixir Bar",
    "Dining Floor",
    "Delivery Wing",
  ];

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;

    createShiftMutation.mutate({
      staffId: selectedStaffId,
      dayOfWeek,
      startTime,
      endTime,
      station,
    });
  };

  const getAffinityIcon = (affinity: string) => {
    switch (affinity) {
      case "LIREO":
        return <Wind className="h-3.5 w-3.5 text-emerald-600" />;
      case "HATHORIA":
        return <Flame className="h-3.5 w-3.5 text-red-600" />;
      case "SAPIRO":
        return <Mountain className="h-3.5 w-3.5 text-amber-600" />;
      case "ADAMYA":
        return <Droplets className="h-3.5 w-3.5 text-sky-600" />;
      default:
        return null;
    }
  };

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
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
              <ChefHat className="h-3 w-3" />
              Staff Administration &amp; Roster
            </span>
          </div>
          <h1 className="text-foreground text-2xl font-black tracking-tight">
            Weekly Station Shifts &amp; Royal Brigade
          </h1>
          <p className="text-muted-foreground text-xs">
            Schedule culinary masters, alchemists, and couriers across the four
            operational stations.
          </p>
        </div>

        <Button
          onClick={() => {
            if (staffList && staffList.length > 0) {
              setSelectedStaffId(staffList[0]!.id);
            }
            setIsAddShiftOpen(true);
          }}
          className="flex items-center gap-1.5 bg-amber-600 text-xs font-bold text-white hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" />
          <span>Assign New Shift</span>
        </Button>
      </div>

      {/* STAFF BRIGADE CARDS */}
      <div className="space-y-3">
        <h2 className="text-foreground text-lg font-bold">
          Royal Staff Brigade
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {staffList?.map((member: StaffMember) => (
            <div
              key={member.id}
              className="border-border bg-card flex flex-col items-center space-y-2 rounded-2xl border p-4 text-center shadow-xs"
            >
              <div className="bg-muted border-border relative mb-1 h-14 w-14 overflow-hidden rounded-full border-2">
                {member.avatarUrl ? (
                  <Image
                    src={member.avatarUrl}
                    alt={member.fullName}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold">
                    {member.fullName.slice(0, 2)}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-foreground text-xs font-bold">
                  {member.fullName}
                </h3>
                <p className="text-muted-foreground line-clamp-1 text-[10px]">
                  {member.title}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {getAffinityIcon(member.kingdomAffinity)}
                <Badge variant="outline" className="text-[9px] font-semibold">
                  {member.role.replace("_", " ")}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-DAY WEEKLY SCHEDULE ROSTER */}
      <div className="bg-card border-border space-y-6 rounded-3xl border p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground text-lg font-bold">
              Weekly 7-Day Shift Roster
            </h2>
            <p className="text-muted-foreground text-xs">
              Station coverage across Kitchen Hearth, Elixir Bar, Dining Floor,
              and Delivery Wing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
          {days.map((day: DayOfWeek) => {
            const dayShifts =
              shifts?.filter((s: ShiftItem) => s.dayOfWeek === day) ?? [];

            return (
              <div
                key={day}
                className="border-border bg-muted/20 flex min-h-75 flex-col space-y-2.5 rounded-2xl border p-3"
              >
                <div className="bg-card border-border/80 text-foreground rounded-xl border p-2 text-center text-xs font-bold shadow-2xs">
                  {day}
                  <span className="text-muted-foreground block text-[10px] font-normal">
                    {dayShifts.length} shifts
                  </span>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {dayShifts.map((shift: ShiftItem) => (
                    <div
                      key={shift.id}
                      className="border-border/70 bg-card group relative space-y-1 rounded-xl border p-2.5 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-foreground line-clamp-1 text-[11px] font-bold">
                          {shift.staff.fullName}
                        </span>
                        <button
                          onClick={() =>
                            deleteShiftMutation.mutate({ id: shift.id })
                          }
                          className="text-muted-foreground hover:text-destructive p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                        <Clock className="h-3 w-3" />
                        <span>
                          {shift.startTime} - {shift.endTime}
                        </span>
                      </div>

                      <span className="inline-block rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium text-amber-700 dark:text-amber-300">
                        {shift.station}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ASSIGN SHIFT MODAL */}
      <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Assign Staff Shift
            </DialogTitle>
            <DialogDescription className="text-xs">
              Assign a staff member to an operational station for the weekly
              schedule.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateShift} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <Label className="text-xs">Staff Member</Label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="bg-card border-border w-full rounded-xl border p-2 text-xs"
                required
              >
                {staffList?.map((s: StaffMember) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Day of Week</Label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                  className="bg-card border-border w-full rounded-xl border p-2 text-xs"
                >
                  {days.map((d: string) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Station</Label>
                <select
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  className="bg-card border-border w-full rounded-xl border p-2 text-xs"
                >
                  {stations.map((st: string) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Start Time</Label>
                <Input
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="10:00 AM"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">End Time</Label>
                <Input
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="06:00 PM"
                  className="text-xs"
                  required
                />
              </div>
            </div>

            {createShiftMutation.error && (
              <p className="text-destructive bg-destructive/10 border-destructive/20 rounded-xl border p-2.5 text-xs font-medium">
                {createShiftMutation.error.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={createShiftMutation.isPending}
              className="mt-2 w-full bg-amber-600 font-bold text-white hover:bg-amber-700"
            >
              {createShiftMutation.isPending
                ? "Assigning Shift..."
                : "Confirm & Save Shift"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
