"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { api } from "~/trpc/react";
import { useCart } from "~/context/cart-context";
import { getRealmTheme } from "~/lib/constants";
import type { MenuItemDetail } from "~/types/domain";
import {
  Utensils,
  Search,
  Flame,
  Wind,
  Mountain,
  Droplets,
  ShoppingBag,
  Sparkles,
  Info,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { MenuItemSkeletonGrid } from "~/components/skeletons/menu-item-skeleton";
import MenuLoading from "./loading";

export const dynamic = "force-dynamic";

export default function MenuPage() {
  return (
    <Suspense fallback={<MenuLoading />}>
      <MenuContent />
    </Suspense>
  );
}

function MenuContent() {
  const searchParams = useSearchParams();
  const initialKingdom = searchParams.get("kingdom") ?? "ALL";

  const [selectedKingdom, setSelectedKingdom] = useState(initialKingdom);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<string>("ALL");

  // Modal for customizing item
  const [selectedItem, setSelectedItem] = useState<MenuItemDetail | null>(null);

  const [spiceChoice, setSpiceChoice] = useState(0);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemNotes, setItemNotes] = useState("");

  const { addItem } = useCart();

  const { data: menuItems, isLoading } = api.menu.getAll.useQuery();

  const categories = [
    "ALL",
    "Appetizers",
    "Mains",
    "Banquets",
    "Potions",
    "Desserts",
  ];

  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter((item: MenuItemDetail) => {
      // Kingdom filter
      if (selectedKingdom !== "ALL" && item.kingdom !== selectedKingdom)
        return false;
      // Category filter
      if (selectedCategory !== "ALL" && item.category !== selectedCategory)
        return false;
      // Dietary filter
      if (selectedDietary !== "ALL" && !item.dietary.includes(selectedDietary))
        return false;
      // Search filter
      if (
        searchQuery.trim() &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [
    menuItems,
    selectedKingdom,
    selectedCategory,
    selectedDietary,
    searchQuery,
  ]);

  const openCustomizeModal = (item: MenuItemDetail) => {
    setSelectedItem(item);
    setSpiceChoice(item.brilyanteSpiceLevel);
    setItemQuantity(1);
    setItemNotes("");
  };

  const handleConfirmAdd = () => {
    if (!selectedItem) return;
    addItem(
      {
        menuItemId: selectedItem.id,
        name: selectedItem.name,
        price: Number(selectedItem.price),
        kingdom: selectedItem.kingdom,
        imageUrl: selectedItem.imageUrl,
        spiceLevel: spiceChoice,
        notes: itemNotes.trim() || undefined,
      },
      itemQuantity,
    );
    setSelectedItem(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="border-border/80 flex flex-col items-start justify-between gap-6 rounded-3xl border bg-linear-to-r from-amber-500/10 via-emerald-500/10 to-sky-500/10 p-8 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="bg-card border-border inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold text-amber-700 shadow-2xs dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Encantadia Elemental Menu</span>
          </div>
          <h1 className="text-foreground text-3xl font-black tracking-tight sm:text-4xl">
            Feasts of the Four Kingdoms
          </h1>
          <p className="text-muted-foreground max-w-xl text-xs sm:text-sm">
            Choose delicacies from Lireo, Hathoria, Sapiro, and Adamya. Add your
            spice preference, configure notes, and place your order for delivery
            or pickup.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search dishes or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card/90 pl-10"
          />
        </div>
      </div>

      {/* KINGDOM TABS */}
      <div className="bg-muted/60 border-border grid grid-cols-2 gap-2 rounded-2xl border p-1.5 sm:grid-cols-5">
        <button
          onClick={() => setSelectedKingdom("ALL")}
          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
            selectedKingdom === "ALL"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>All Kingdoms</span>
        </button>

        <button
          onClick={() => setSelectedKingdom("LIREO")}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
            selectedKingdom === "LIREO"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wind className="h-4 w-4" />
          <span>Lireo (Air)</span>
        </button>

        <button
          onClick={() => setSelectedKingdom("HATHORIA")}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
            selectedKingdom === "HATHORIA"
              ? "bg-red-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Hathoria (Fire)</span>
        </button>

        <button
          onClick={() => setSelectedKingdom("SAPIRO")}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
            selectedKingdom === "SAPIRO"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mountain className="h-4 w-4" />
          <span>Sapiro (Earth)</span>
        </button>

        <button
          onClick={() => setSelectedKingdom("ADAMYA")}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
            selectedKingdom === "ADAMYA"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Droplets className="h-4 w-4" />
          <span>Adamya (Water)</span>
        </button>
      </div>

      {/* CATEGORY & DIETARY FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-foreground text-background font-bold shadow-xs"
                  : "bg-card border-border text-muted-foreground hover:text-foreground border"
              }`}
            >
              {cat === "ALL" ? "All Courses" : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground mr-1 text-[11px]">
            Dietary:
          </span>
          {["ALL", "Halal", "Vegetarian", "Gluten-Free"].map((diet: string) => (
            <button
              key={diet}
              onClick={() => setSelectedDietary(diet)}
              className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                selectedDietary === diet
                  ? "border-amber-500 bg-amber-500/10 font-bold text-amber-800 dark:text-amber-300"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>

      {/* DISHES GRID */}
      {isLoading ? (
        <MenuItemSkeletonGrid count={8} />
      ) : filteredItems.length === 0 ? (
        <div className="border-border space-y-2 rounded-2xl border border-dashed p-8 py-16 text-center">
          <Utensils className="text-muted-foreground mx-auto h-10 w-10 opacity-40" />
          <p className="text-sm font-bold">No dishes match your filter</p>
          <p className="text-muted-foreground text-xs">
            Try clearing your search query or selecting another kingdom.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item: MenuItemDetail) => (
            <div
              key={item.id}
              className={`bg-card group flex flex-col overflow-hidden rounded-2xl border shadow-xs transition-all hover:shadow-md ${
                !item.isAvailable
                  ? "border-muted opacity-60"
                  : "border-border hover:border-amber-500/40"
              }`}
            >
              {/* Image & Badges */}
              <div className="bg-muted relative h-44 w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                  <Badge
                    className={`border text-[10px] font-bold backdrop-blur-md ${getRealmTheme(item.kingdom).badgeClass}`}
                  >
                    {item.kingdom}
                  </Badge>
                  {item.brilyanteSpiceLevel > 0 && (
                    <Badge className="flex items-center gap-0.5 bg-red-600 text-[10px] font-bold text-white">
                      <Flame className="h-3 w-3 fill-white" />
                      <span>Lv.{item.brilyanteSpiceLevel}</span>
                    </Badge>
                  )}
                  {item.isChefSpecial && (
                    <Badge className="bg-amber-500 text-[10px] font-bold text-white">
                      Special
                    </Badge>
                  )}
                </div>

                {!item.isAvailable && (
                  <div className="bg-background/70 absolute inset-0 flex items-center justify-center backdrop-blur-xs">
                    <span className="bg-destructive text-destructive-foreground rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
                      Sold Out
                    </span>
                  </div>
                )}

                <div className="absolute right-2.5 bottom-2.5">
                  <span className="bg-card/90 border-border rounded-md border px-2 py-0.5 text-xs font-extrabold text-amber-600 shadow-xs backdrop-blur-md dark:text-amber-400">
                    ₱{Number(item.price).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-foreground line-clamp-1 text-sm font-bold transition-colors group-hover:text-amber-600">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                    {item.description}
                  </p>

                  {item.dietary && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.dietary.split(",").map((d: string) => (
                        <span
                          key={d}
                          className="py-0.2 bg-muted text-muted-foreground rounded px-1.5 text-[9px] font-medium"
                        >
                          {d.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-border/50 flex gap-2 border-t pt-2">
                  <Button
                    disabled={!item.isAvailable}
                    onClick={() => openCustomizeModal(item)}
                    variant="outline"
                    className="h-8.5 flex-1 text-xs font-semibold"
                  >
                    Details &amp; Spice
                  </Button>
                  <Button
                    disabled={!item.isAvailable}
                    onClick={() =>
                      addItem({
                        menuItemId: item.id,
                        name: item.name,
                        price: Number(item.price),
                        kingdom: item.kingdom,
                        imageUrl: item.imageUrl,
                        spiceLevel: item.brilyanteSpiceLevel,
                      })
                    }
                    className="h-8.5 bg-amber-600 px-3 text-xs font-semibold text-white hover:bg-amber-700"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CUSTOMIZATION MODAL */}
      {selectedItem && (
        <Dialog
          open={!!selectedItem}
          onOpenChange={() => setSelectedItem(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <span>{selectedItem.name}</span>
                <Badge variant="outline" className="text-xs">
                  {selectedItem.kingdom}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                {selectedItem.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="bg-muted relative h-44 w-full overflow-hidden rounded-xl">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Brilyante Spice Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-bold">
                    <Flame className="h-3.5 w-3.5 text-red-500" />
                    <span>Brilyante Spice Rating:</span>
                  </span>
                  <span className="text-muted-foreground font-semibold">
                    {spiceChoice === 0
                      ? "Gentle Breeze (No heat)"
                      : spiceChoice === 1
                        ? "Mild Ember (Level 1)"
                        : spiceChoice === 2
                          ? "Radiant Heat (Level 2)"
                          : spiceChoice === 3
                            ? "Volcanic Flame (Level 3)"
                            : "Hathorian Inferno (Level 4)"}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 1, 2, 3, 4].map((lvl: number) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSpiceChoice(lvl)}
                      className={`rounded-lg border py-1.5 text-xs font-bold transition-all ${
                        spiceChoice === lvl
                          ? "border-red-600 bg-red-600 text-white shadow-xs"
                          : "border-border bg-muted/40 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      Lv.{lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipe Ingredients / Transparency */}
              {selectedItem.recipe && selectedItem.recipe.length > 0 && (
                <div className="bg-muted/50 border-border space-y-1 rounded-xl border p-3 text-xs">
                  <p className="text-foreground flex items-center gap-1 text-[11px] font-bold">
                    <Info className="h-3.5 w-3.5 text-amber-500" />
                    <span>Fresh Ingredients Used:</span>
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {selectedItem.recipe
                      .map(
                        (r: { ingredient: { name: string } }) =>
                          r.ingredient.name,
                      )
                      .join(", ")}
                  </p>
                </div>
              )}

              {/* Preparation Notes */}
              <div className="space-y-1">
                <label className="text-xs font-medium">
                  Chef Notes / Preferences
                </label>
                <Input
                  placeholder="e.g. dressing on the side, extra crispy..."
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  className="text-xs"
                />
              </div>

              {/* Quantity & Add Action */}
              <div className="border-border flex items-center justify-between gap-3 border-t pt-2">
                <div className="border-border bg-card flex items-center gap-2 rounded-lg border p-1">
                  <button
                    onClick={() =>
                      setItemQuantity((q: number) => Math.max(1, q - 1))
                    }
                    className="bg-muted text-foreground hover:bg-muted/80 flex h-7 w-7 items-center justify-center rounded-md font-bold"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-bold">
                    {itemQuantity}
                  </span>
                  <button
                    onClick={() => setItemQuantity((q: number) => q + 1)}
                    className="bg-muted text-foreground hover:bg-muted/80 flex h-7 w-7 items-center justify-center rounded-md font-bold"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={handleConfirmAdd}
                  className="flex flex-1 items-center justify-center gap-2 bg-amber-600 py-5 font-bold text-white hover:bg-amber-700"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>
                    Add to Bag • ₱
                    {(Number(selectedItem.price) * itemQuantity).toFixed(2)}
                  </span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
