// läser kartor sparade som JSON från Tiled (mapeditor.org)

export type Point = { x: number; y: number };

type TiledProperty = { name: string; type: string; value: unknown };

type TiledObject = {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  // finns bara på tile-objekt
  gid?: number;
  properties?: TiledProperty[];
};

type TiledLayer =
  | { type: "tilelayer"; name: string; data: number[] }
  | { type: "objectgroup"; name: string; objects: TiledObject[] }
  | { type: string; name: string };

type TiledTile = {
  id: number;
  properties?: TiledProperty[];
  // finns i collection-tilesets, där varje tile har en egen bild eller en
  // egen rektangel ur en bild
  image?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  imagewidth?: number;
  imageheight?: number;
};

type TiledTileset = {
  firstgid: number;
  // saknas i collection-tilesets
  image?: string;
  columns: number;
  tilewidth: number;
  tileheight: number;
  tiles?: TiledTile[];
};

type TiledMap = {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledLayer[];
  tilesets: TiledTileset[];
};

// en tile i ett av kartans tilesets
export type TileRef = { tileset: number; tile: number };

// en rektangel ur en bild, med bildens filnamn som i Tiled
export type Sprite = {
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Tileset = {
  // filnamnet som i Tiled, används för att hitta bilden. Saknas i
  // collection-tilesets, där varje tile i stället finns i sprites
  image?: string;
  columns: number;
  tileWidth: number;
  tileHeight: number;
  sprites: Record<number, Sprite>;
};

// var en tile finns i sin bild
export const tileSprite = (tileset: Tileset, tile: number): Sprite =>
  tileset.sprites[tile] ?? {
    image: tileset.image ?? "",
    x: (tile % tileset.columns) * tileset.tileWidth,
    y: Math.floor(tile / tileset.columns) * tileset.tileHeight,
    width: tileset.tileWidth,
    height: tileset.tileHeight,
  };

// en tile som ritas på en viss plats, i kartpixlar som i Tiled. Positionen
// är nedre vänstra hörnet, så att större tiles växer uppåt
export type PlacedTile = TileRef & {
  px: number;
  py: number;
  width: number;
  height: number;
};

// ett tile-objekt från ett objektlager. Bara foten, den nedersta raden
// rutor, är ett hinder; resten av bilden går att gå bakom
export type MapObject = PlacedTile &
  Point & {
    id: number;
    // fotens bredd i rutor, från (x, y) och åt höger
    footWidth: number;
    // golv, t.ex. en plattform: ritas alltid under spelaren och blockerar inte
    floor: boolean;
  };

// ett objekt på kartan som går att samla resurser från
export type ResourceNode = MapObject & { resource: string };

export type World = {
  width: number;
  height: number;
  // kartans tilestorlek i Tiled (rutorna är kvadratiska)
  tileSize: number;
  tilesets: Tileset[];
  // ett lager per tile-lager i Tiled, med en tile per ruta (null = tom)
  layers: (TileRef | null)[][];
  nodes: ResourceNode[];
  // stora träd, hus m.m. som djupsorteras med spelaren
  props: MapObject[];
  blocked: boolean[];
  spawn: Point;
};

// bara filnamnet; Tiled sparar sökvägen relativt kartfilen
const fileName = (path: string) => path.split("/").pop() ?? path;

const toTileset = (tileset: TiledTileset): Tileset => {
  const sprites: Record<number, Sprite> = {};

  for (const tile of tileset.tiles ?? []) {
    if (!tile.image) continue;
    sprites[tile.id] = {
      image: fileName(tile.image),
      x: tile.x ?? 0,
      y: tile.y ?? 0,
      width: tile.width ?? tile.imagewidth ?? tileset.tilewidth,
      height: tile.height ?? tile.imageheight ?? tileset.tileheight,
    };
  }

  return {
    image: tileset.image && fileName(tileset.image),
    columns: tileset.columns,
    tileWidth: tileset.tilewidth,
    tileHeight: tileset.tileheight,
    sprites,
  };
};

// Tiled sparar spegling/rotation i de översta bitarna av varje gid
const GID_MASK = 0x1fffffff;

const RESOURCE_LAYER = "resources";
const PROPS_LAYER = "props";

// rutorna som ett objekts fot står på
export const footTiles = (object: MapObject): Point[] =>
  Array.from({ length: object.footWidth }, (_, i) => ({
    x: object.x + i,
    y: object.y,
  }));

const getProperty = (properties: TiledProperty[] | undefined, name: string) =>
  properties?.find((p) => p.name === name)?.value;

export const loadTiledMap = (json: unknown): World => {
  const map = json as TiledMap;

  // tilesets i fallande firstgid, så att första träffen är rätt tileset
  const byFirstGid = map.tilesets
    .map((tileset, index) => ({ index, firstgid: tileset.firstgid }))
    .sort((a, b) => b.firstgid - a.firstgid);

  const toTileRef = (gid: number): TileRef | null => {
    const id = gid & GID_MASK;
    if (id === 0) return null;

    const match = byFirstGid.find((tileset) => tileset.firstgid <= id);
    return match ? { tileset: match.index, tile: id - match.firstgid } : null;
  };

  const blockedTiles = map.tilesets.map(
    (tileset) =>
      new Set(
        (tileset.tiles ?? [])
          .filter((tile) => getProperty(tile.properties, "blocked") === true)
          .map((tile) => tile.id),
      ),
  );

  const isBlockedTile = (ref: TileRef | null) =>
    ref !== null && blockedTiles[ref.tileset].has(ref.tile);

  const tileProperties = (ref: TileRef) =>
    map.tilesets[ref.tileset].tiles?.find((tile) => tile.id === ref.tile)
      ?.properties;

  const layers = map.layers
    .filter((layer) => layer.type === "tilelayer")
    .map((layer) => (layer as { data: number[] }).data.map(toTileRef));

  const objectsIn = (layer: TiledLayer) =>
    layer.type === "objectgroup" && "objects" in layer ? layer.objects : [];

  const objectsInLayer = (name: string) =>
    map.layers.filter((layer) => layer.name === name).flatMap(objectsIn);

  const toMapObject = (object: TiledObject): MapObject | null => {
    const ref = object.gid ? toTileRef(object.gid) : null;
    if (!ref) {
      console.warn(
        `object ${object.id} in "${PROPS_LAYER}"/"${RESOURCE_LAYER}" needs a tile`,
      );
      return null;
    }

    // fotens bredd kan sättas med property footWidth på objektet eller på
    // tilen, t.ex. 1 för ett träd vars krona är mycket bredare än stammen
    const footProperty =
      getProperty(object.properties, "footWidth") ??
      getProperty(tileProperties(ref), "footWidth");
    const footWidth =
      typeof footProperty === "number"
        ? Math.max(1, footProperty)
        : Math.max(1, Math.round(object.width / map.tilewidth));

    // bool-property floor, också på objektet eller på tilen
    const floor =
      (getProperty(object.properties, "floor") ??
        getProperty(tileProperties(ref), "floor")) === true;

    // tile-objekt har sin position i nedre vänstra hörnet. Foten centreras
    // under bilden, och avrundas så att den hamnar på hela rutor
    return {
      ...ref,
      id: object.id,
      px: object.x,
      py: object.y,
      width: object.width,
      height: object.height,
      x: Math.round(
        (object.x + object.width / 2) / map.tilewidth - footWidth / 2,
      ),
      y: Math.round(object.y / map.tileheight) - 1,
      footWidth,
      floor,
    };
  };

  const nodes: ResourceNode[] = [];

  for (const object of objectsInLayer(RESOURCE_LAYER)) {
    const resource = getProperty(object.properties, "resource");
    const mapObject = toMapObject(object);
    if (!mapObject) continue;

    if (typeof resource !== "string") {
      console.warn(`resource object ${object.id} needs a "resource" property`);
      continue;
    }

    nodes.push({ ...mapObject, resource });
  }

  const props = objectsInLayer(PROPS_LAYER)
    .map(toMapObject)
    .filter((object) => object !== null);

  const blocked = Array.from({ length: map.width * map.height }, (_, i) =>
    layers.some((layer) => isBlockedTile(layer[i])),
  );

  // props står alltid kvar, så deras fötter är vanliga hinder, utom golv.
  // Resursobjekt blockerar bara medan de syns, det sköts i tilemap.ts
  for (const prop of props) {
    if (prop.floor) continue;
    for (const tile of footTiles(prop)) {
      if (tile.x < map.width && tile.y >= 0 && tile.y < map.height) {
        blocked[tile.y * map.width + tile.x] = true;
      }
    }
  }

  const spawnObject = map.layers
    .flatMap(objectsIn)
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
    tileSize: map.tilewidth,
    tilesets: map.tilesets.map(toTileset),
    layers,
    nodes,
    props,
    blocked,
    spawn,
  };
};
