import { atom } from "jotai";
import { persistedAtom } from "./save";

// xp som krävs för nivåerna 0–5. Efter det växer steget mellan nivåerna
// med LEVEL_GROWTH, så att det alltid finns en nivå till
const LEVEL_THRESHOLDS = [0, 25, 100, 300, 600, 1000];
const LEVEL_GROWTH = 1.5;

// xp som krävs för att nå level
export const xpForLevel = (level: number): number => {
  if (level < LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[level];

  let threshold = LEVEL_THRESHOLDS.at(-1)!;
  let gap = threshold - LEVEL_THRESHOLDS.at(-2)!;
  for (let l = LEVEL_THRESHOLDS.length; l <= level; l++) {
    // avrundat till jämna 50
    gap = Math.round((gap * LEVEL_GROWTH) / 50) * 50;
    threshold += gap;
  }
  return threshold;
};

export const playerXpAtom = persistedAtom("xp", 0);

export const playerLevelAtom = atom((get) => calculateLevel(get(playerXpAtom)));

export const addXpAtom = atom(null, (get, set, amount: number) => {
  set(playerXpAtom, get(playerXpAtom) + amount);
});

const calculateLevel = (xp: number): number => {
  let level = 0;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
};
