import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { withdrawAtom } from "./stepbank";

export const RESOURCES_KEY = "resources:all";

export const resourcesAtom = atom<Resources>({ wood: 0, stone: 0 });

const COST = 10;
const GAIN = 2;

export const chopWoodAtom = atom(null, (get, set): GatherResult => {
  const result = set(withdrawAtom, COST);

  if (!result.ok) {
    return { ok: false, reason: result.reason };
  }

  const current = get(resourcesAtom);
  const next = { ...current, wood: current.wood + GAIN };
  set(resourcesAtom, next);
  AsyncStorage.setItem(RESOURCES_KEY, JSON.stringify(next));

  return { ok: true, cost: COST, gain: GAIN };
});

export const mineStoneAtom = atom(null, (get, set): GatherResult => {
  const result = set(withdrawAtom, COST);

  if (!result.ok) {
    return { ok: false, reason: result.reason };
  }

  const current = get(resourcesAtom);
  const next = { ...current, stone: current.stone + GAIN };
  set(resourcesAtom, next);
  AsyncStorage.setItem(RESOURCES_KEY, JSON.stringify(next));

  return { ok: true, cost: COST, gain: GAIN };
});

export type GatherResult =
  | { ok: false; reason: string }
  | { ok: true; cost: number; gain: number };

export type Resources = {
  wood: number;
  stone: number;
};
