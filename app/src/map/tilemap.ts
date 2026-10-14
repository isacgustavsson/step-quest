import { loadTiledMap, Point } from "./tiled";

export type { Point };

// storleken en ruta ritas i på skärmen, oberoende av tile-storleken i Tiled
export const TILE_SIZE = 32;

// rita om kartan i Tiled, se README
export const WORLD = loadTiledMap(require("@assets/maps/world.json"));
// samma tileset som i Tiled
export const TILESET_IMAGE = require("@assets/maps/tileset.png");

export const MAP_WIDTH = WORLD.width;
export const MAP_HEIGHT = WORLD.height;

export const START_POSITION: Point = WORLD.spawn;

export const isWalkable = ({ x, y }: Point): boolean => {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return false;
  return !WORLD.blocked[y * MAP_WIDTH + x];
};

const DIRECTIONS: Point[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

// bredden-först-sökning, ger kortaste vägen utan startrutan,
// eller null om målet inte går att nå
export const findPath = (from: Point, to: Point): Point[] | null => {
  if (!isWalkable(to)) return null;

  const key = (p: Point) => p.y * MAP_WIDTH + p.x;
  const cameFrom = new Map<number, Point | null>([[key(from), null]]);
  const queue: Point[] = [from];

  // läser med ett index i stället för queue.shift(), som flyttar om hela
  // arrayen och blir långsamt på stora kartor
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];

    if (current.x === to.x && current.y === to.y) {
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

      if (isWalkable(next) && !cameFrom.has(key(next))) {
        cameFrom.set(key(next), current);
        queue.push(next);
      }
    }
  }

  return null;
};
