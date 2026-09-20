"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  kingdom: string;
  imageUrl: string;
  spiceLevel?: number;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  orderType: "DELIVERY" | "PICKUP";
  setOrderType: (type: "DELIVERY" | "PICKUP") => void;
  totalAmount: number;
  totalItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("avisala_cart");
      if (saved) {
        setItems(JSON.parse(saved) as CartItem[]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem("avisala_cart", JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev: CartItem[]) => {
      const existing = prev.find(
        (i: CartItem) => i.menuItemId === item.menuItemId,
      );
      if (existing) {
        return prev.map((i: CartItem) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (menuItemId: string) => {
    setItems((prev: CartItem[]) =>
      prev.filter((i: CartItem) => i.menuItemId !== menuItemId),
    );
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setItems((prev: CartItem[]) =>
      prev
        .map((i: CartItem) => {
          if (i.menuItemId === menuItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter((item: CartItem | null): item is CartItem => item !== null),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce(
    (acc: number, i: CartItem) => acc + i.price * i.quantity,
    0,
  );
  const tax = Math.round(subtotal * 0.12 * 100) / 100;
  const deliveryFee = orderType === "DELIVERY" && items.length > 0 ? 120 : 0;
  const totalAmount = subtotal + tax + deliveryFee;
  const totalItemsCount = items.reduce(
    (acc: number, i: CartItem) => acc + i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        deliveryFee,
        orderType,
        setOrderType,
        totalAmount,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
