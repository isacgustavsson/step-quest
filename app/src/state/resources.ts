import type { GatherRecipe, ResourceId } from "@/data/types";
import { atom } from "jotai";
import { addXpAtom } from "./player";
import { persistedAtom } from "./save";
import { withdrawAtom } from "./stepbank";

export const resourcesAtom = persistedAtom<Record<ResourceId, number>>(
  "resources",
  {},
);

export const gatherAtom = atom(
  null,
  (get, set, recipe: GatherRecipe): GatherResult => {
    const result = set(withdrawAtom, recipe.stepCost);

    if (!result.ok) {
      return { ok: false, reason: result.reason };
    }

    const current = get(resourcesAtom);
    set(resourcesAtom, {
      ...current,
      [recipe.resource]: (current[recipe.resource] ?? 0) + recipe.gain,
    });
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
