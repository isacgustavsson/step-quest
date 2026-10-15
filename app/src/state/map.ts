import { DEFAULT_MAP_ID, findMap, getMap } from "@/map/maps";
import { isOpenGround, Point } from "@/map/tilemap";
import { atom } from "jotai";
import { persistedAtom } from "./save";

export type MapPosition = Point & { mapId: string };

const spawnOn = (mapId: string): MapPosition => {
  const map = getMap(mapId);
  return { mapId: map.id, ...map.world.spawn };
};

// en sparad position kan peka på en karta som inte finns längre, eller en
// ruta som har blivit ett hinder. Resursobjekt räknas inte, eftersom
// spelaren kan stå där ett uttömt objekt stod
const restorePosition = (stored: unknown): MapPosition => {
  const position = stored as Partial<MapPosition>;
  const map = position.mapId ? findMap(position.mapId) : undefined;

  if (
    !map ||
    typeof position.x !== "number" ||
    typeof position.y !== "number" ||
    !isOpenGround(map, { x: position.x, y: position.y })
  ) {
    return spawnOn(map?.id ?? DEFAULT_MAP_ID);
  }

  return { mapId: map.id, x: position.x, y: position.y };
};

export const playerPositionAtom = persistedAtom<MapPosition>(
  "position",
  spawnOn(DEFAULT_MAP_ID),
  restorePosition,
);

export const currentMapAtom = atom((get) =>
  getMap(get(playerPositionAtom).mapId),
);

// flyttar spelaren inom kartan den står på
export const movePlayerAtom = atom(null, (get, set, position: Point) => {
  set(playerPositionAtom, {
    mapId: get(playerPositionAtom).mapId,
    x: position.x,
    y: position.y,
  });
});

// byter karta, t.ex. genom en dörr. Utan position hamnar spelaren på
// kartans spawn
export const enterMapAtom = atom(
  null,
  (get, set, mapId: string, position?: Point) => {
    set(
      playerPositionAtom,
      position ? { mapId, ...position } : spawnOn(mapId),
    );
  },
);
