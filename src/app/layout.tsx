import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import Link from "next/link";
import { TRPCReactProvider } from "~/trpc/react";
import { CartProvider } from "~/context/cart-context";
import { Navbar } from "~/components/navbar";
import { CartSheet } from "~/components/cart-sheet";
import { cn } from "~/lib/utils";
import { Sparkles, ShieldCheck, Clock } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title:
    "Avisala Restaurant | Encantadia Elemental Dining & Table Reservations",
  description:
    "Welcome to Avisala Restaurant. Experience full-service dining inspired by the iconic Encantadia universe: online food ordering, table reservations across the 4 elemental realms, and real-time operations.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(geist.variable, "font-sans", inter.variable)}>
      <body className="bg-background text-foreground flex min-h-screen flex-col">
        <TRPCReactProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <CartSheet />

            {/* Footer */}
            <footer className="border-border/80 bg-card/60 mt-16 border-t backdrop-blur-sm">
              <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                  {/* Col 1: Brand */}
                  <div className="space-y-3 md:col-span-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-emerald-600 text-white">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <span className="text-base font-bold tracking-tight">
                        Avisala Restaurant
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Inspired by the enchanted realms of Lireo, Sapiro,
                      Hathoria, and Adamya. Providing a royal dining banquet for
                      every honored guest.
                    </p>
                    <p className="font-serif text-[11px] text-amber-600 italic dark:text-amber-400">
                      &quot;Avisala meiste, honored patron.&quot;
                    </p>
                  </div>

                  {/* Col 2: Realms */}
                  <div className="space-y-2 text-xs">
                    <p className="text-foreground font-bold tracking-wider uppercase">
                      Elemental Realms
                    </p>
                    <ul className="text-muted-foreground space-y-1.5">
                      <li>
                        <span className="font-semibold text-emerald-600">
                          • Lireo Terrace
                        </span>{" "}
                        — Air & Mountain Herbals
                      </li>
                      <li>
                        <span className="font-semibold text-red-600">
                          • Hathorian Hearth
                        </span>{" "}
                        — Volcanic Flaming Grill
                      </li>
                      <li>
                        <span className="font-semibold text-amber-600">
                          • Sapiro Hall
                        </span>{" "}
                        — Earth Braised Roasts
                      </li>
                      <li>
                        <span className="font-semibold text-sky-600">
                          • Adamya Lagoon
                        </span>{" "}
                        — Coastal Seafood Catch
                      </li>
                    </ul>
                  </div>

                  {/* Col 3: Quick Navigation */}
                  <div className="space-y-2 text-xs">
                    <p className="text-foreground font-bold tracking-wider uppercase">
                      Quick Access
                    </p>
                    <ul className="text-muted-foreground space-y-1.5">
                      <li>
                        <Link href="/menu" className="hover:text-foreground">
                          Elemental Digital Menu
                        </Link>
                      </li>
                      <li>
                        <Link href="/reserve" className="hover:text-foreground">
                          Table Reservation & Floorplan
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/kds"
                          className="hover:text-foreground"
                        >
                          Kitchen Display System (KDS)
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/inventory"
                          className="hover:text-foreground"
                        >
                          Real-time Pantry Inventory
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/staff"
                          className="hover:text-foreground"
                        >
                          Staff Shift Roster
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Col 4: Service Hours */}
                  <div className="space-y-2 text-xs">
                    <p className="text-foreground font-bold tracking-wider uppercase">
                      Royal Service
                    </p>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span>Mon - Sun: 10:00 AM - 11:00 PM</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>Encrypted Digital Checkout (GCash/Maya/Card)</span>
                    </div>
                    <p className="text-muted-foreground pt-2 text-[11px]">
                      Hotline: +63 (02) 8888-AVISALA
                    </p>
                  </div>
                </div>

                <div className="border-border/50 text-muted-foreground mt-8 flex flex-col items-center justify-between border-t pt-6 text-xs sm:flex-row">
                  <p>
                    © 2026 Avisala Restaurant. Built on T3 Stack & shadcn/ui.
                  </p>
                  <p className="mt-2 flex items-center gap-1 sm:mt-0">
                    Crafted with pride for Encantadia culinary seekers.
                  </p>
                </div>
              </div>
            </footer>
          </CartProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
