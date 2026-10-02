import { test, describe, after, before } from "node:test";
import assert from "node:assert/strict";
import {
  Prisma,
  Kingdom,
  Category,
  OrderType,
  PaymentMethod,
  Realm,
  ReservationStatus,
} from "@prisma/client";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { db } from "~/server/db";

describe("tRPC Seam Integration Tests (Live Supabase PostgreSQL)", () => {
  let caller: ReturnType<typeof createCaller>;
  const createdOrderIds: string[] = [];
  const createdReservationIds: string[] = [];

  before(async () => {
    const ctx = await createTRPCContext({ headers: new Headers() });
    caller = createCaller(ctx);
  });

  after(async () => {
    // Hermetic cleanup: delete test-created orders and reservations
    if (createdOrderIds.length > 0) {
      await db.orderItem.deleteMany({
        where: { orderId: { in: createdOrderIds } },
      });
      await db.order.deleteMany({
        where: { id: { in: createdOrderIds } },
      });
    }

    if (createdReservationIds.length > 0) {
      await db.reservation.deleteMany({
        where: { id: { in: createdReservationIds } },
      });
    }

    await db.$disconnect();
  });

  test("1. Menu query filters accurately by kingdom and category", async () => {
    const lireoMains = await caller.menu.getAll({
      kingdom: Kingdom.LIREO,
      category: Category.Mains,
    });

    assert.ok(lireoMains.length > 0, "Expected at least 1 Lireo main course");
    for (const item of lireoMains) {
      assert.equal(item.kingdom, Kingdom.LIREO);
      assert.equal(item.category, Category.Mains);
      assert.ok(
        item.price instanceof Prisma.Decimal,
        "Item price must be a Prisma.Decimal instance",
      );
      assert.ok(
        item.price.greaterThan(0),
        "Item price must be greater than zero",
      );
      assert.ok(
        Array.isArray(item.recipe),
        "Item should include recipe ingredients",
      );
    }
  });

  test("2. Order creation computes exact line item totals, tax, and delivery fee with Decimal arithmetic", async () => {
    const availableItems = await caller.menu.getAll({
      kingdom: Kingdom.LIREO,
    });
    const candidateItems = availableItems.filter(
      (i) => i.isAvailable && i.recipe.length > 0,
    );
    assert.ok(
      candidateItems.length >= 2,
      "Expected at least 2 available items with recipes",
    );

    const item1 = candidateItems[0]!;
    const item2 = candidateItems[1]!;
    const qty1 = 2;
    const qty2 = 1;

    // Expected exact calculations
    const expectedItem1Subtotal = item1.price.mul(qty1);
    const expectedItem2Subtotal = item2.price.mul(qty2);
    const expectedSubtotal = expectedItem1Subtotal.add(expectedItem2Subtotal);
    const expectedTax = expectedSubtotal.mul(0.12).toDecimalPlaces(2);
    const expectedDeliveryFee = new Prisma.Decimal(120);
    const expectedTotal = expectedSubtotal
      .add(expectedTax)
      .add(expectedDeliveryFee);

    const order = await caller.order.create({
      customerName: "Amihan Test",
      customerPhone: "09171234567",
      customerEmail: "amihan@lireo.encantadia",
      orderType: OrderType.DELIVERY,
      deliveryAddress: "Lireo High Palace, 4th Spire",
      paymentMethod: PaymentMethod.GCASH,
      items: [
        { menuItemId: item1.id, quantity: qty1 },
        { menuItemId: item2.id, quantity: qty2 },
      ],
    });

    createdOrderIds.push(order.id);

    assert.ok(order.id, "Order ID should be returned");
    assert.match(
      order.orderNumber,
      /^AVI-\d+$/,
      "Order number should follow AVI-XXXX format",
    );
    assert.equal(order.status, "PENDING");
    assert.equal(order.paymentStatus, "PAID");

    // Exact Decimal validations
    assert.ok(
      order.subtotal instanceof Prisma.Decimal,
      "subtotal must be a Decimal",
    );
    assert.ok(
      order.subtotal.equals(expectedSubtotal),
      `Subtotal ${order.subtotal} must equal ${expectedSubtotal}`,
    );

    assert.ok(order.tax instanceof Prisma.Decimal, "tax must be a Decimal");
    assert.ok(
      order.tax.equals(expectedTax),
      `Tax ${order.tax} must equal ${expectedTax}`,
    );

    assert.ok(
      order.deliveryFee instanceof Prisma.Decimal,
      "deliveryFee must be a Decimal",
    );
    assert.ok(
      order.deliveryFee.equals(expectedDeliveryFee),
      `Delivery fee ${order.deliveryFee} must equal 120`,
    );

    assert.ok(
      order.totalAmount instanceof Prisma.Decimal,
      "totalAmount must be a Decimal",
    );
    assert.ok(
      order.totalAmount.equals(expectedTotal),
      `Total ${order.totalAmount} must equal ${expectedTotal}`,
    );

    // Verify no floating-point string representation deviations
    assert.equal(order.subtotal.toFixed(2), expectedSubtotal.toFixed(2));
    assert.equal(order.tax.toFixed(2), expectedTax.toFixed(2));
    assert.equal(order.deliveryFee.toFixed(2), "120.00");
    assert.equal(order.totalAmount.toFixed(2), expectedTotal.toFixed(2));

    // Verify persisted line items
    assert.equal(order.items.length, 2);
    const orderLine1 = order.items.find((i) => i.menuItemId === item1.id);
    const orderLine2 = order.items.find((i) => i.menuItemId === item2.id);
    assert.ok(orderLine1);
    assert.ok(orderLine2);
    assert.equal(orderLine1.quantity, qty1);
    assert.ok(orderLine1.unitPrice.equals(item1.price));
    assert.equal(orderLine2.quantity, qty2);
    assert.ok(orderLine2.unitPrice.equals(item2.price));
  });

  test("3. Inventory stock deduction occurs accurately upon order placement", async () => {
    // Pick an item with recipes
    const menuItems = await caller.menu.getAll({ kingdom: Kingdom.HATHORIA });
    const item = menuItems.find((i) => i.isAvailable && i.recipe.length > 0);
    assert.ok(item, "Expected a Hathorian menu item with recipe ingredients");

    const recipe = item.recipe;
    const ingredientId = recipe[0]!.ingredientId;
    const qtyNeeded = recipe[0]!.quantityNeeded;

    // Check pre-order stock
    const preInventory = await caller.inventory.getAll();
    const targetIngredientBefore = preInventory.find(
      (ing) => ing.id === ingredientId,
    );
    assert.ok(targetIngredientBefore, "Ingredient should exist in pantry");
    const stockBefore = targetIngredientBefore.currentStock;

    // Place an order for 2 portions
    const orderQuantity = 2;
    const order = await caller.order.create({
      customerName: "Pirena Inventory Test",
      customerPhone: "09187654321",
      orderType: OrderType.PICKUP,
      paymentMethod: PaymentMethod.GOLD,
      items: [{ menuItemId: item.id, quantity: orderQuantity }],
    });
    createdOrderIds.push(order.id);

    // Check post-order stock
    const postInventory = await caller.inventory.getAll();
    const targetIngredientAfter = postInventory.find(
      (ing) => ing.id === ingredientId,
    );
    assert.ok(
      targetIngredientAfter,
      "Ingredient should exist in pantry after order",
    );

    const expectedStockAfter = stockBefore - qtyNeeded * orderQuantity;
    assert.equal(
      targetIngredientAfter.currentStock,
      expectedStockAfter,
      `Stock should decrease by ${qtyNeeded * orderQuantity} (from ${stockBefore} to ${expectedStockAfter})`,
    );

    // Restore the deducted inventory so tests leave inventory balanced
    await caller.inventory.replenish({
      ingredientId,
      addedStock: qtyNeeded * orderQuantity,
      costPerUnit: Number(targetIngredientBefore.costPerUnit),
    });
  });

  test("4. Table booking succeeds with valid realm preference and assigns confirmed status", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateStr = futureDate.toISOString().split("T")[0]!;

    const reservation = await caller.reserve.createReservation({
      guestName: "Ybrahim of Sapiro",
      guestPhone: "09191112233",
      guestEmail: "ybrahim@sapiro.encantadia",
      reservationDate: dateStr,
      timeSlot: "07:00 PM",
      partySize: 4,
      realmPreference: Realm.SAPIRO_HALL,
      specialRequests: "Near the royal hearth",
    });

    createdReservationIds.push(reservation.id);

    assert.ok(reservation.id, "Reservation ID must be generated");
    assert.match(
      reservation.bookingReference,
      /^RES-\d+$/,
      "Booking reference must follow RES-XXXX format",
    );
    assert.equal(reservation.status, ReservationStatus.CONFIRMED);
    assert.equal(reservation.realmPreference, Realm.SAPIRO_HALL);
    assert.equal(reservation.partySize, 4);
    assert.ok(reservation.table, "A candidate table should be assigned");
    assert.ok(
      reservation.table.capacity >= 4,
      "Assigned table capacity must accommodate party size",
    );
  });
});
