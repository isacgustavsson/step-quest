import type { GatherRecipe } from "@/data/gathering";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { addXpAtom } from "./player";
import { withdrawAtom } from "./stepbank";

export const RESOURCES_KEY = "resources:all";

export const resourcesAtom = atom<Record<string, number>>({
  wood: 0,
  stone: 0,
});

export const gatherAtom = atom(
  null,
  (get, set, recipe: GatherRecipe): GatherResult => {
    const result = set(withdrawAtom, recipe.stepCost);

    if (!result.ok) {
      return { ok: false, reason: result.reason };
    }

    const current = get(resourcesAtom);
    const next = {
      ...current,
      [recipe.resourceKey]: (current[recipe.resourceKey] ?? 0) + recipe.gain,
    };

    set(resourcesAtom, next);
    AsyncStorage.setItem(RESOURCES_KEY, JSON.stringify(next));
    set(addXpAtom, recipe.xpYield);

    return {
      ok: true,
      cost: recipe.stepCost,
      gain: recipe.gain,
      xp: recipe.xpYield,
    };
  },
);

export type GatherResult =
  | { ok: false; reason: string }
  | { ok: true; cost: number; gain: number; xp: number };
