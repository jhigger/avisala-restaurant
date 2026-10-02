"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import type { OrderDetail } from "~/types/domain";

type OrderItemDetail = NonNullable<OrderDetail>["items"][number];
import {
  Clock,
  CheckCircle2,
  ShoppingBag,
  MapPin,
  Phone,
  ArrowLeft,
  Flame,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = use(params);

  // Poll order status every 3 seconds for live kitchen updates
  const {
    data: order,
    isLoading,
    error,
  } = api.order.getById.useQuery({ id }, { refetchInterval: 3000 });

  if (isLoading) {
    return (
      <div className="space-y-3 py-24 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        <p className="text-muted-foreground text-xs">
          Connecting to Royal Order Dispatch...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-24 text-center">
        <div className="bg-destructive/10 text-destructive mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <Clock className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold">Order Not Found</h2>
        <p className="text-muted-foreground text-xs">
          Could not locate order &quot;{id}&quot;. Check your reference number
          or return to the menu.
        </p>
        <Link href="/menu">
          <Button variant="outline" className="text-xs">
            Return to Menu
          </Button>
        </Link>
      </div>
    );
  }

  const steps = [
    { key: "PENDING", label: "Order Received", desc: "Sent to kitchen hearth" },
    {
      key: "PREPARING",
      label: "In Kitchen Prep",
      desc: "Chefs grilling & crafting",
    },
    {
      key: "READY",
      label:
        order.orderType === "DELIVERY"
          ? "Out for Delivery"
          : "Ready for Pickup",
      desc:
        order.orderType === "DELIVERY"
          ? "Rider dispatched"
          : "Awaiting patron arrival",
    },
    { key: "FULFILLED", label: "Banquet Fulfilled", desc: "Enjoy your feast!" },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "PREPARING":
        return 1;
      case "READY":
        return 2;
      case "FULFILLED":
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(order.status);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Top back button */}
      <div>
        <Link
          href="/menu"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Elemental Menu</span>
        </Link>
      </div>

      {/* Header card with order number and live badge */}
      <div className="bg-card border-border flex flex-col items-start justify-between gap-4 rounded-3xl border p-6 shadow-xs sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Royal Order Tracking
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-500" />
              Live Kitchen Sync
            </span>
          </div>
          <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
            Order #{order.orderNumber}
          </h1>
          <p className="text-muted-foreground text-xs">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            • Patron:{" "}
            <span className="text-foreground font-semibold">
              {order.customerName}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300"
          >
            {order.orderType === "DELIVERY"
              ? "Express Delivery"
              : "Takeout Pickup"}
          </Badge>
          <Badge
            className={`px-3 py-1 text-xs font-bold ${
              order.status === "FULFILLED"
                ? "bg-emerald-600 text-white"
                : order.status === "READY"
                  ? "bg-sky-600 text-white"
                  : order.status === "PREPARING"
                    ? "bg-amber-600 text-white"
                    : "bg-muted text-foreground"
            }`}
          >
            {order.status}
          </Badge>
        </div>
      </div>

      {/* LIVE STEPPER */}
      <div className="bg-card border-border space-y-6 rounded-3xl border p-6 shadow-xs sm:p-8">
        <div className="flex items-center justify-between text-xs">
          <span className="text-foreground flex items-center gap-1.5 font-bold">
            <Clock className="h-4 w-4 text-amber-500" />
            <span>Estimated Wait: {order.estimatedMinutes} mins</span>
          </span>
          <span className="text-muted-foreground">
            Auto-refreshes every 3 seconds
          </span>
        </div>

        {/* Stepper Grid */}
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-4">
          {steps.map(
            (
              step: { key: string; label: string; desc: string },
              idx: number,
            ) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.key}
                  className={`rounded-2xl border p-4 transition-all ${
                    isCurrent
                      ? "border-amber-500 bg-amber-500/10 shadow-sm ring-1 ring-amber-500/40"
                      : isDone
                        ? "text-muted-foreground border-emerald-500/40 bg-emerald-500/5"
                        : "border-border/60 bg-muted/20 text-muted-foreground opacity-50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase">
                      Step 0{idx + 1}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <span className="h-2 w-2 animate-ping rounded-full bg-amber-500" />
                    ) : null}
                  </div>
                  <h4 className="text-foreground text-xs font-bold">
                    {step.label}
                  </h4>
                  <p className="text-muted-foreground mt-0.5 text-[10px]">
                    {step.desc}
                  </p>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* DETAILS & ITEMIZED RECEIPT */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Delivery / Fulfillment info */}
        <div className="bg-card border-border space-y-4 rounded-3xl border p-6 text-xs shadow-xs md:col-span-1">
          <h3 className="text-foreground text-sm font-bold">
            Fulfillment Specs
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground text-[10px] font-bold uppercase">
                Type
              </p>
              <p className="font-semibold">{order.orderType}</p>
            </div>

            {order.deliveryAddress ? (
              <div>
                <p className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase">
                  <MapPin className="h-3 w-3 text-red-500" />
                  <span>Delivery Address</span>
                </p>
                <p className="text-foreground font-medium">
                  {order.deliveryAddress}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase">
                  <ShoppingBag className="h-3 w-3 text-emerald-500" />
                  <span>Pickup Scheduled</span>
                </p>
                <p className="text-foreground font-medium">
                  {order.pickupTime ?? "ASAP"}
                </p>
              </div>
            )}

            <div>
              <p className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase">
                <Phone className="h-3 w-3 text-sky-500" />
                <span>Customer Contact</span>
              </p>
              <p className="font-medium">{order.customerPhone}</p>
            </div>

            {order.specialInstructions && (
              <div className="bg-muted/60 border-border rounded-xl border p-2.5">
                <p className="text-muted-foreground text-[10px] font-bold uppercase">
                  Instructions
                </p>
                <p className="text-foreground mt-0.5 italic">
                  &quot;{order.specialInstructions}&quot;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Itemized Receipt */}
        <div className="bg-card border-border space-y-4 rounded-3xl border p-6 shadow-xs md:col-span-2">
          <h3 className="text-foreground text-sm font-bold">
            Itemized Banquet Receipt
          </h3>

          <div className="divide-border/60 divide-y">
            {order.items.map((item: OrderItemDetail) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 py-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.name}
                    width={48}
                    height={48}
                    className="bg-muted h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground font-bold">
                        {item.menuItem.name}
                      </span>
                      <span className="text-muted-foreground text-[11px]">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-[10px]">
                      <span className="font-medium">
                        {item.menuItem.kingdom}
                      </span>
                      {item.spiceLevel !== null && item.spiceLevel > 0 && (
                        <span className="flex items-center gap-0.5 text-red-500">
                          <Flame className="h-3 w-3" />
                          Spice Lv.{item.spiceLevel}
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-muted-foreground text-[10px] italic">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-foreground font-bold">
                  ₱{(Number(item.unitPrice) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-border text-muted-foreground space-y-1.5 border-t pt-3 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-foreground font-medium">
                ₱{Number(order.subtotal).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>VAT (12%):</span>
              <span>₱{Number(order.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>₱{Number(order.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="text-foreground border-border flex justify-between border-t pt-2 text-sm font-black">
              <span>Total Paid ({order.paymentMethod}):</span>
              <span className="text-amber-600 dark:text-amber-400">
                ₱{Number(order.totalAmount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
