import { test, describe } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Skeleton } from "~/components/ui/skeleton";
import {
  MenuItemCardSkeleton,
  MenuItemSkeletonGrid,
} from "~/components/skeletons/menu-item-skeleton";
import { OrderTrackingSkeleton } from "~/components/skeletons/order-tracking-skeleton";
import { AdminDashboardSkeleton } from "~/components/skeletons/admin-dashboard-skeleton";
import { KDSSkeleton } from "~/components/skeletons/kds-skeleton";
import { AdminTablesSkeleton } from "~/components/skeletons/admin-tables-skeleton";
import { AdminInventorySkeleton } from "~/components/skeletons/admin-inventory-skeleton";
import { AdminStaffSkeleton } from "~/components/skeletons/admin-staff-skeleton";

describe("Skeleton Components Seam", () => {
  test("1. Base Skeleton primitive renders with animate-pulse and custom classes", () => {
    const html = renderToStaticMarkup(
      React.createElement(Skeleton, {
        className: "h-4 w-20 custom-test-class",
        "data-testid": "base-skeleton",
      }),
    );

    assert.ok(
      html.includes("animate-pulse"),
      "Must include animate-pulse class",
    );
    assert.ok(html.includes("bg-muted"), "Must include bg-muted base class");
    assert.ok(
      html.includes("custom-test-class"),
      "Must pass through custom classes",
    );
    assert.ok(
      html.includes('data-testid="base-skeleton"'),
      "Must pass through HTML attributes",
    );
  });

  test("2. MenuItemSkeletonGrid renders the specified count of cards (default: 8)", () => {
    const defaultGridHtml = renderToStaticMarkup(
      React.createElement(MenuItemSkeletonGrid, null),
    );
    // Should render 8 card skeletons
    const defaultCards = defaultGridHtml.match(
      /data-testid="menu-item-skeleton-card"/g,
    );
    assert.equal(
      defaultCards?.length,
      8,
      "Expected 8 skeleton cards by default",
    );

    const customGridHtml = renderToStaticMarkup(
      React.createElement(MenuItemSkeletonGrid, { count: 4 }),
    );
    const customCards = customGridHtml.match(
      /data-testid="menu-item-skeleton-card"/g,
    );
    assert.equal(
      customCards?.length,
      4,
      "Expected 4 skeleton cards when count=4",
    );
  });

  test("3. MenuItemCardSkeleton includes placeholder for image, badges, title, and price/button", () => {
    const cardHtml = renderToStaticMarkup(
      React.createElement(MenuItemCardSkeleton, null),
    );

    assert.ok(htmlHasSkeleton(cardHtml), "Card must contain pulse skeletons");
    assert.ok(
      cardHtml.includes("rounded-2xl"),
      "Card must match the rounded-2xl menu item border radius",
    );
  });

  test("4. OrderTrackingSkeleton mirrors header, stepper, and items breakdown", () => {
    const trackingHtml = renderToStaticMarkup(
      React.createElement(OrderTrackingSkeleton, null),
    );

    assert.ok(
      htmlHasSkeleton(trackingHtml),
      "Order tracking skeleton must contain pulsing elements",
    );
    assert.ok(
      trackingHtml.includes('data-testid="order-timeline-skeleton"'),
      "Must include timeline stepper placeholder",
    );
  });

  test("5. AdminDashboardSkeleton renders 4 KPI stat skeletons and 2 workflow feed panels", () => {
    const adminHtml = renderToStaticMarkup(
      React.createElement(AdminDashboardSkeleton, null),
    );

    const kpiCards = adminHtml.match(/data-testid="admin-kpi-skeleton"/g);
    assert.equal(kpiCards?.length, 4, "Expected 4 KPI stat card skeletons");

    assert.ok(
      adminHtml.includes('data-testid="admin-feed-orders-skeleton"'),
      "Must include live orders feed placeholder",
    );
    assert.ok(
      adminHtml.includes('data-testid="admin-feed-reservations-skeleton"'),
      "Must include reservations feed placeholder",
    );
  });

  test("6. KDSSkeleton renders 4 Kanban columns with placeholder order tickets", () => {
    const kdsHtml = renderToStaticMarkup(
      React.createElement(KDSSkeleton, null),
    );

    const columns = kdsHtml.match(/data-testid="kds-column-skeleton"/g);
    assert.equal(columns?.length, 4, "Expected 4 Kanban column skeletons");
    assert.ok(
      htmlHasSkeleton(kdsHtml),
      "KDS skeleton must contain pulsing elements",
    );
  });

  test("7. AdminTablesSkeleton renders realm filter bar and table occupancy cards grid", () => {
    const tablesHtml = renderToStaticMarkup(
      React.createElement(AdminTablesSkeleton, null),
    );

    assert.ok(
      tablesHtml.includes('data-testid="tables-grid-skeleton"'),
      "Must include table status grid placeholder",
    );
    assert.ok(
      htmlHasSkeleton(tablesHtml),
      "Tables skeleton must contain pulsing elements",
    );
  });

  test("8. AdminInventorySkeleton renders stock warnings and ingredient status cards", () => {
    const inventoryHtml = renderToStaticMarkup(
      React.createElement(AdminInventorySkeleton, null),
    );

    assert.ok(
      inventoryHtml.includes('data-testid="inventory-grid-skeleton"'),
      "Must include inventory grid placeholder",
    );
    assert.ok(
      htmlHasSkeleton(inventoryHtml),
      "Inventory skeleton must contain pulsing elements",
    );
  });

  test("9. AdminStaffSkeleton renders staff brigade avatars and 7-day weekly schedule columns", () => {
    const staffHtml = renderToStaticMarkup(
      React.createElement(AdminStaffSkeleton, null),
    );

    const days = staffHtml.match(/data-testid="staff-day-skeleton"/g);
    assert.equal(days?.length, 7, "Expected 7 daily shift column placeholders");
    assert.ok(
      htmlHasSkeleton(staffHtml),
      "Staff skeleton must contain pulsing elements",
    );
  });
});

function htmlHasSkeleton(html: string): boolean {
  return html.includes("animate-pulse");
}
