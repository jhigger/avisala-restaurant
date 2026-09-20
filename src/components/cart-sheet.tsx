"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart, type CartItem } from "~/context/cart-context";
import { CheckoutModal } from "~/components/checkout-modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Flame,
  Truck,
  ArrowRight,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";

export function CartSheet() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    tax,
    deliveryFee,
    totalAmount,
    orderType,
    setOrderType,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const getKingdomBadge = (kingdom: string) => {
    switch (kingdom) {
      case "LIREO":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/5 text-[10px] text-emerald-600"
          >
            Lireo (Air)
          </Badge>
        );
      case "HATHORIA":
        return (
          <Badge
            variant="outline"
            className="border-red-500/30 bg-red-500/5 text-[10px] text-red-600"
          >
            Hathoria (Fire)
          </Badge>
        );
      case "SAPIRO":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/5 text-[10px] text-amber-600"
          >
            Sapiro (Earth)
          </Badge>
        );
      case "ADAMYA":
        return (
          <Badge
            variant="outline"
            className="border-sky-500/30 bg-sky-500/5 text-[10px] text-sky-600"
          >
            Adamya (Water)
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex w-full flex-col p-6 sm:max-w-md">
          <SheetHeader className="border-border border-b pb-4 text-left">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold">
              <ShoppingBag className="h-5 w-5 text-amber-600" />
              <span>Royal Dining Bag</span>
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-normal">
                {items.length} items
              </span>
            </SheetTitle>
            <SheetDescription className="text-xs">
              Review your elemental dishes before placing your order.
            </SheetDescription>
          </SheetHeader>

          {/* Delivery or Takeout Selector */}
          <div className="bg-muted/60 border-border my-3 grid grid-cols-2 gap-2 rounded-xl border p-1">
            <button
              onClick={() => setOrderType("DELIVERY")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                orderType === "DELIVERY"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Delivery (₱120)</span>
            </button>
            <button
              onClick={() => setOrderType("PICKUP")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                orderType === "PICKUP"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Takeout Pickup</span>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {items.length === 0 ? (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center space-y-3 p-6 text-center">
                <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-full">
                  <ShoppingBag className="h-7 w-7 opacity-50" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">
                    Your order bag is empty
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Browse our elemental menu from the four kingdoms to begin.
                  </p>
                </div>
              </div>
            ) : (
              items.map((item: CartItem) => (
                <div
                  key={item.menuItemId}
                  className="border-border/80 bg-card hover:border-border flex gap-3 rounded-xl border p-3 shadow-xs transition-colors"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="bg-muted h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-foreground truncate text-xs font-bold">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.menuItemId)}
                        className="text-muted-foreground hover:text-destructive p-0.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      {getKingdomBadge(item.kingdom)}
                      {item.spiceLevel !== undefined && item.spiceLevel > 0 && (
                        <span className="flex items-center text-[10px] font-medium text-red-600">
                          <Flame className="h-3 w-3 fill-red-500" />
                          Lv.{item.spiceLevel}
                        </span>
                      )}
                    </div>

                    <div className="border-border/50 mt-2 flex items-center justify-between border-t pt-1">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </span>

                      <div className="border-border bg-background flex items-center gap-1.5 rounded-lg border px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, -1)}
                          className="text-muted-foreground hover:text-foreground p-0.5"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, 1)}
                          className="text-muted-foreground hover:text-foreground p-0.5"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {items.length > 0 && (
            <div className="border-border space-y-3 border-t pt-4">
              <div className="text-muted-foreground space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-foreground font-medium">
                    ₱{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (12% VAT):</span>
                  <span>₱{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>
                    {deliveryFee > 0 ? `₱${deliveryFee.toFixed(2)}` : "Free"}
                  </span>
                </div>
                <div className="text-foreground border-border flex justify-between border-t pt-1.5 text-sm font-bold">
                  <span>Estimated Total:</span>
                  <span className="text-base text-amber-600 dark:text-amber-400">
                    ₱{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setIsCheckoutOpen(true)}
                className="flex w-full items-center justify-center gap-2 bg-amber-600 py-5 font-semibold text-white shadow-md shadow-amber-600/20 hover:bg-amber-700"
              >
                <span>Proceed to Royal Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
    </>
  );
}
