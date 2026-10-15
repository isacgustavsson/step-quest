import { GATHER_RECIPES } from "@/data/gathering";
import {
  footTiles,
  MapObject,
  Point,
  ResourceNode,
  World,
} from "./tiled";

export { footTiles };
export type { MapObject, Point, ResourceNode };

// storleken en ruta ritas i på skärmen, oberoende av tile-storleken i Tiled.
// Samma som kartans rutor, så att grafiken ritas i 1:1 (kameran zoomar)
export const TILE_SIZE = 16;

// bilderna till kartornas tilesets, med samma filnamn som i Tiled. Metro kan
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

// en inläst karta med uppslag som byggs en gång per karta
export type GameMap = {
  id: string;
  world: World;
  width: number;
  height: number;
  nodes: ResourceNode[];
  nodesById: Map<number, ResourceNode>;
  // fotruta → objekt, så att breda objekt hittas från alla sina rutor
  nodesByTile: Map<number, ResourceNode>;
};

const tileIndex = (map: GameMap, { x, y }: Point) => y * map.width + x;

export const buildMap = (id: string, world: World): GameMap => {
  const { width, height } = world;
  const index = ({ x, y }: Point) => y * width + x;

  // objekt vars resurs saknar recept hoppas över, så att en felstavning i
  // Tiled syns i loggen i stället för att krascha
  const nodes = world.nodes.filter((node) => {
    const known = node.resource in GATHER_RECIPES;
    if (!known) console.warn(`unknown resource "${node.resource}" on ${id}`);
    return known;
  });

  // golv står inte i vägen och är därför inte med
  const nodesByTile = new Map(
    nodes
      .filter((node) => !node.floor)
      .flatMap((node) =>
        footTiles(node).map((tile) => [index(tile), node] as const),
      ),
  );

  return {
    id,
    world,
    width,
    height,
    nodes,
    nodesById: new Map(nodes.map((node) => [node.id, node])),
    nodesByTile,
  };
};

export const getNodeAt = (map: GameMap, p: Point): ResourceNode | undefined =>
  map.nodesByTile.get(tileIndex(map, p));

// objektet vars bild täcker rutan, t.ex. ett träds krona. Står flera
// objekt över varandra vinner det som ritas främst (längst ner)
export const getNodeAtTap = (
  map: GameMap,
  p: Point,
  depleted: Set<number>,
): ResourceNode | undefined => {
  const size = map.world.tileSize;
  const cx = (p.x + 0.5) * size;
  const cy = (p.y + 0.5) * size;

  let hit: ResourceNode | undefined;
  for (const node of map.nodes) {
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

const isInside = (map: GameMap, { x, y }: Point) =>
  x >= 0 && y >= 0 && x < map.width && y < map.height;

// bara marken, utan resursobjekt
export const isOpenGround = (map: GameMap, p: Point): boolean =>
  isInside(map, p) && !map.world.blocked[tileIndex(map, p)];

// ett objekt är ett hinder, utom när det är uttömt och borta från kartan
export const isWalkable = (
  map: GameMap,
  p: Point,
  depleted?: Set<number>,
): boolean => {
  if (!isOpenGround(map, p)) return false;

  const node = getNodeAt(map, p);
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
  map: GameMap,
  from: Point,
  isGoal: (p: Point) => boolean,
  depleted?: Set<number>,
): Point[] | null => {
  const key = (p: Point) => tileIndex(map, p);
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

      if (isWalkable(map, next, depleted) && !cameFrom.has(key(next))) {
        cameFrom.set(key(next), current);
        queue.push(next);
      }
    }
  }

  return null;
};

export const findPath = (
  map: GameMap,
  from: Point,
  to: Point,
  depleted?: Set<number>,
): Point[] | null => {
  if (!isWalkable(map, to, depleted)) return null;
  return bfs(map, from, (p) => p.x === to.x && p.y === to.y, depleted);
};

// vägen till närmaste ruta bredvid någon av targets, t.ex. foten på ett
// träd som inte går att stå på. Tom väg om spelaren redan står bredvid
export const findPathToAdjacent = (
  map: GameMap,
  from: Point,
  targets: Point[],
  depleted?: Set<number>,
): Point[] | null =>
  bfs(map, from, (p) => targets.some((t) => isAdjacent(p, t)), depleted);
