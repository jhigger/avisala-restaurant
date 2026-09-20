"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "~/context/cart-context";
import {
  ShoppingBag,
  Sparkles,
  Utensils,
  CalendarCheck,
  LayoutDashboard,
  Flame,
  Droplets,
  Wind,
  Mountain,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { totalItemsCount, setIsCartOpen } = useCart();

  const isCurrent = (path: string) => pathname === path;
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="border-border/70 bg-background/85 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Realm Greeting */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-emerald-600 to-sky-600 text-white shadow-md shadow-amber-500/20 transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-foreground flex items-center gap-1.5 text-lg font-bold tracking-tight">
              <span>Avisala</span>
              <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                Encantadia
              </span>
            </div>
            <p className="text-muted-foreground text-[10px] font-medium tracking-wide">
              Elemental Dining & Banquets
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          <Link
            href="/menu"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
              isCurrent("/menu")
                ? "bg-accent text-accent-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <Utensils className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Elemental Menu</span>
          </Link>

          <Link
            href="/reserve"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
              isCurrent("/reserve")
                ? "bg-accent text-accent-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <CalendarCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span>Reserve a Table</span>
          </Link>

          {/* Elemental Realms quick indicator */}
          <div className="bg-muted/60 text-muted-foreground border-border/50 mx-2 hidden items-center gap-2 rounded-full border px-2 py-1 text-[11px] lg:flex">
            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <Wind className="h-3 w-3" /> Lireo
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
              <Flame className="h-3 w-3" /> Hathoria
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
              <Mountain className="h-3 w-3" /> Sapiro
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-sky-600 dark:text-sky-400">
              <Droplets className="h-3 w-3" /> Adamya
            </span>
          </div>

          <Link
            href="/admin"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
              isAdmin
                ? "bg-amber-500/15 font-semibold text-amber-700 dark:text-amber-300"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Operations Portal</span>
          </Link>
        </nav>

        {/* Right Actions: Cart & Mobile Menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="border-border bg-card hover:bg-accent text-foreground relative flex items-center gap-2 rounded-full border px-3.5 py-2 shadow-sm transition-all duration-200 hover:border-amber-500/40"
          >
            <ShoppingBag className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden text-xs font-semibold sm:inline">
              Order Bag
            </span>
            {totalItemsCount > 0 && (
              <span className="flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
