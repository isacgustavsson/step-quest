import { Recipe } from "@/components/actionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { addXpAtom } from "./player";
import { withdrawAtom } from "./stepbank";

export const RESOURCES_KEY = "resources:all";

export const resourcesAtom = atom<Record<string, number>>({
  wood: 0,
  stone: 0,
});

const COST = 10;
const GAIN = 2;

export const gatherAtom = atom(
  null,
  (get, set, recipe: Recipe, times: number = 1): GatherResult => {
    const totalCost = COST * times;
    const result = set(withdrawAtom, totalCost);

    if (!result.ok) {
      return { ok: false, reason: result.reason };
    }

    const key = recipe.resourceKey ?? recipe.label;
    const totalGain = GAIN * times;

    const current = get(resourcesAtom);
    const next = { ...current, [key]: (current[key] ?? 0) + totalGain };

    set(resourcesAtom, next);
    AsyncStorage.setItem(RESOURCES_KEY, JSON.stringify(next));
    set(addXpAtom, recipe.xpYield * times);

    return { ok: true, cost: totalCost, gain: totalGain, xp: recipe.xpYield };
  },
);

export type GatherResult =
  | { ok: false; reason: string }
  | { ok: true; cost: number; gain: number; xp: number };
