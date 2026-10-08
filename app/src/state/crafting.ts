import { Recipe } from "@/components/actionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageSource } from "expo-image";
import { atom } from "jotai";
import { addXpAtom } from "./player";
import { RESOURCES_KEY, resourcesAtom } from "./resources";

export type CraftResult =
  | { ok: false; reason: string }
  | { ok: true; xp: number; cost: Record<string, number>; amount: number };

export type InventoryEntry = {
  amount: number;
  icon?: ImageSource | number;
};

export const INVENTORY_KEY = "crafting:inventory";
export const inventoryAtom = atom<Record<string, InventoryEntry>>({});

export const craftAtom = atom(
  null,
  (get, set, recipe: Recipe, times: number = 1): CraftResult => {
    const cost = recipe.cost ?? {};
    const resources = get(resourcesAtom);

    const hasEnoughResources = Object.entries(cost).every(
      ([key, amount]) => (resources[key] ?? 0) >= amount * times,
    );

    if (!hasEnoughResources) {
      return { ok: false, reason: "Not enough resources.." };
    }

    const nextResources = { ...resources };
    const totalCost: Record<string, number> = {};

    for (const [key, amount] of Object.entries(cost)) {
      const spent = amount * times;
      nextResources[key] = (nextResources[key] ?? 0) - spent;
      totalCost[key] = spent;
    }

    set(resourcesAtom, nextResources);
    AsyncStorage.setItem(RESOURCES_KEY, JSON.stringify(nextResources));

    const inventory = get(inventoryAtom);
    const existing = inventory[recipe.label];
    const nextInventory = {
      ...inventory,
      [recipe.label]: {
        amount: (existing?.amount ?? 0) + times,
        icon: recipe.icon,
      },
    };
    set(inventoryAtom, nextInventory);
    AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(nextInventory));

    const totalXp = recipe.xpYield * times;
    set(addXpAtom, totalXp);

    return { ok: true, xp: totalXp, cost: totalCost, amount: times };
  },
);
