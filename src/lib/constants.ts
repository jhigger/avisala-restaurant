export type KingdomCode = "LIREO" | "HATHORIA" | "SAPIRO" | "ADAMYA";

export type RealmTableCode =
  "LIREO_TERRACE" | "HATHORIAN_HEARTH" | "SAPIRO_HALL" | "ADAMYA_LAGOON";

export interface RealmTheme {
  name: string;
  element: string;
  description: string;
  tagline: string;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  glowClass: string;
  accentHex: string;
}

export const REALM_THEMES: Record<KingdomCode, RealmTheme> = {
  LIREO: {
    name: "Lireo",
    element: "Air & Wind",
    description:
      "Floating airy dining with emerald terraces and ethereal floral herbs.",
    tagline: "Ethereal breeze, soaring mountain fowl & herb-infused elixirs",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    borderClass: "border-emerald-500/30",
    bgClass: "bg-emerald-500/5",
    glowClass: "shadow-emerald-500/10",
    accentHex: "#10B981",
  },
  HATHORIA: {
    name: "Hathoria",
    element: "Fire & Forge",
    description:
      "Volcanic open hearth, spiced embers, and flaming iron grills.",
    tagline: "Volcanic heat, scorched skewers & rich infernal broths",
    badgeClass:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    borderClass: "border-red-500/30",
    bgClass: "bg-red-500/5",
    glowClass: "shadow-red-500/10",
    accentHex: "#EF4444",
  },
  SAPIRO: {
    name: "Sapiro",
    element: "Earth & Gold",
    description:
      "Majestic stone dining halls with hearty roasts, roots, and bullion feasts.",
    tagline: "Hearty earth roasts, golden tubers & regal banquets",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    borderClass: "border-amber-500/30",
    bgClass: "bg-amber-500/5",
    glowClass: "shadow-amber-500/10",
    accentHex: "#D97706",
  },
  ADAMYA: {
    name: "Adamya",
    element: "Water & Ocean",
    description:
      "Serene waterside dining with freshwater catch and oceanic delicacies.",
    tagline: "Sunlit river catch, coral blooms & aquatic delicacies",
    badgeClass:
      "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    borderClass: "border-cyan-500/30",
    bgClass: "bg-cyan-500/5",
    glowClass: "shadow-cyan-500/10",
    accentHex: "#0284C7",
  },
};

export const TABLE_REALM_NAMES: Record<
  RealmTableCode,
  { title: string; kingdom: KingdomCode; subtitle: string }
> = {
  LIREO_TERRACE: {
    title: "Council Hall of Lireo",
    kingdom: "LIREO",
    subtitle: "Panoramic terrace views with gentle herbal aromas",
  },
  HATHORIAN_HEARTH: {
    title: "Hathorian Fire Hearth",
    kingdom: "HATHORIA",
    subtitle: "Warm, open-concept flaming stone grill atmosphere",
  },
  SAPIRO_HALL: {
    title: "Sapiro Great Banquet",
    kingdom: "SAPIRO",
    subtitle: "Stately carved stone tables for regal, hearty feasts",
  },
  ADAMYA_LAGOON: {
    title: "Adamyan Waterside Nook",
    kingdom: "ADAMYA",
    subtitle: "Serene botanical tables over sunlit lagoon ripples",
  },
};

export function getRealmTheme(kingdom: string): RealmTheme {
  const normalized = kingdom.toUpperCase();
  if (normalized in REALM_THEMES) {
    return REALM_THEMES[normalized as KingdomCode];
  }
  return {
    name: kingdom,
    element: "Encantadia",
    description: "Enchanted realm recipe",
    tagline: "Enchanted dining experience",
    badgeClass: "bg-muted text-foreground border-border",
    borderClass: "border-border",
    bgClass: "bg-muted/10",
    glowClass: "shadow-none",
    accentHex: "#6B7280",
  };
}
