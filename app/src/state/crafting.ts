import type { CraftRecipe, ItemId, ResourceId } from "@/data/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { addXpAtom } from "./player";
import { RESOURCES_KEY, resourcesAtom } from "./resources";

export type CraftResult =
  | { ok: false; reason: string }
  | { ok: true; xp: number; cost: Record<ResourceId, number>; amount: number };

export const INVENTORY_KEY = "crafting:inventory";
// föremålets id → antal. Ikon och namn slås upp i data/items.ts
export const inventoryAtom = atom<Record<ItemId, number>>({});

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
    AsyncStorage.setItem(RESOURCES_KEY, JSON.stringify(nextResources));

    const inventory = get(inventoryAtom);
    const nextInventory = {
      ...inventory,
      [recipe.item]: (inventory[recipe.item] ?? 0) + times,
    };
    set(inventoryAtom, nextInventory);
    AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(nextInventory));

    const totalXp = recipe.xpYield * times;
    set(addXpAtom, totalXp);

    return { ok: true, xp: totalXp, cost: totalCost, amount: times };
  },
);
