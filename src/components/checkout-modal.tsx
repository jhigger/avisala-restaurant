"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "~/context/cart-context";
import { api } from "~/trpc/react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  CreditCard,
  Coins,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const router = useRouter();
  const {
    items,
    subtotal,
    tax,
    deliveryFee,
    totalAmount,
    orderType,
    setOrderType,
    clearCart,
    setIsCartOpen,
  } = useCart();

  const [step, setStep] = useState<"DETAILS" | "PAYMENT" | "PROCESSING">(
    "DETAILS",
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("ASAP (approx. 20-30 mins)");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "GCASH" | "MAYA" | "CARD" | "GOLD"
  >("GCASH");
  const [errorMessage, setErrorMessage] = useState("");

  const createOrderMutation = api.order.create.useMutation({
    onSuccess: (data) => {
      // Fire confetti celebration
      void confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      clearCart();
      setIsCartOpen(false);
      onOpenChange(false);
      router.push(`/orders/${data.orderNumber}`);
    },
    onError: (err) => {
      setStep("PAYMENT");
      setErrorMessage(
        err.message || "Failed to process order. Please try again.",
      );
    },
  });

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!customerName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage("Please enter your phone number.");
      return;
    }
    if (orderType === "DELIVERY" && !deliveryAddress.trim()) {
      setErrorMessage("Please provide a delivery address.");
      return;
    }
    setStep("PAYMENT");
  };

  const handlePaymentSubmit = () => {
    setStep("PROCESSING");
    setErrorMessage("");

    createOrderMutation.mutate({
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      orderType,
      deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : undefined,
      pickupTime: orderType === "PICKUP" ? pickupTime : undefined,
      specialInstructions: specialInstructions || undefined,
      paymentMethod,
      items: items.map((i: CartItem) => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        spiceLevel: i.spiceLevel,
        notes: i.notes,
      })),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <span>Royal Dining Checkout</span>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
              {orderType === "DELIVERY" ? "Express Delivery" : "Takeout Pickup"}
            </span>
          </DialogTitle>
          <DialogDescription>
            {step === "DETAILS"
              ? "Provide your contact and delivery preferences."
              : step === "PAYMENT"
                ? "Select digital payment to confirm your elemental banquet."
                : "Channeling elemental order to the royal kitchen..."}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-2 rounded-lg border p-3 text-sm font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: CUSTOMER & DELIVERY DETAILS */}
        {step === "DETAILS" && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4 pt-2">
            {/* Order Type Toggle */}
            <div className="bg-muted/60 border-border grid grid-cols-2 gap-2 rounded-xl border p-1">
              <button
                type="button"
                onClick={() => setOrderType("DELIVERY")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                  orderType === "DELIVERY"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Truck className="h-4 w-4" />
                <span>Delivery (₱120)</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType("PICKUP")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                  orderType === "PICKUP"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Pickup (Free)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Hara Amihan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs">
                  Mobile Number *
                </Label>
                <Input
                  id="phone"
                  placeholder="0917 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">
                Email Address (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="patron@encantadia.ph"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>

            {orderType === "DELIVERY" ? (
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs">
                  Delivery Street Address *
                </Label>
                <Textarea
                  id="address"
                  rows={2}
                  placeholder="Unit, Building, Street, Barangay, City..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="pickup" className="text-xs">
                  Pickup Time Preference
                </Label>
                <Input
                  id="pickup"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="e.g. In 20 minutes or 07:30 PM"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="instructions" className="text-xs">
                Special Requests / Chef Notes
              </Label>
              <Input
                id="instructions"
                placeholder="Allergies, door codes, extra napkins..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            {/* Summary preview */}
            <div className="bg-muted/40 border-border space-y-1 rounded-xl border p-3 text-xs">
              <div className="text-muted-foreground flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-foreground font-semibold">
                  ₱{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="text-muted-foreground flex justify-between">
                <span>VAT (12%):</span>
                <span>₱{tax.toFixed(2)}</span>
              </div>
              <div className="text-muted-foreground flex justify-between">
                <span>Delivery:</span>
                <span>
                  {deliveryFee > 0 ? `₱${deliveryFee.toFixed(2)}` : "Free"}
                </span>
              </div>
              <div className="text-foreground border-border/60 flex justify-between border-t pt-1 text-sm font-bold">
                <span>Total to Pay:</span>
                <span className="text-amber-600 dark:text-amber-400">
                  ₱{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-600 font-semibold text-white hover:bg-amber-700"
            >
              Continue to Digital Payment
            </Button>
          </form>
        )}

        {/* STEP 2: DIGITAL PAYMENT SIMULATION */}
        {step === "PAYMENT" && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs">Choose Digital Payment Gateway</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("GCASH")}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    paymentMethod === "GCASH"
                      ? "border-blue-500 bg-blue-500/10 shadow-sm"
                      : "border-border hover:bg-accent/40"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white">
                    G
                  </div>
                  <div>
                    <p className="text-xs font-bold">GCash</p>
                    <p className="text-muted-foreground text-[10px]">
                      E-Wallet Instant
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("MAYA")}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    paymentMethod === "MAYA"
                      ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                      : "border-border hover:bg-accent/40"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-xs font-black text-white">
                    M
                  </div>
                  <div>
                    <p className="text-xs font-bold">Maya</p>
                    <p className="text-muted-foreground text-[10px]">
                      Digital Bank
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    paymentMethod === "CARD"
                      ? "border-purple-500 bg-purple-500/10 shadow-sm"
                      : "border-border hover:bg-accent/40"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Credit / Debit</p>
                    <p className="text-muted-foreground text-[10px]">
                      Visa / Mastercard
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("GOLD")}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    paymentMethod === "GOLD"
                      ? "border-amber-500 bg-amber-500/10 shadow-sm"
                      : "border-border hover:bg-accent/40"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Gold Coins</p>
                    <p className="text-muted-foreground text-[10px]">
                      Encantadian Royal
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Simulated Gateway Info Card */}
            <div className="bg-card border-border/80 space-y-2 rounded-xl border p-4 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Merchant:</span>
                <span className="font-semibold">
                  Avisala Encantadia Restaurant
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Account Holder:</span>
                <span>
                  {customerName} ({customerPhone})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Payment Channel:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {paymentMethod} Verified
                </span>
              </div>
              <div className="border-border/60 flex items-center justify-between border-t pt-2 text-sm font-bold">
                <span>Charge Amount:</span>
                <span className="text-lg text-emerald-600 dark:text-emerald-400">
                  ₱{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-[11px]">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>
                Simulated encrypted transaction. Your order will be placed
                instantly.
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("DETAILS")}
                className="w-1/3"
              >
                Back
              </Button>
              <Button
                onClick={handlePaymentSubmit}
                className="flex w-2/3 items-center justify-center gap-2 bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
              >
                <span>Authorize ₱{totalAmount.toFixed(2)}</span>
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING ORDER */}
        {step === "PROCESSING" && (
          <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-amber-500/20" />
              </div>
            </div>
            <div>
              <h4 className="text-base font-bold">
                Inscribing Order in the Royal Kitchen...
              </h4>
              <p className="text-muted-foreground mt-1 max-w-xs text-xs">
                Securing fresh kingdom ingredients and notifying our chefs of
                the hearth.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
