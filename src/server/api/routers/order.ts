import { z } from "zod";
import { Prisma, OrderStatus, OrderType, PaymentMethod } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const orderItemInputSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().int().positive(),
  spiceLevel: z.number().int().min(0).max(4).optional(),
  notes: z.string().optional(),
});

export type OrderItemInput = z.infer<typeof orderItemInputSchema>;

export type MenuItemWithRecipe = Prisma.MenuItemGetPayload<{
  include: {
    recipe: {
      include: {
        ingredient: true;
      };
    };
  };
}>;

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        customerName: z.string().min(1, "Name is required"),
        customerPhone: z.string().min(5, "Phone number is required"),
        customerEmail: z.string().email().optional().or(z.literal("")),
        orderType: z.nativeEnum(OrderType),
        deliveryAddress: z.string().optional(),
        pickupTime: z.string().optional(),
        specialInstructions: z.string().optional(),
        paymentMethod: z.nativeEnum(PaymentMethod),
        items: z
          .array(orderItemInputSchema)
          .min(1, "At least one item is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Fetch menu items to compute accurate price
      const itemIds: string[] = input.items.map(
        (i: OrderItemInput) => i.menuItemId,
      );
      const menuItems: MenuItemWithRecipe[] = await ctx.db.menuItem.findMany({
        where: { id: { in: itemIds } },
        include: {
          recipe: {
            include: {
              ingredient: true,
            },
          },
        },
      });

      const itemMap = new Map<string, MenuItemWithRecipe>(
        menuItems.map((m: MenuItemWithRecipe) => [m.id, m]),
      );

      // 2. Validate availability
      for (const reqItem of input.items) {
        const item: MenuItemWithRecipe | undefined = itemMap.get(
          reqItem.menuItemId,
        );
        if (!item?.isAvailable) {
          throw new Error(
            `Item "${item?.name ?? reqItem.menuItemId}" is currently out of stock.`,
          );
        }
      }

      // 3. Compute totals using exact Decimal arithmetic
      let subtotal = new Prisma.Decimal(0);
      for (const reqItem of input.items) {
        const item: MenuItemWithRecipe = itemMap.get(reqItem.menuItemId)!;
        subtotal = subtotal.add(item.price.mul(reqItem.quantity));
      }

      const tax = subtotal.mul(0.12).toDecimalPlaces(2);
      const deliveryFee = new Prisma.Decimal(
        input.orderType === "DELIVERY" ? 120 : 0,
      );
      const totalAmount = subtotal.add(tax).add(deliveryFee);

      // 4. Generate Order Number
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `AVI-${randomSuffix}`;

      // 5. Create Order & decrement inventory in a transaction
      return await ctx.db.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            orderNumber,
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            customerEmail: input.customerEmail ?? null,
            orderType: input.orderType,
            status: "PENDING",
            deliveryAddress: input.deliveryAddress ?? null,
            pickupTime: input.pickupTime ?? null,
            specialInstructions: input.specialInstructions ?? null,
            paymentMethod: input.paymentMethod,
            paymentStatus: "PAID",
            subtotal,
            tax,
            deliveryFee,
            totalAmount,
            estimatedMinutes: input.orderType === "DELIVERY" ? 35 : 20,
            items: {
              create: input.items.map((reqItem: OrderItemInput) => {
                const menuItem: MenuItemWithRecipe = itemMap.get(
                  reqItem.menuItemId,
                )!;
                return {
                  menuItemId: reqItem.menuItemId,
                  quantity: reqItem.quantity,
                  unitPrice: menuItem.price,
                  spiceLevel:
                    reqItem.spiceLevel ?? menuItem.brilyanteSpiceLevel,
                  notes: reqItem.notes ?? null,
                };
              }),
            },
          },
          include: {
            items: {
              include: {
                menuItem: true,
              },
            },
          },
        });

        // Decrement ingredients stock for each item
        for (const reqItem of input.items) {
          const item: MenuItemWithRecipe = itemMap.get(reqItem.menuItemId)!;
          for (const recipeItem of item.recipe) {
            const deduction = recipeItem.quantityNeeded * reqItem.quantity;
            const updatedIng = await tx.ingredient.update({
              where: { id: recipeItem.ingredientId },
              data: {
                currentStock: {
                  decrement: deduction,
                },
              },
            });

            // If stock depleted to <= 0, auto-toggle affected menu items
            if (updatedIng.currentStock <= 0) {
              const affectedRecipes = await tx.menuItemIngredient.findMany({
                where: { ingredientId: updatedIng.id },
                select: { menuItemId: true },
              });
              const affectedIds: string[] = affectedRecipes.map(
                (r: { menuItemId: string }) => r.menuItemId,
              );
              if (affectedIds.length > 0) {
                await tx.menuItem.updateMany({
                  where: { id: { in: affectedIds } },
                  data: { isAvailable: false },
                });
              }
            }
          }
        }

        return order;
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirst({
        where: {
          OR: [{ id: input.id }, { orderNumber: input.id }],
        },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return order;
    }),

  getAll: publicProcedure
    .input(
      z
        .object({
          status: z
            .union([z.nativeEnum(OrderStatus), z.literal("ALL")])
            .optional(),
          limit: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.OrderWhereInput = {};
      if (input?.status && input.status !== "ALL") {
        where.status = input.status;
      }

      return ctx.db.order.findMany({
        where,
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: input?.limit ?? 50,
      });
    }),

  updateStatus: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.nativeEnum(OrderStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.order.update({
        where: { id: input.orderId },
        data: { status: input.status },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });
    }),
});
