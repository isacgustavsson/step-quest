import { buildMap, GameMap } from "./tilemap";
import { loadTiledMap } from "./tiled";

// alla kartor i spelet. Id:t sparas i sparfilen, så det får inte ändras.
// Varje karta ritas i Tiled, se README. require ligger i en funktion så
// att en karta läses in först när spelaren kommer dit
const MAP_SOURCES: Record<string, () => unknown> = {
  overworld: () => require("@assets/maps/world-cainos.json"),
};

export const DEFAULT_MAP_ID = "overworld";

const loaded = new Map<string, GameMap>();

// kartan med id, eller undefined om den inte finns (t.ex. borttagen
// sedan positionen sparades)
export const findMap = (id: string): GameMap | undefined => {
  const cached = loaded.get(id);
  if (cached) return cached;

  const source = MAP_SOURCES[id];
  if (!source) return undefined;

  const map = buildMap(id, loadTiledMap(source()));
  loaded.set(id, map);
  return map;
};

export const getMap = (id: string): GameMap =>
  findMap(id) ?? findMap(DEFAULT_MAP_ID)!;
