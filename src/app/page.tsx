"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import { useCart } from "~/context/cart-context";
import type { MenuItemDetail } from "~/types/domain";
import {
  Sparkles,
  Utensils,
  CalendarCheck,
  Flame,
  Wind,
  Mountain,
  Droplets,
  ArrowRight,
  ChefHat,
  ShoppingBag,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default function HomePage() {
  const { addItem } = useCart();
  const { data: menuItems } = api.menu.getAll.useQuery();

  const chefSpecials: MenuItemDetail[] =
    menuItems
      ?.filter((item: MenuItemDetail) => item.isChefSpecial)
      .slice(0, 4) ?? [];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="border-border/50 from-background to-background relative overflow-hidden border-b bg-linear-to-b via-amber-500/3 pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-87.5 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-emerald-500/10 via-amber-500/10 to-sky-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl space-y-8 px-4 text-center sm:px-6 lg:px-8">
          {/* Greeting Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-800 shadow-xs dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5 animate-spin text-amber-500" />
            <span>
              &quot;Avisala!&quot; — Welcome to Encantadia&apos;s Royal Dining
              Realm
            </span>
          </div>

          {/* Heading */}
          <div className="mx-auto max-w-4xl space-y-4">
            <h1 className="text-foreground text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              A Feast of Four Kingdoms,{" "}
              <span className="bg-linear-to-r from-amber-600 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                Served at Your Command.
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
              Order ethereal delicacies for instant delivery, reserve royal
              banquet tables across the four elemental halls, and experience
              seamless dining powered by real-time kitchen fulfillment.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link href="/menu">
              <Button
                size="lg"
                className="flex w-full items-center gap-2 rounded-xl bg-amber-600 px-8 py-6 text-base font-bold text-white shadow-lg shadow-amber-600/25 hover:bg-amber-700 sm:w-auto"
              >
                <Utensils className="h-5 w-5" />
                <span>Order Online (Delivery &amp; Pickup)</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/reserve">
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-accent flex w-full items-center gap-2 rounded-xl px-8 py-6 text-base font-bold sm:w-auto"
              >
                <CalendarCheck className="h-5 w-5 text-sky-600" />
                <span>Reserve a Dining Table</span>
              </Button>
            </Link>
          </div>

          {/* Value props pill */}
          <div className="text-muted-foreground mx-auto grid max-w-3xl grid-cols-2 gap-4 pt-6 text-xs font-medium sm:grid-cols-4">
            <div className="bg-card border-border/80 flex items-center justify-center gap-2 rounded-xl border p-3 shadow-xs">
              <Wind className="h-4 w-4 text-emerald-600" />
              <span>4 Elemental Realms</span>
            </div>
            <div className="bg-card border-border/80 flex items-center justify-center gap-2 rounded-xl border p-3 shadow-xs">
              <Flame className="h-4 w-4 text-red-600" />
              <span>Live Kitchen KDS</span>
            </div>
            <div className="bg-card border-border/80 flex items-center justify-center gap-2 rounded-xl border p-3 shadow-xs">
              <Mountain className="h-4 w-4 text-amber-600" />
              <span>Pantry Stock Sync</span>
            </div>
            <div className="bg-card border-border/80 flex items-center justify-center gap-2 rounded-xl border p-3 shadow-xs">
              <Droplets className="h-4 w-4 text-sky-600" />
              <span>Digital E-Wallet Pay</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE FOUR REALMS SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl space-y-2 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Journey Through The Four Kingdoms
          </h2>
          <p className="text-muted-foreground text-sm">
            Every dish honors the ancient elements of Encantadia, crafted by
            culinary alchemists with fresh native ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* LIREO */}
          <div className="group realm-card-lireo flex flex-col justify-between space-y-4 rounded-2xl border p-6 transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600">
                  <Wind className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold tracking-widest text-emerald-700 uppercase dark:text-emerald-300">
                  Hangin • Air
                </span>
              </div>
              <h3 className="text-foreground text-lg font-bold">
                Kingdom of Lireo
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Light, celestial broths, wind-kissed roasted fowl, silver cloud
                mushrooms, and airy mountain pandan soufflés.
              </p>
            </div>
            <Link
              href="/menu?kingdom=LIREO"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 transition-all group-hover:translate-x-1 hover:text-emerald-700"
            >
              <span>Explore Lireo Dishes</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* HATHORIA */}
          <div className="group realm-card-hathoria flex flex-col justify-between space-y-4 rounded-2xl border p-6 transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-600">
                  <Flame className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold tracking-widest text-red-700 uppercase dark:text-red-300">
                  Apoy • Fire
                </span>
              </div>
              <h3 className="text-foreground text-lg font-bold">
                Kingdom of Hathoria
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Volcanic charcoal grills, 12-hour smoked pork ribs, fiery
                skewers, and molten dark chocolate cakes infused with spice.
              </p>
            </div>
            <Link
              href="/menu?kingdom=HATHORIA"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 transition-all group-hover:translate-x-1 hover:text-red-700"
            >
              <span>Explore Hathorian Hearth</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* SAPIRO */}
          <div className="group realm-card-sapiro flex flex-col justify-between space-y-4 rounded-2xl border p-6 transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/10 text-amber-600">
                  <Mountain className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold tracking-widest text-amber-700 uppercase dark:text-amber-300">
                  Lupa • Earth
                </span>
              </div>
              <h3 className="text-foreground text-lg font-bold">
                Kingdom of Sapiro
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Slow-braised marrow beef shank, crispy truffle-rubbed potato
                gems, forest wild honey crisp, and warrior banquets.
              </p>
            </div>
            <Link
              href="/menu?kingdom=SAPIRO"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 transition-all group-hover:translate-x-1 hover:text-amber-700"
            >
              <span>Explore Sapiro Hall</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* ADAMYA */}
          <div className="group realm-card-adamya flex flex-col justify-between space-y-4 rounded-2xl border p-6 transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600/10 text-sky-600">
                  <Droplets className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold tracking-widest text-sky-700 uppercase dark:text-sky-300">
                  Tubig • Water
                </span>
              </div>
              <h3 className="text-foreground text-lg font-bold">
                Kingdom of Adamya
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Wild ocean salmon fillets, butterfly pea blue chowder, sparkling
                elderflower nectars, and translucent crystal raindrops.
              </p>
            </div>
            <Link
              href="/menu?kingdom=ADAMYA"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 transition-all group-hover:translate-x-1 hover:text-sky-700"
            >
              <span>Explore Adamya Lagoon</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CHEF SPECIALS SPOTLIGHT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
              <ChefHat className="h-4 w-4" />
              <span>Royal Banquet Highlights</span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Chef&apos;s Elemental Masterpieces
            </h2>
          </div>
          <Link href="/menu">
            <Button variant="outline" className="gap-1.5 text-xs font-semibold">
              <span>View Full Menu</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {chefSpecials.map((item: MenuItemDetail) => (
            <div
              key={item.id}
              className="group border-border bg-card flex flex-col overflow-hidden rounded-2xl border shadow-xs transition-all hover:border-amber-500/40 hover:shadow-md"
            >
              <div className="bg-muted relative h-48 w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <Badge className="bg-background/90 text-foreground border-border border text-[10px] font-bold backdrop-blur-md">
                    {item.kingdom}
                  </Badge>
                  {item.brilyanteSpiceLevel > 0 && (
                    <Badge className="flex items-center gap-0.5 bg-red-600 text-[10px] font-bold text-white">
                      <Flame className="h-3 w-3 fill-white" />
                      <span>Lv.{item.brilyanteSpiceLevel}</span>
                    </Badge>
                  )}
                </div>
                <div className="absolute right-3 bottom-3">
                  <span className="bg-card/90 border-border rounded-lg border px-2.5 py-1 text-xs font-extrabold text-amber-600 shadow-xs backdrop-blur-md dark:text-amber-400">
                    ₱{Number(item.price).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                <div>
                  <h4 className="text-foreground line-clamp-1 text-sm font-bold transition-colors group-hover:text-amber-600">
                    {item.name}
                  </h4>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <Button
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
                  className="flex h-9 w-full items-center justify-center gap-1.5 bg-amber-600 text-xs font-semibold text-white hover:bg-amber-700"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add to Order Bag</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BACK OF HOUSE OPERATIONS CALLOUT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-border/80 from-card via-accent/30 to-card space-y-6 rounded-3xl border bg-linear-to-br p-8 shadow-sm sm:p-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
              Back-of-House Integration
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Restaurant Operations Portal
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
              Explore the real-time operational engine that powers Avisala
              Restaurant: live kitchen fulfillment boards, interactive table
              floor plans, automated pantry inventory tracking, and weekly staff
              rosters.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
            <Link
              href="/admin/kds"
              className="bg-card border-border hover:bg-accent/40 group space-y-1 rounded-xl border p-4 text-left transition-all hover:border-amber-500/50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
                <Flame className="h-4 w-4" />
              </div>
              <p className="text-foreground text-xs font-bold group-hover:text-red-600">
                Kitchen Display (KDS)
              </p>
              <p className="text-muted-foreground text-[10px]">
                Kanban queue with live timers
              </p>
            </Link>

            <Link
              href="/admin/tables"
              className="bg-card border-border hover:bg-accent/40 group space-y-1 rounded-xl border p-4 text-left transition-all hover:border-amber-500/50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                <CalendarCheck className="h-4 w-4" />
              </div>
              <p className="text-foreground text-xs font-bold group-hover:text-sky-600">
                Table Floor Plan
              </p>
              <p className="text-muted-foreground text-[10px]">
                Guest seating &amp; check-in desk
              </p>
            </Link>

            <Link
              href="/admin/inventory"
              className="bg-card border-border hover:bg-accent/40 group space-y-1 rounded-xl border p-4 text-left transition-all hover:border-amber-500/50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Mountain className="h-4 w-4" />
              </div>
              <p className="text-foreground text-xs font-bold group-hover:text-emerald-600">
                Pantry Inventory
              </p>
              <p className="text-muted-foreground text-[10px]">
                Stock decrements &amp; alerts
              </p>
            </Link>

            <Link
              href="/admin/staff"
              className="bg-card border-border hover:bg-accent/40 group space-y-1 rounded-xl border p-4 text-left transition-all hover:border-amber-500/50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <ChefHat className="h-4 w-4" />
              </div>
              <p className="text-foreground text-xs font-bold group-hover:text-amber-600">
                Staff Shift Roster
              </p>
              <p className="text-muted-foreground text-[10px]">
                Weekly 7-day schedule grid
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
