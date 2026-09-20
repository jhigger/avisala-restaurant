import { menuRouter } from "~/server/api/routers/menu";
import { orderRouter } from "~/server/api/routers/order";
import { reserveRouter } from "~/server/api/routers/reserve";
import { inventoryRouter } from "~/server/api/routers/inventory";
import { staffRouter } from "~/server/api/routers/staff";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  menu: menuRouter,
  order: orderRouter,
  reserve: reserveRouter,
  inventory: inventoryRouter,
  staff: staffRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 */
export const createCaller = createCallerFactory(appRouter);
