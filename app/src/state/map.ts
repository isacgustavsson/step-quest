import { Point, START_POSITION } from "@/map/tilemap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

export const MAP_POSITION_KEY = "map:position";

export const playerPositionAtom = atom<Point>(START_POSITION);

export const movePlayerAtom = atom(null, (get, set, position: Point) => {
  set(playerPositionAtom, position);
  AsyncStorage.setItem(MAP_POSITION_KEY, JSON.stringify(position));
});
