"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import confetti from "canvas-confetti";
import {
  Wind,
  Flame,
  Mountain,
  Droplets,
  Clock,
  Users,
  CheckCircle2,
  QrCode,
  Sparkles,
  AlertCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";

interface ConfirmedReservation {
  id: string;
  bookingReference: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  reservationDate: string | Date;
  timeSlot: string;
  partySize: number;
  realmPreference: string;
  specialRequests?: string | null;
  table?: { tableNumber: string } | null;
}

export default function ReservePage() {
  const [realm, setRealm] = useState<
    "LIREO_TERRACE" | "HATHORIAN_HEARTH" | "SAPIRO_HALL" | "ADAMYA_LAGOON"
  >("LIREO_TERRACE");
  const [partySize, setPartySize] = useState(4);
  const [reservationDate, setReservationDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0]!;
  });
  const [timeSlot, setTimeSlot] = useState("07:00 PM");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [confirmedReservation, setConfirmedReservation] =
    useState<ConfirmedReservation | null>(null);

  const timeSlots = [
    "11:30 AM",
    "12:30 PM",
    "01:30 PM",
    "05:30 PM",
    "06:30 PM",
    "07:30 PM",
    "08:30 PM",
    "09:30 PM",
  ];

  const createReservationMutation = api.reserve.createReservation.useMutation({
    onSuccess: (data) => {
      void confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
      });
      setConfirmedReservation(data);
    },
    onError: (err) => {
      setErrorMessage(
        err.message ||
          "Could not complete reservation. Please select another slot.",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!guestName.trim()) {
      setErrorMessage("Please enter guest name.");
      return;
    }
    if (!guestPhone.trim()) {
      setErrorMessage("Please enter contact number.");
      return;
    }
    if (!guestEmail.trim()) {
      setErrorMessage("Please enter email address.");
      return;
    }

    createReservationMutation.mutate({
      guestName,
      guestPhone,
      guestEmail,
      reservationDate: new Date(reservationDate).toISOString(),
      timeSlot,
      partySize,
      realmPreference: realm,
      specialRequests: specialRequests || undefined,
    });
  };

  const getRealmTitle = (r: string) => {
    switch (r) {
      case "LIREO_TERRACE":
        return "Council Terrace of Lireo";
      case "HATHORIAN_HEARTH":
        return "Fiery Hearth of Hathoria";
      case "SAPIRO_HALL":
        return "Great Banquet Hall of Sapiro";
      case "ADAMYA_LAGOON":
        return "Waterside Lagoon of Adamya";
      default:
        return r;
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Royal Table Reservations</span>
        </div>
        <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-5xl">
          Reserve Your Elemental Seat
        </h1>
        <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
          Select your desired realm ambiance, party size, and schedule. Receive
          an instant digital reservation boarding pass with QR check-in code.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-2 rounded-xl border p-4 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. SELECT REALM AMBIANCE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">
              1. Select Dining Realm Ambiance
            </Label>
            <span className="text-muted-foreground text-xs">
              Each hall has a distinct elemental vibe
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* LIREO */}
            <div
              onClick={() => setRealm("LIREO_TERRACE")}
              className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                realm === "LIREO_TERRACE"
                  ? "border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/30"
                  : "border-border bg-card hover:border-emerald-500/40"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600">
                  <Wind className="h-4 w-4" />
                </div>
                {realm === "LIREO_TERRACE" && (
                  <Badge className="bg-emerald-600 text-[10px] text-white">
                    Selected
                  </Badge>
                )}
              </div>
              <h3 className="text-foreground text-sm font-bold">
                Lireo Terrace
              </h3>
              <p className="text-muted-foreground mt-1 text-[11px]">
                Panoramic mountain breezes, silver floral scents, airy dining.
              </p>
            </div>

            {/* HATHORIA */}
            <div
              onClick={() => setRealm("HATHORIAN_HEARTH")}
              className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                realm === "HATHORIAN_HEARTH"
                  ? "border-red-500 bg-red-500/10 shadow-md ring-2 ring-red-500/30"
                  : "border-border bg-card hover:border-red-500/40"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/10 text-red-600">
                  <Flame className="h-4 w-4" />
                </div>
                {realm === "HATHORIAN_HEARTH" && (
                  <Badge className="bg-red-600 text-[10px] text-white">
                    Selected
                  </Badge>
                )}
              </div>
              <h3 className="text-foreground text-sm font-bold">
                Hathorian Hearth
              </h3>
              <p className="text-muted-foreground mt-1 text-[11px]">
                Warm open-concept flaming charcoal grill and dramatic tableside
                carvings.
              </p>
            </div>

            {/* SAPIRO */}
            <div
              onClick={() => setRealm("SAPIRO_HALL")}
              className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                realm === "SAPIRO_HALL"
                  ? "border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/30"
                  : "border-border bg-card hover:border-amber-500/40"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600/10 text-amber-600">
                  <Mountain className="h-4 w-4" />
                </div>
                {realm === "SAPIRO_HALL" && (
                  <Badge className="bg-amber-600 text-[10px] text-white">
                    Selected
                  </Badge>
                )}
              </div>
              <h3 className="text-foreground text-sm font-bold">
                Sapiro Great Hall
              </h3>
              <p className="text-muted-foreground mt-1 text-[11px]">
                Imperial stone tables, hearty banquets, and grounding gold
                acoustics.
              </p>
            </div>

            {/* ADAMYA */}
            <div
              onClick={() => setRealm("ADAMYA_LAGOON")}
              className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                realm === "ADAMYA_LAGOON"
                  ? "border-sky-500 bg-sky-500/10 shadow-md ring-2 ring-sky-500/30"
                  : "border-border bg-card hover:border-sky-500/40"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600/10 text-sky-600">
                  <Droplets className="h-4 w-4" />
                </div>
                {realm === "ADAMYA_LAGOON" && (
                  <Badge className="bg-sky-600 text-[10px] text-white">
                    Selected
                  </Badge>
                )}
              </div>
              <h3 className="text-foreground text-sm font-bold">
                Adamya Lagoon
              </h3>
              <p className="text-muted-foreground mt-1 text-[11px]">
                Calming waterside booths surrounded by glowing azure botanicals.
              </p>
            </div>
          </div>
        </div>

        {/* 2. PARTY SIZE & TIME SLOT */}
        <div className="bg-card border-border grid grid-cols-1 gap-6 rounded-2xl border p-6 shadow-xs md:grid-cols-2">
          {/* Party Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 text-xs font-bold">
                <Users className="h-4 w-4 text-amber-500" />
                <span>Number of Guests: {partySize}</span>
              </Label>
              <span className="text-muted-foreground text-[11px]">
                Up to 12 guests
              </span>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 4, 6, 8, 12].map((size: number) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPartySize(size)}
                  className={`rounded-xl border py-2 text-xs font-bold transition-all ${
                    partySize === size
                      ? "border-amber-600 bg-amber-600 text-white shadow-xs"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {size} {size === 1 ? "pax" : "pax"}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1.5 text-xs font-bold">
              <CalendarIcon className="h-4 w-4 text-sky-500" />
              <span>Reservation Date</span>
            </Label>
            <Input
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              className="bg-muted/30"
              required
            />
          </div>

          {/* Time Slot Matrix */}
          <div className="space-y-3 md:col-span-2">
            <Label className="flex items-center gap-1.5 text-xs font-bold">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span>Dining Time Slot</span>
            </Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {timeSlots.map((slot: string) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                    timeSlot === slot
                      ? "bg-foreground text-background border-foreground shadow-xs"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. GUEST CONTACT INFO */}
        <div className="bg-card border-border space-y-4 rounded-2xl border p-6 shadow-xs">
          <h3 className="text-foreground text-sm font-bold">
            Guest Reservation Details
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="guestName" className="text-xs">
                Primary Guest Full Name *
              </Label>
              <Input
                id="guestName"
                placeholder="Hara Danaya"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="guestPhone" className="text-xs">
                Mobile Number *
              </Label>
              <Input
                id="guestPhone"
                placeholder="0917 888 1234"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="guestEmail" className="text-xs">
                Confirmation Email *
              </Label>
              <Input
                id="guestEmail"
                type="email"
                placeholder="danaya@sapiro.ph"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reqs" className="text-xs">
              Special Requests / Celebration Occasion
            </Label>
            <Textarea
              id="reqs"
              rows={2}
              placeholder="Birthday celebration, anniversary, high chair needed, dietary restrictions..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          disabled={createReservationMutation.isPending}
          className="w-full rounded-xl bg-amber-600 py-6 text-base font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700"
        >
          {createReservationMutation.isPending
            ? "Confirming Table in the Hall..."
            : `Book Table at ${getRealmTitle(realm)}`}
        </Button>
      </form>

      {/* CONFIRMATION BOARDING PASS MODAL */}
      {confirmedReservation && (
        <Dialog
          open={!!confirmedReservation}
          onOpenChange={() => setConfirmedReservation(null)}
        >
          <DialogContent className="p-6 sm:max-w-md">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <DialogTitle className="text-xl font-bold">
                Table Confirmed! Avisala!
              </DialogTitle>
              <DialogDescription className="text-xs">
                Your royal reservation is confirmed in our database. Present
                this digital pass upon arrival.
              </DialogDescription>
            </DialogHeader>

            {/* Boarding pass styled ticket */}
            <div className="bg-muted/50 border-border space-y-4 rounded-2xl border p-5 shadow-inner">
              <div className="border-border/80 flex items-center justify-between border-b pb-3">
                <div>
                  <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    Booking Reference
                  </p>
                  <p className="text-base font-black tracking-widest text-amber-600 dark:text-amber-400">
                    {confirmedReservation.bookingReference}
                  </p>
                </div>
                <div className="bg-card border-border flex h-10 w-10 items-center justify-center rounded-lg border">
                  <QrCode className="text-foreground h-6 w-6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground text-[10px]">Guest</p>
                  <p className="font-bold">{confirmedReservation.guestName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px]">
                    Party Size
                  </p>
                  <p className="font-bold">
                    {confirmedReservation.partySize} Guests
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px]">Date</p>
                  <p className="font-bold">
                    {new Date(
                      confirmedReservation.reservationDate,
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px]">Time Slot</p>
                  <p className="font-bold">{confirmedReservation.timeSlot}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-[10px]">
                    Assigned Hall &amp; Table
                  </p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    {getRealmTitle(confirmedReservation.realmPreference)}{" "}
                    {confirmedReservation.table
                      ? `(Table ${confirmedReservation.table.tableNumber})`
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setConfirmedReservation(null)}
              className="bg-foreground text-background w-full font-semibold"
            >
              Done &amp; Close Pass
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
