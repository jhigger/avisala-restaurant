import { z } from "zod";
import { Kingdom, Category, type Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const menuRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          kingdom: z
            .union([z.nativeEnum(Kingdom), z.literal("ALL")])
            .optional(),
          category: z
            .union([z.nativeEnum(Category), z.literal("ALL")])
            .optional(),
          onlyAvailable: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.MenuItemWhereInput = {};

      if (input?.kingdom && input.kingdom !== "ALL") {
        where.kingdom = input.kingdom;
      }
      if (input?.category && input.category !== "ALL") {
        where.category = input.category;
      }
      if (input?.onlyAvailable) {
        where.isAvailable = true;
      }

      return ctx.db.menuItem.findMany({
        where,
        include: {
          recipe: {
            include: {
              ingredient: true,
            },
          },
        },
        orderBy: [
          { isChefSpecial: "desc" },
          { kingdom: "asc" },
          { price: "asc" },
        ],
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.menuItem.findUnique({
        where: { id: input.id },
        include: {
          recipe: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    }),

  toggleAvailability: publicProcedure
    .input(z.object({ id: z.string(), isAvailable: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.menuItem.update({
        where: { id: input.id },
        data: { isAvailable: input.isAvailable },
      });
    }),
});
