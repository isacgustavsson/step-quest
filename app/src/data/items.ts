import type { Item, ItemId } from "./types";

const items: Item[] = [
  {
    id: "stone_spade",
    label: "stone spade",
    description: "A flat stone lashed to a stick. Good for digging.",
    icon: require("@assets/icons/stoneSpade.png"),
  },
  {
    id: "stone_axe",
    label: "stone axe",
    description: "A crude axe for chopping wood.",
    icon: require("@assets/icons/stone_axe.png"),
  },
  {
    id: "stone_pickaxe",
    label: "stone pickaxe",
    description: "A simple pickaxe for breaking rocks.",
    icon: require("@assets/icons/stone_pickaxe.png"),
  },
  {
    id: "copper_dagger",
    label: "copper dagger",
    description: "A short blade. Dull, but it shines.",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/stone_axe.png"),
  },
  {
    id: "iron_helmet",
    label: "iron helmet",
    description: "Heavy, hot and very protective.",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/woodenShield.png"),
  },
  {
    id: "bronze_sword",
    label: "bronze sword",
    description: "Copper and tin, forged into something sharp.",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/stone_pickaxe.png"),
  },
  {
    id: "campfire",
    label: "campfire",
    description: "Warmth for cold nights.",
    icon: require("@assets/icons/fire.png"),
  },
  {
    id: "wood_skull",
    label: "wood skull",
    description: "A carved skull. Spooky, but useless.",
    icon: require("@assets/icons/woodenSkull.png"),
  },
  {
    id: "wood_shield",
    label: "wood shield",
    description: "A sturdy shield reinforced with stone.",
    icon: require("@assets/icons/woodenShield.png"),
  },
  {
    id: "willow_bow",
    label: "willow bow",
    description: "Bends without breaking. Mostly.",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/wood.png"),
  },
  {
    id: "maple_chest",
    label: "maple chest",
    description: "A sturdy box with copper hinges.",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/chest.png"),
  },
  {
    id: "oak_staff",
    label: "oak staff",
    description: "A tall staff, hardened over coal.",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/oak_log.png"),
  },
];

export const ITEMS: Record<ItemId, Item> = Object.fromEntries(
  items.map((item) => [item.id, item]),
);
