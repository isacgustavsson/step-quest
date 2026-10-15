import type { CraftRecipe, ItemId, ResourceId } from "@/data/types";
import { atom } from "jotai";
import { addXpAtom } from "./player";
import { resourcesAtom } from "./resources";
import { persistedAtom } from "./save";

export type CraftResult =
  | { ok: false; reason: string }
  | { ok: true; xp: number; cost: Record<ResourceId, number>; amount: number };

// föremålets id → antal. Ikon och namn slås upp i data/items.ts
export const inventoryAtom = persistedAtom<Record<ItemId, number>>(
  "inventory",
  {},
);

export const craftAtom = atom(
  null,
  (get, set, recipe: CraftRecipe, times: number = 1): CraftResult => {
    const resources = get(resourcesAtom);

    const hasEnoughResources = Object.entries(recipe.cost).every(
      ([key, amount]) => (resources[key] ?? 0) >= amount * times,
    );

    if (!hasEnoughResources) {
      return { ok: false, reason: "Not enough resources.." };
    }

    const nextResources = { ...resources };
    const totalCost: Record<ResourceId, number> = {};

    for (const [key, amount] of Object.entries(recipe.cost)) {
      const spent = amount * times;
      nextResources[key] = (nextResources[key] ?? 0) - spent;
      totalCost[key] = spent;
    }

    set(resourcesAtom, nextResources);

    const inventory = get(inventoryAtom);
    set(inventoryAtom, {
      ...inventory,
      [recipe.item]: (inventory[recipe.item] ?? 0) + times,
    });

    const totalXp = recipe.xpYield * times;
    set(addXpAtom, totalXp);

    return { ok: true, xp: totalXp, cost: totalCost, amount: times };
  },
);
