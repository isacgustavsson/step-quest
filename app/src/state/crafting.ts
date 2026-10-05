import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { addXpAtom } from "./player";
import { RESOURCES_KEY, resourcesAtom } from "./resources";

export type CraftResult =
  | { ok: false; reason: string }
  | { ok: true; xp: number };

export const INVENTORY_KEY = "crafting:inventory";
export const inventoryAtom = atom<Record<string, number>>({});

export const craftAtom = atom(
  null,
  (
    get,
    set,
    itemLabel: string,
    cost: { wood?: number; stone?: number },
    xpYield: number,
  ): CraftResult => {
    const resources = get(resourcesAtom);

    const hasEnough =
      (resources.wood ?? 0) >= (cost.wood ?? 0) &&
      (resources.stone ?? 0) >= (cost.stone ?? 0);

    if (!hasEnough) {
      return { ok: false, reason: "Inte tillräckligt med resurser" };
    }

    const nextResources = {
      ...resources,
      wood: resources.wood - (cost.wood ?? 0),
      stone: resources.stone - (cost.stone ?? 0),
    };
    set(resourcesAtom, nextResources);
    AsyncStorage.setItem(RESOURCES_KEY, JSON.stringify(nextResources));

    const inventory = get(inventoryAtom);
    const nextInventory = {
      ...inventory,
      [itemLabel]: (inventory[itemLabel] ?? 0) + 1,
    };
    set(inventoryAtom, nextInventory);
    AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(nextInventory));

    set(addXpAtom, xpYield);

    return { ok: true, xp: xpYield };
  },
);
