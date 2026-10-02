import { z } from "zod";
import {
  ReservationStatus,
  Realm,
  TableStatus,
  type Prisma,
} from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const reserveRouter = createTRPCRouter({
  getTables: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.diningTable.findMany({
      orderBy: [{ realm: "asc" }, { tableNumber: "asc" }],
    });
  }),

  getReservations: publicProcedure
    .input(
      z
        .object({
          status: z
            .union([z.nativeEnum(ReservationStatus), z.literal("ALL")])
            .optional(),
          date: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.ReservationWhereInput = {};
      if (input?.status && input.status !== "ALL") {
        where.status = input.status;
      }
      if (input?.date) {
        const queryDate = new Date(input.date);
        const start = new Date(queryDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(queryDate);
        end.setHours(23, 59, 59, 999);
        where.reservationDate = { gte: start, lte: end };
      }

      return ctx.db.reservation.findMany({
        where,
        include: {
          table: true,
        },
        orderBy: [{ reservationDate: "asc" }, { timeSlot: "asc" }],
      });
    }),

  createReservation: publicProcedure
    .input(
      z.object({
        guestName: z.string().min(1, "Guest name is required"),
        guestPhone: z.string().min(5, "Contact number is required"),
        guestEmail: z.string().email("Valid email required"),
        reservationDate: z.string(), // ISO date string
        timeSlot: z.string().min(1, "Time slot required"),
        partySize: z.number().int().min(1).max(20),
        realmPreference: z.nativeEnum(Realm),
        specialRequests: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const resDate = new Date(input.reservationDate);
      const startOfDay = new Date(resDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(resDate);
      endOfDay.setHours(23, 59, 59, 999);

      // 1. Find tables already reserved for this date and time slot
      const bookedReservations = await ctx.db.reservation.findMany({
        where: {
          reservationDate: { gte: startOfDay, lte: endOfDay },
          timeSlot: input.timeSlot,
          status: { in: ["CONFIRMED", "SEATED"] },
          tableId: { not: null },
        },
        select: { tableId: true },
      });

      const bookedTableIds = bookedReservations
        .map((r: { tableId: string | null }) => r.tableId)
        .filter((id): id is string => id !== null);

      // 2. Find available candidate table in preferred realm with adequate capacity
      let candidateTable = await ctx.db.diningTable.findFirst({
        where: {
          realm: input.realmPreference,
          capacity: { gte: input.partySize },
          ...(bookedTableIds.length > 0
            ? { id: { notIn: bookedTableIds } }
            : {}),
        },
        orderBy: { capacity: "asc" },
      });

      // Fallback to other realms if preferred realm has no open tables
      candidateTable ??= await ctx.db.diningTable.findFirst({
        where: {
          capacity: { gte: input.partySize },
          ...(bookedTableIds.length > 0
            ? { id: { notIn: bookedTableIds } }
            : {}),
        },
        orderBy: { capacity: "asc" },
      });

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const bookingReference = `RES-${randomNum}`;

      const reservation = await ctx.db.reservation.create({
        data: {
          bookingReference,
          guestName: input.guestName,
          guestPhone: input.guestPhone,
          guestEmail: input.guestEmail,
          reservationDate: resDate,
          timeSlot: input.timeSlot,
          partySize: input.partySize,
          realmPreference: input.realmPreference,
          specialRequests: input.specialRequests ?? null,
          status: "CONFIRMED",
          tableId: candidateTable ? candidateTable.id : null,
        },
        include: {
          table: true,
        },
      });

      return reservation;
    }),

  updateStatus: publicProcedure
    .input(
      z.object({
        reservationId: z.string(),
        status: z.nativeEnum(ReservationStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.reservation.findUnique({
        where: { id: input.reservationId },
      });

      if (!existing) throw new Error("Reservation not found");

      const updated = await ctx.db.reservation.update({
        where: { id: input.reservationId },
        data: { status: input.status },
        include: { table: true },
      });

      // Automatically update table status when seating or completing
      if (existing.tableId) {
        if (input.status === "SEATED") {
          await ctx.db.diningTable.update({
            where: { id: existing.tableId },
            data: { status: "OCCUPIED" },
          });
        } else if (
          input.status === "COMPLETED" ||
          input.status === "CANCELLED"
        ) {
          await ctx.db.diningTable.update({
            where: { id: existing.tableId },
            data: { status: "AVAILABLE" },
          });
        }
      }

      return updated;
    }),

  updateTableStatus: publicProcedure
    .input(
      z.object({
        tableId: z.string(),
        status: z.nativeEnum(TableStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.diningTable.update({
        where: { id: input.tableId },
        data: { status: input.status },
      });
    }),
});
