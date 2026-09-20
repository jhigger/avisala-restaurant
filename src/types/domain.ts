import type { RouterOutputs } from "~/trpc/react";

export type StaffMember = RouterOutputs["staff"]["getAll"][number];
export type ShiftItem = RouterOutputs["staff"]["getShifts"][number];
export type MenuItemDetail = RouterOutputs["menu"]["getAll"][number];
export type OrderDetail = RouterOutputs["order"]["getById"];
export type OrderSummary = RouterOutputs["order"]["getAll"][number];
export type DiningTableDetail = RouterOutputs["reserve"]["getTables"][number];
export type ReservationDetail =
  RouterOutputs["reserve"]["getReservations"][number];
export type IngredientDetail = RouterOutputs["inventory"]["getAll"][number];
