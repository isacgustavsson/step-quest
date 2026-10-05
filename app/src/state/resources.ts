import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { addXpAtom } from "./player";
import { withdrawAtom } from "./stepbank";

export const RESOURCES_KEY = "resources:all";

export const resourcesAtom = atom<Resources>({ wood: 0, stone: 0 });

const COST = 10;
const GAIN = 2;

export const chopWoodAtom = atom(
  null,
  (get, set, times: number = 1, xpPerAction: number = 0): GatherResult => {
    const totalCost = COST * times;
    const result = set(withdrawAtom, totalCost);

    if (!result.ok) {
      return { ok: false, reason: result.reason };
    }

    const totalGain = GAIN * times;
    const current = get(resourcesAtom);
    const next = { ...current, wood: current.wood + totalGain };
    set(resourcesAtom, next);
    AsyncStorage.setItem(RESOURCES_KEY, JSON.stringify(next));

    const totalXp = xpPerAction * times;
    set(addXpAtom, totalXp);

    return { ok: true, cost: totalCost, gain: totalGain, xp: totalXp };
  },
);

export const mineStoneAtom = atom(
  null,
  (get, set, times: number = 1, xpPerAction: number = 0): GatherResult => {
    const totalCost = COST * times;
    const result = set(withdrawAtom, totalCost);

    if (!result.ok) {
      return { ok: false, reason: result.reason };
    }

    const totalGain = GAIN * times;
    const current = get(resourcesAtom);
    const next = { ...current, stone: current.stone + totalGain };
    set(resourcesAtom, next);
    AsyncStorage.setItem(RESOURCES_KEY, JSON.stringify(next));

    const totalXp = xpPerAction * times;
    set(addXpAtom, totalXp);

    return { ok: true, cost: totalCost, gain: totalGain, xp: totalXp };
  },
);

export type GatherResult =
  | { ok: false; reason: string }
  | { ok: true; cost: number; gain: number; xp: number };

export type Resources = {
  wood: number;
  stone: number;
};
