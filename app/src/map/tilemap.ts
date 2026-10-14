import { colors } from "@/styles/main";

export const TILE_SIZE = 32;

export type Tile = "grass" | "path" | "water" | "stone" | "tree";

export type Point = { x: number; y: number };

const TILE_CHARS: Record<string, Tile> = {
  ".": "grass",
  "=": "path",
  "~": "water",
  "#": "stone",
  T: "tree",
};

// ett tecken per ruta, se TILE_CHARS
const MAP_ROWS = [
  "TTTTTTTTTTTTTTTTTTTTTTTT",
  "T......TT.........~~~~TT",
  "T..==........T....~~~~~T",
  "T...=....#.......~~~~~~T",
  "T...=...###.......~~~~.T",
  "T...=....#..T.....=....T",
  "T...======........=..T.T",
  "T.TT.....=........=....T",
  "T.TT.....=....~~~~=~~..T",
  "T.......#=....~~~~=~~..T",
  "T.......#=........=....T",
  "T....T...=====.====....T",
  "T.............=........T",
  "T..~~~........=...TT...T",
  "T.~~~~~.......=...TT...T",
  "T.~~~~~...##..=........T",
  "T..~~~....##..=====....T",
  "T..............T..=....T",
  "T....TT...........=..#.T",
  "T....TT....#......=..#.T",
  "T..........#......=....T",
  "T.......T.........=....T",
  "T......................T",
  "TTTTTTTTTTTTTTTTTTTTTTTT",
];

export const MAP: Tile[][] = MAP_ROWS.map((row) =>
  [...row].map((char) => TILE_CHARS[char]),
);

export const MAP_WIDTH = MAP[0].length;
export const MAP_HEIGHT = MAP.length;

export const START_POSITION: Point = { x: 4, y: 3 };

export const TILE_COLORS: Record<Tile, string> = {
  grass: "#4d6b3a",
  path: colors.wood,
  water: "#3b5f7d",
  stone: colors.stone,
  tree: "#2c4425",
};

const BLOCKING: Tile[] = ["water", "stone", "tree"];

export const isWalkable = ({ x, y }: Point): boolean => {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return false;
  return !BLOCKING.includes(MAP[y][x]);
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

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.x === to.x && current.y === to.y) {
      const path: Point[] = [];
      let step: Point | null = current;

      while (step && key(step) !== key(from)) {
        path.unshift(step);
        step = cameFrom.get(key(step)) ?? null;
      }

      return path;
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
