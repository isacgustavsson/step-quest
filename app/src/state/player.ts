import { atom } from "jotai";
import { persistedAtom } from "./save";

const LEVEL_THRESHOLDS = [0, 25, 100, 300, 600, 1000];

export const playerXpAtom = persistedAtom("xp", 0);

export const playerLevelAtom = atom((get) => calculateLevel(get(playerXpAtom)));

export const addXpAtom = atom(null, (get, set, amount: number) => {
  set(playerXpAtom, get(playerXpAtom) + amount);
});

const calculateLevel = (xp: number): number => {
  let level = 0;

  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold) level++;
  }

  return level - 1;
};
