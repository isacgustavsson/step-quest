import { GATHER_RECIPES } from "@/data/gathering";
import {
  footTiles,
  loadTiledMap,
  MapObject,
  Point,
  ResourceNode,
} from "./tiled";

export { footTiles };
export type { MapObject, Point, ResourceNode };

// storleken en ruta ritas i på skärmen, oberoende av tile-storleken i Tiled.
// Samma som kartans rutor, så att grafiken ritas i 1:1 (kameran zoomar)
export const TILE_SIZE = 16;

// rita om kartan i Tiled, se README. world.json är den gamla kartan med
// Kenney Tiny Town, world-cainos.json den nya med Cainos-grafik
export const WORLD = loadTiledMap(require("@assets/maps/world-cainos.json"));

// bilderna till kartans tilesets, med samma filnamn som i Tiled. Metro kan
// bara läsa in filer med fasta sökvägar, så ett nytt tileset läggs till här
const TILESET_IMAGES: Record<string, number> = {
  "tileset.png": require("@assets/maps/tileset.png"),
  "cainos-grass.png": require("@assets/maps/cainos-grass.png"),
  "cainos-plant.png": require("@assets/maps/cainos-plant.png"),
  "cainos-props.png": require("@assets/maps/cainos-props.png"),
};

export const getTilesetImage = (image: string) => {
  const source = TILESET_IMAGES[image];
  if (!source) console.warn(`tileset image ${image} missing in TILESET_IMAGES`);
  return source;
};

export const MAP_WIDTH = WORLD.width;
export const MAP_HEIGHT = WORLD.height;

export const START_POSITION: Point = WORLD.spawn;

// objekt vars resurs saknar recept hoppas över, så att en felstavning i
// Tiled syns i loggen i stället för att krascha
export const RESOURCE_NODES = WORLD.nodes.filter((node) => {
  const known = node.resource in GATHER_RECIPES;
  if (!known) console.warn(`unknown resource "${node.resource}" on map`);
  return known;
});

// varje fotruta pekar på sitt objekt, så att breda objekt hittas från alla.
// Golv står inte i vägen och är därför inte med
const nodesByTile = new Map(
  RESOURCE_NODES.filter((node) => !node.floor).flatMap((node) =>
    footTiles(node).map((tile) => [tile.y * MAP_WIDTH + tile.x, node] as const),
  ),
);

export const getNodeAt = ({ x, y }: Point): ResourceNode | undefined =>
  nodesByTile.get(y * MAP_WIDTH + x);

// objektet vars bild täcker rutan, t.ex. ett träds krona. Står flera
// objekt över varandra vinner det som ritas främst (längst ner)
export const getNodeAtTap = (
  { x, y }: Point,
  depleted: Set<number>,
): ResourceNode | undefined => {
  const size = WORLD.tileSize;
  const cx = (x + 0.5) * size;
  const cy = (y + 0.5) * size;

  let hit: ResourceNode | undefined;
  for (const node of RESOURCE_NODES) {
    if (depleted.has(node.id)) continue;

    const covers =
      cx >= node.px &&
      cx < node.px + node.width &&
      cy >= node.py - node.height &&
      cy < node.py;

    if (covers && (!hit || node.y > hit.y)) hit = node;
  }

  return hit;
};

// bara marken, utan resursobjekt
export const isOpenGround = ({ x, y }: Point): boolean => {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return false;
  return !WORLD.blocked[y * MAP_WIDTH + x];
};

// ett objekt är ett hinder, utom när det är uttömt och borta från kartan
export const isWalkable = (p: Point, depleted?: Set<number>): boolean => {
  if (!isOpenGround(p)) return false;

  const node = getNodeAt(p);
  return !node || (depleted?.has(node.id) ?? false);
};

const DIRECTIONS: Point[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

const isAdjacent = (a: Point, b: Point) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;

// bredden-först-sökning till första rutan som uppfyller isGoal. Ger
// kortaste vägen utan startrutan, eller null om ingen sådan ruta nås
const bfs = (
  from: Point,
  isGoal: (p: Point) => boolean,
  depleted?: Set<number>,
): Point[] | null => {
  const key = (p: Point) => p.y * MAP_WIDTH + p.x;
  const cameFrom = new Map<number, Point | null>([[key(from), null]]);
  const queue: Point[] = [from];

  // läser med ett index i stället för queue.shift(), som flyttar om hela
  // arrayen och blir långsamt på stora kartor
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];

    if (isGoal(current)) {
      const path: Point[] = [];
      let step: Point | null = current;

      while (step && key(step) !== key(from)) {
        path.push(step);
        step = cameFrom.get(key(step)) ?? null;
      }

      return path.reverse();
    }

    for (const dir of DIRECTIONS) {
      const next = { x: current.x + dir.x, y: current.y + dir.y };

      if (isWalkable(next, depleted) && !cameFrom.has(key(next))) {
        cameFrom.set(key(next), current);
        queue.push(next);
      }
    }
  }

  return null;
};

export const findPath = (
  from: Point,
  to: Point,
  depleted?: Set<number>,
): Point[] | null => {
  if (!isWalkable(to, depleted)) return null;
  return bfs(from, (p) => p.x === to.x && p.y === to.y, depleted);
};

// vägen till närmaste ruta bredvid någon av targets, t.ex. foten på ett
// träd som inte går att stå på. Tom väg om spelaren redan står bredvid
export const findPathToAdjacent = (
  from: Point,
  targets: Point[],
  depleted?: Set<number>,
): Point[] | null =>
  bfs(from, (p) => targets.some((t) => isAdjacent(p, t)), depleted);
