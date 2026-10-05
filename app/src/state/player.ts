import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

export const PLAYER_LEVEL_KEY = "levels:player";

export const playerLevelAtom = atom(0);

export const addPlayerLevelAtom = atom(null, (get, set) => {
  const current = get(playerLevelAtom);
  const next = current + 1;
  set(playerLevelAtom, next);
  AsyncStorage.setItem(PLAYER_LEVEL_KEY, JSON.stringify(next));
});
