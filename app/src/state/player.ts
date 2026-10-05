import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

export const PLAYER_XP_KEY = "player:xp";
const LEVEL_THRESHOLDS = [0, 25, 100, 300, 600, 1000];

export const playerXpAtom = atom(0);

export const playerLevelAtom = atom((get) => calculateLevel(get(playerXpAtom)));

export const addXpAtom = atom(null, (get, set, amount: number) => {
  const next = get(playerXpAtom) + amount;

  set(playerXpAtom, next);
  AsyncStorage.setItem(PLAYER_XP_KEY, JSON.stringify(next));
});

const calculateLevel = (xp: number): number => {
  let level = 0;

  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold) level++;
  }

  return level - 1;
};
