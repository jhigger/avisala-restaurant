import { z } from "zod";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const inventoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const ingredients = await ctx.db.ingredient.findMany({
      include: {
        usedIn: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: [{ kingdom: "asc" }, { name: "asc" }],
    });

    return ingredients.map((ing) => ({
      ...ing,
      isLowStock: ing.currentStock <= ing.lowStockThreshold,
      isDepleted: ing.currentStock <= 0,
    }));
  }),

  replenish: publicProcedure
    .input(
      z.object({
        ingredientId: z.string(),
        addedStock: z.number().positive("Amount must be positive"),
        costPerUnit: z.number().nonnegative().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const updated = await tx.ingredient.update({
          where: { id: input.ingredientId },
          data: {
            currentStock: {
              increment: input.addedStock,
            },
            ...(input.costPerUnit !== undefined
              ? { costPerUnit: new Prisma.Decimal(input.costPerUnit) }
              : {}),
          },
        });

        // If stock is now positive, batch check and reactivate eligible menu items
        if (updated.currentStock > 0) {
          const recipes = await tx.menuItemIngredient.findMany({
            where: { ingredientId: updated.id },
            select: { menuItemId: true },
          });
          const menuItemIds = [...new Set(recipes.map((r) => r.menuItemId))];

          if (menuItemIds.length > 0) {
            // Batch fetch all ingredients for all affected dishes in a single query
            const allDishIngredients = await tx.menuItemIngredient.findMany({
              where: { menuItemId: { in: menuItemIds } },
              include: { ingredient: true },
            });

            // Check which dishes have all ingredients with positive stock
            const availabilityMap = new Map<string, boolean>();
            for (const id of menuItemIds) {
              availabilityMap.set(id, true);
            }

            for (const item of allDishIngredients) {
              if (item.ingredient.currentStock <= 0) {
                availabilityMap.set(item.menuItemId, false);
              }
            }

            const reactivateIds = menuItemIds.filter(
              (id) => availabilityMap.get(id) === true,
            );
            if (reactivateIds.length > 0) {
              await tx.menuItem.updateMany({
                where: { id: { in: reactivateIds } },
                data: { isAvailable: true },
              });
            }
          }
        }

        return updated;
      });
    }),

  updateThreshold: publicProcedure
    .input(
      z.object({
        ingredientId: z.string(),
        lowStockThreshold: z.number().nonnegative(),
        costPerUnit: z.number().nonnegative().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.ingredient.update({
        where: { id: input.ingredientId },
        data: {
          lowStockThreshold: input.lowStockThreshold,
          ...(input.costPerUnit !== undefined
            ? { costPerUnit: new Prisma.Decimal(input.costPerUnit) }
            : {}),
        },
      });
    }),
});
