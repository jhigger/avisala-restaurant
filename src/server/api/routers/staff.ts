import { z } from "zod";
import { DayOfWeek, type Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

function parseTimeToMinutes(timeStr: string): number {
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes("PM");
  const isAM = clean.includes("AM");

  const numbersOnly = clean.replace(/[APM\s]/g, "");
  const [hoursStr, minutesStr] = numbersOnly.split(":");
  let hours = parseInt(hoursStr ?? "0", 10);
  const minutes = parseInt(minutesStr ?? "0", 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function shiftsOverlap(
  startAStr: string,
  endAStr: string,
  startBStr: string,
  endBStr: string,
): boolean {
  const startA = parseTimeToMinutes(startAStr);
  const endA = parseTimeToMinutes(endAStr);
  const startB = parseTimeToMinutes(startBStr);
  const endB = parseTimeToMinutes(endBStr);

  return Math.max(startA, startB) < Math.min(endA, endB);
}

export const staffRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.staff.findMany({
      include: {
        shifts: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
      orderBy: { fullName: "asc" },
    });
  }),

  getShifts: publicProcedure
    .input(
      z
        .object({
          dayOfWeek: z
            .union([z.nativeEnum(DayOfWeek), z.literal("ALL")])
            .optional(),
          station: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.ShiftWhereInput = {};
      if (input?.dayOfWeek && input.dayOfWeek !== "ALL") {
        where.dayOfWeek = input.dayOfWeek;
      }
      if (input?.station && input.station !== "ALL") {
        where.station = input.station;
      }

      return ctx.db.shift.findMany({
        where,
        include: {
          staff: true,
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      });
    }),

  createShift: publicProcedure
    .input(
      z.object({
        staffId: z.string(),
        dayOfWeek: z.nativeEnum(DayOfWeek),
        startTime: z.string(),
        endTime: z.string(),
        station: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check existing shifts for this staff member on the same day
      const existingShifts = await ctx.db.shift.findMany({
        where: {
          staffId: input.staffId,
          dayOfWeek: input.dayOfWeek,
        },
      });

      // Conflict detection: verify no overlapping hours
      for (const existing of existingShifts) {
        if (
          shiftsOverlap(
            input.startTime,
            input.endTime,
            existing.startTime,
            existing.endTime,
          )
        ) {
          throw new Error(
            `Scheduling conflict: Staff member already has an assigned shift on ${input.dayOfWeek} from ${existing.startTime} to ${existing.endTime} (${existing.station}).`,
          );
        }
      }

      return ctx.db.shift.create({
        data: input,
        include: { staff: true },
      });
    }),

  deleteShift: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.shift.delete({
        where: { id: input.id },
      });
    }),
});
