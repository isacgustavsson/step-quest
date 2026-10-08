// hooks/usePlayerTracking.ts
import { PLAYER_XP_KEY, playerXpAtom } from "@/state/player";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export const usePlayerTracking = () => {
  const setXp = useSetAtom(playerXpAtom);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(PLAYER_XP_KEY);
      setXp(stored ? Number(stored) : 0);
    };

    load();
  }, [setXp]);
};
