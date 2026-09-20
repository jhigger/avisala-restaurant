"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import type { IngredientDetail, MenuItemDetail } from "~/types/domain";
import { Mountain, Plus, ArrowLeft } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";

interface ReplenishTarget {
  id: string;
  name: string;
  currentStock: number;
  lowStockThreshold: number;
  unit: string;
  costPerUnit?: number | null;
}

export default function AdminInventoryPage() {
  const utils = api.useUtils();

  const { data: ingredients } = api.inventory.getAll.useQuery();
  const { data: menuItems } = api.menu.getAll.useQuery();

  const [replenishTarget, setReplenishTarget] =
    useState<ReplenishTarget | null>(null);
  const [addedAmount, setAddedAmount] = useState<number>(5);
  const [costPerUnit, setCostPerUnit] = useState<number | undefined>(undefined);

  const replenishMutation = api.inventory.replenish.useMutation({
    async onMutate(variables) {
      await utils.inventory.getAll.cancel();
      const previousIngredients = utils.inventory.getAll.getData();

      utils.inventory.getAll.setData(undefined, (old) => {
        if (!old) return old;
        return old.map((ing: IngredientDetail) => {
          if (ing.id === variables.ingredientId) {
            const newStock = ing.currentStock + variables.addedStock;
            return {
              ...ing,
              currentStock: newStock,
              isLowStock: newStock <= ing.lowStockThreshold,
              costPerUnit: variables.costPerUnit ?? ing.costPerUnit,
            };
          }
          return ing;
        });
      });

      setReplenishTarget(null);
      setCostPerUnit(undefined);

      return { previousIngredients };
    },
    onError(err, variables, context) {
      if (context?.previousIngredients) {
        utils.inventory.getAll.setData(undefined, context.previousIngredients);
      }
    },
    onSettled() {
      void utils.inventory.getAll.invalidate();
      void utils.menu.getAll.invalidate();
    },
  });

  const toggleMenuItemMutation = api.menu.toggleAvailability.useMutation({
    async onMutate(variables) {
      await utils.menu.getAll.cancel();
      const previousMenu = utils.menu.getAll.getData();

      utils.menu.getAll.setData(undefined, (old) => {
        if (!old) return old;
        return old.map((dish: MenuItemDetail) =>
          dish.id === variables.id
            ? { ...dish, isAvailable: variables.isAvailable }
            : dish,
        );
      });

      return { previousMenu };
    },
    onError(err, variables, context) {
      if (context?.previousMenu) {
        utils.menu.getAll.setData(undefined, context.previousMenu);
      }
    },
    onSettled() {
      void utils.menu.getAll.invalidate();
    },
  });

  const handleReplenishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replenishTarget || addedAmount <= 0) return;

    replenishMutation.mutate({
      ingredientId: replenishTarget.id,
      addedStock: addedAmount,
      costPerUnit: costPerUnit && costPerUnit > 0 ? costPerUnit : undefined,
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="bg-card border-border flex flex-col items-start justify-between gap-4 rounded-3xl border p-5 shadow-xs sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Operations Portal</span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              <Mountain className="h-3 w-3" />
              Real-Time Pantry Inventory
            </span>
          </div>
          <h1 className="text-foreground text-2xl font-black tracking-tight">
            Elemental Ingredient Stocks &amp; Recipe Linkage
          </h1>
          <p className="text-muted-foreground text-xs">
            Ingredients automatically decrement as customers order. Restocking
            instantly re-activates sold-out dishes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {ingredients?.filter((i: IngredientDetail) => i.isLowStock)
              .length ?? 0}{" "}
            Low-Stock Warnings
          </Badge>
        </div>
      </div>

      {/* INGREDIENTS GRID */}
      <div className="space-y-4">
        <h2 className="text-foreground text-lg font-bold">
          Pantry Stock Status
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {ingredients?.map((ing: IngredientDetail) => {
            const isDepleted = ing.currentStock <= 0;
            const isLow = ing.isLowStock && !isDepleted;
            const stockPercent = Math.min(
              100,
              Math.round(
                (ing.currentStock / (ing.lowStockThreshold * 2.5)) * 100,
              ),
            );

            return (
              <div
                key={ing.id}
                className={`bg-card space-y-3 rounded-2xl border p-5 shadow-xs transition-all ${
                  isDepleted
                    ? "border-destructive/50 ring-destructive/30 ring-1"
                    : isLow
                      ? "border-amber-500/50 ring-1 ring-amber-500/30"
                      : "border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-foreground text-sm font-bold">
                      {ing.name}
                    </h3>
                    <p className="text-muted-foreground text-[10px] uppercase">
                      {ing.kingdom} Affinity
                    </p>
                  </div>
                  {isDepleted ? (
                    <Badge className="bg-destructive text-destructive-foreground text-[10px]">
                      Depleted
                    </Badge>
                  ) : isLow ? (
                    <Badge className="bg-amber-500 text-[10px] text-white">
                      Low Stock
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/5 text-[10px] text-emerald-600"
                    >
                      Healthy
                    </Badge>
                  )}
                </div>

                <div>
                  <div className="mb-1 flex items-baseline justify-between text-xs">
                    <span className="text-foreground text-2xl font-black">
                      {ing.currentStock.toFixed(1)}{" "}
                      <span className="text-muted-foreground text-xs font-normal">
                        {ing.unit}
                      </span>
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Alert: &lt;{ing.lowStockThreshold} {ing.unit}
                    </span>
                  </div>

                  {/* Stock meter bar */}
                  <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDepleted
                          ? "bg-destructive"
                          : isLow
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.max(5, stockPercent)}%` }}
                    />
                  </div>
                </div>

                <div className="border-border/50 flex items-center justify-between border-t pt-2">
                  <span className="text-muted-foreground text-[10px]">
                    Used in {ing.usedIn.length} recipes
                  </span>
                  <Button
                    onClick={() => {
                      setReplenishTarget(ing);
                      setAddedAmount(ing.unit === "L" ? 2 : 5);
                      setCostPerUnit(ing.costPerUnit ?? undefined);
                    }}
                    size="sm"
                    variant="outline"
                    className="flex h-7 items-center gap-1 px-2.5 text-xs font-semibold"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Restock</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MENU AVAILABILITY OVERVIEW */}
      <div className="bg-card border-border space-y-4 rounded-3xl border p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground text-lg font-bold">
              Direct Menu Availability Controls
            </h2>
            <p className="text-muted-foreground text-xs">
              Override menu availability or check dishes tied to inventory
              levels.
            </p>
          </div>
        </div>

        <div className="divide-border/60 divide-y">
          {menuItems?.map((dish: MenuItemDetail) => (
            <div
              key={dish.id}
              className="flex items-center justify-between gap-3 py-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={dish.imageUrl}
                  alt={dish.name}
                  width={40}
                  height={40}
                  className="bg-muted h-10 w-10 shrink-0 rounded-lg object-cover"
                />
                <div>
                  <p className="text-foreground font-bold">{dish.name}</p>
                  <p className="text-muted-foreground text-[10px]">
                    {dish.kingdom} • ₱{dish.price.toFixed(2)} •{" "}
                    {dish.recipe.length} recipe ingredients
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  className={`text-[10px] font-bold ${
                    dish.isAvailable
                      ? "bg-emerald-600 text-white"
                      : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  {dish.isAvailable ? "Available" : "Sold Out"}
                </Badge>

                <Button
                  onClick={() =>
                    toggleMenuItemMutation.mutate({
                      id: dish.id,
                      isAvailable: !dish.isAvailable,
                    })
                  }
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                >
                  {dish.isAvailable ? "Mark Sold Out" : "Mark Available"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESTOCK MODAL */}
      {replenishTarget && (
        <Dialog
          open={!!replenishTarget}
          onOpenChange={() => setReplenishTarget(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Restock {replenishTarget.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Enter the amount delivered to the pantry. If associated dishes
                were sold out, they will automatically be re-enabled.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleReplenishSubmit} className="space-y-4 pt-2">
              <div className="bg-muted/40 border-border space-y-1 rounded-xl border p-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Stock:</span>
                  <span className="font-bold">
                    {replenishTarget.currentStock.toFixed(1)}{" "}
                    {replenishTarget.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Threshold:</span>
                  <span>
                    {replenishTarget.lowStockThreshold} {replenishTarget.unit}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stockAdd" className="text-xs">
                  Quantity to Add ({replenishTarget.unit})
                </Label>
                <Input
                  id="stockAdd"
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={addedAmount}
                  onChange={(e) =>
                    setAddedAmount(parseFloat(e.target.value) || 0)
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="costPerUnit" className="text-xs">
                  Unit Cost (₱ per {replenishTarget.unit}, optional)
                </Label>
                <Input
                  id="costPerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 150.00"
                  value={costPerUnit ?? ""}
                  onChange={(e) =>
                    setCostPerUnit(
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                />
              </div>

              <Button
                type="submit"
                disabled={replenishMutation.isPending}
                className="w-full bg-emerald-600 font-bold text-white hover:bg-emerald-700"
              >
                {replenishMutation.isPending
                  ? "Updating Pantry..."
                  : `Confirm Restock (+${addedAmount} ${replenishTarget.unit})`}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
