// läser kartor sparade som JSON från Tiled (mapeditor.org)

export type Point = { x: number; y: number };

type TiledProperty = { name: string; type: string; value: unknown };

type TiledLayer =
  | { type: "tilelayer"; name: string; data: number[] }
  | {
      type: "objectgroup";
      name: string;
      objects: { name: string; x: number; y: number }[];
    }
  | { type: string; name: string };

type TiledMap = {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledLayer[];
  tilesets: {
    firstgid: number;
    columns: number;
    tilecount: number;
    tiles?: { id: number; properties?: TiledProperty[] }[];
  }[];
};

export type World = {
  width: number;
  height: number;
  // ett lager per tile-lager i Tiled, med tile-index per ruta (-1 = tom)
  layers: number[][];
  blocked: boolean[];
  spawn: Point;
  // tilesetets storlek i Tiled, för att hitta en tile i bilden
  tileWidth: number;
  tileHeight: number;
  columns: number;
};

// Tiled sparar spegling/rotation i de översta bitarna av varje gid
const GID_MASK = 0x1fffffff;

export const loadTiledMap = (json: unknown): World => {
  const map = json as TiledMap;
  const tileset = map.tilesets[0];

  const blockedTiles = new Set(
    (tileset.tiles ?? [])
      .filter((tile) =>
        tile.properties?.some((p) => p.name === "blocked" && p.value === true),
      )
      .map((tile) => tile.id),
  );

  const layers = map.layers
    .filter((layer) => layer.type === "tilelayer")
    .map((layer) =>
      (layer as { data: number[] }).data.map((gid) =>
        gid === 0 ? -1 : (gid & GID_MASK) - tileset.firstgid,
      ),
    );

  const blocked = Array.from({ length: map.width * map.height }, (_, i) =>
    layers.some((layer) => blockedTiles.has(layer[i])),
  );

  const spawnObject = map.layers
    .flatMap((layer) =>
      layer.type === "objectgroup" && "objects" in layer ? layer.objects : [],
    )
    .find((object) => object.name === "spawn");

  const spawn = spawnObject
    ? {
        x: Math.floor(spawnObject.x / map.tilewidth),
        y: Math.floor(spawnObject.y / map.tileheight),
      }
    : { x: Math.floor(map.width / 2), y: Math.floor(map.height / 2) };

  return {
    width: map.width,
    height: map.height,
    layers,
    blocked,
    spawn,
    tileWidth: map.tilewidth,
    tileHeight: map.tileheight,
    columns: tileset.columns,
  };
};
