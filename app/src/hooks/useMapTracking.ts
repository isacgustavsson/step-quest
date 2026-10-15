// hooks/useMapTracking.ts
import { isOpenGround, Point, START_POSITION } from "@/map/tilemap";
import { MAP_POSITION_KEY, playerPositionAtom } from "@/state/map";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export const useMapTracking = () => {
  const setPosition = useSetAtom(playerPositionAtom);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(MAP_POSITION_KEY);
      const position: Point | null = stored ? JSON.parse(stored) : null;

      // kartan kan ha ändrats sedan positionen sparades. Resursobjekt
      // räknas inte, eftersom spelaren kan stå där ett uttömt objekt stod
      setPosition(
        position && isOpenGround(position) ? position : START_POSITION,
      );
    };

    load();
  }, [setPosition]);
};
