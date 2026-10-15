import {
  GameMap,
  getTilesetImage,
  MapObject,
  Point,
  TILE_SIZE,
} from "@/map/tilemap";
import { PlacedTile, tileSprite, World } from "@/map/tiled";
import { colors } from "@/styles/main";
import {
  Atlas,
  Canvas,
  FilterMode,
  Group,
  MipmapMode,
  Rect,
  SkImage,
  SkRect,
  Skia,
  SkRSXform,
  useImage,
} from "@shopify/react-native-skia";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Image as RNImage,
  StyleSheet,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// spelarens animationer: en rad per riktning, i samma ordning i båda
// sheeten. Raderna 1 och 3 är diagonaler, som inte behövs när spelaren
// bara går i fyra riktningar
const FRAME_SIZE = 24;
const ROW_DOWN = 0;
const ROW_SIDE = 2;
const ROW_UP = 4;

const RUN_SHEET = require("@assets/sprites/player-run.png");
const RUN_FRAME_COUNT = 6;
// springcykeln har två steg, ett steg per ruta
const PIXELS_PER_FRAME = (TILE_SIZE * 2) / RUN_FRAME_COUNT;

const IDLE_SHEET = require("@assets/sprites/player-idle.png");
const IDLE_FRAME_COUNT = 4;
const IDLE_FRAME_MS = 200;

type Facing = "down" | "up" | "left" | "right";

const facingRow = (facing: Facing) => {
  "worklet";
  return facing === "down" ? ROW_DOWN : facing === "up" ? ROW_UP : ROW_SIDE;
};

// rutan ur ett sheet. Skia läser bara pixlar inuti rutan, så kanten
// mot nästa ruta syns inte ens när kartan är inzoomad
const frameRect = (frame: number, row: number) => {
  "worklet";
  return [
    Skia.XYWHRect(frame * FRAME_SIZE, row * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE),
  ];
};

// spelarens ruta ritas i origo, Group-transformen flyttar den
const PLAYER_TRANSFORMS = [Skia.RSXform(1, 0, 0, 0)];

const TARGET_BORDER = 2;

const MIN_SCALE = 0.75;
const MAX_SCALE = 3;
const START_SCALE = 1.5;
// hur långt kartan får dras förbi kanten
const EDGE_MARGIN = 64;

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

// håller kartan inom skärmen; är kartan mindre än skärmen får den
// flyttas fritt inom skärmen i stället
const clampOffset = (offset: number, view: number, content: number) => {
  "worklet";
  const a = view - content - EDGE_MARGIN;
  const b = EDGE_MARGIN;
  return clamp(offset, Math.min(a, b), Math.max(a, b));
};

// pixelgrafiken ska förstoras utan utsmetning
const PIXEL_SAMPLING = { filter: FilterMode.Nearest, mipmap: MipmapMode.None };

// tiles ur samma bild som ritas i ett anrop. Varje tile är en bit av
// bilden (sprite) och en position på kartan (transform)
type TileBatch = {
  image: string;
  sprites: SkRect[];
  transforms: SkRSXform[];
};

// lägger tiles i batcher per bild. Med keepOrder blir det en ny batch
// varje gång bilden byts, så att ordningen behålls även mellan bilder
// (behövs för djupsorterade objekt som överlappar varandra)
const batchTiles = (
  world: World,
  tiles: PlacedTile[],
  keepOrder = false,
): TileBatch[] => {
  const batches: TileBatch[] = [];
  const byImage = new Map<string, TileBatch>();
  // kartpixlar i Tiled → pixlar på skärmen
  const mapScale = TILE_SIZE / world.tileSize;

  for (const { tileset, tile, px, py, width } of tiles) {
    const sprite = tileSprite(world.tilesets[tileset], tile);

    let batch = keepOrder ? batches.at(-1) : byImage.get(sprite.image);
    if (!batch || batch.image !== sprite.image) {
      batch = { image: sprite.image, sprites: [], transforms: [] };
      batches.push(batch);
      byImage.set(sprite.image, batch);
    }

    // ett objekt kan vara skalat i Tiled, men Atlas skalar lika i båda
    // led, så bredden får bestämma
    const scale = (width / sprite.width) * mapScale;

    batch.sprites.push(
      Skia.XYWHRect(sprite.x, sprite.y, sprite.width, sprite.height),
    );
    // förankrad i nedre vänstra hörnet, som i Tiled. Höjden räknas från
    // bilden, så att ett objekt som skalats olika i höjd och bredd ändå
    // står på sin fot
    batch.transforms.push(
      Skia.RSXform(
        scale,
        0,
        px * mapScale,
        py * mapScale - sprite.height * scale,
      ),
    );
  }

  return batches;
};

// alla tile-lager, i samma ordning som i Tiled. Tiles större än kartans
// rutor ritas uppåt från sin ruta, precis som i Tiled
const buildTiles = (world: World) =>
  world.layers.flatMap((layer) =>
    batchTiles(
      world,
      layer.flatMap((ref, i) => {
        if (!ref) return [];
        const sprite = tileSprite(world.tilesets[ref.tileset], ref.tile);
        return [
          {
            ...ref,
            px: (i % world.width) * world.tileSize,
            py: (Math.floor(i / world.width) + 1) * world.tileSize,
            width: sprite.width,
            height: sprite.height,
          },
        ];
      }),
    ),
  );

// alla bilder som kartan använder, både vanliga tilesets och tiles i
// collection-tilesets
const imageNames = (world: World) => [
  ...new Set(
    world.tilesets.flatMap((tileset) => [
      ...(tileset.image ? [tileset.image] : []),
      ...Object.values(tileset.sprites).map((sprite) => sprite.image),
    ]),
  ),
];

// laddar kartans bilder en gång, så att en batch kan byta bild utan att
// bilden laddas om
const useTilesetImages = (world: World) => {
  const [images, setImages] = useState<Record<string, SkImage | null>>({});

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      imageNames(world).map(async (name) => {
        const source = getTilesetImage(name);
        if (!source) return [name, null] as const;

        const { uri } = RNImage.resolveAssetSource(source);
        const data = await Skia.Data.fromURI(uri);
        return [name, Skia.Image.MakeImageFromEncoded(data)] as const;
      }),
    ).then((loaded) => {
      if (!cancelled) setImages(Object.fromEntries(loaded));
    });

    return () => {
      cancelled = true;
    };
  }, [world]);

  return images;
};

// en batch ritas med ett enda anrop i Skia, i stället för en vy per tile,
// vilket både laddar snabbare och tar mycket mindre minne
const TileAtlas = ({
  batch,
  images,
}: {
  batch: TileBatch;
  images: Record<string, SkImage | null>;
}) => {
  const image = images[batch.image];
  if (!image) return null;

  return (
    <Atlas
      image={image}
      sprites={batch.sprites}
      transforms={batch.transforms}
      sampling={PIXEL_SAMPLING}
      antiAlias={false}
    />
  );
};

// objekt sorterade uppifrån och ner, så att det som står längre ner
// ritas framför det som står bakom
const sortByDepth = (objects: MapObject[]) =>
  [...objects].sort((a, b) => a.y - b.y || a.x - b.x);

type TileMapProps = {
  map: GameMap;
  // spelarens position i pixlar, animeras av usePlayerWalk
  playerX: SharedValue<number>;
  playerY: SharedValue<number>;
  walking: SharedValue<boolean>;
  target: Point | null;
  // id för resursobjekt som är uttömda just nu
  depleted: Set<number>;
  onTileTap: (tile: Point) => void;
};

export const TileMap = ({
  map,
  playerX,
  playerY,
  walking,
  target,
  depleted,
  onTileTap,
}: TileMapProps) => {
  const viewWidth = useSharedValue(0);
  const viewHeight = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(START_SCALE);

  const centered = useRef(false);

  // bara tal används i gesterna, så att inte hela kartan kopieras till
  // UI-tråden
  const { world, width: mapWidth, height: mapHeight } = map;
  const mapPixelWidth = mapWidth * TILE_SIZE;
  const mapPixelHeight = mapHeight * TILE_SIZE;

  const images = useTilesetImages(world);
  const tiles = useMemo(() => buildTiles(world), [world]);

  // raden spelaren står på. Skickas till JS bara när raden byts, så att
  // objekten kan delas upp i de som står bakom och framför spelaren
  const [playerRow, setPlayerRow] = useState(() =>
    Math.round(playerY.get() / TILE_SIZE),
  );

  useAnimatedReaction(
    () => Math.round(playerY.get() / TILE_SIZE),
    (row, previous) => {
      if (row !== previous) scheduleOnRN(setPlayerRow, row);
    },
  );

  // uttömda objekt ritas inte förrän de växer tillbaka
  const visibleObjects = useMemo(
    () =>
      sortByDepth([
        ...world.props,
        ...map.nodes.filter((node) => !depleted.has(node.id)),
      ]),
    [world, map.nodes, depleted],
  );

  // golv ritas under spelaren och alla andra objekt, oavsett rad
  const floors = useMemo(
    () =>
      batchTiles(
        world,
        visibleObjects.filter((o) => o.floor),
        true,
      ),
    [world, visibleObjects],
  );

  // objekt vars fot står under spelarens rad ritas över spelaren, resten under
  const objects = useMemo(() => {
    const visible = visibleObjects.filter((o) => !o.floor);

    return {
      behind: batchTiles(
        world,
        visible.filter((o) => o.y <= playerRow),
        true,
      ),
      front: batchTiles(
        world,
        visible.filter((o) => o.y > playerRow),
        true,
      ),
    };
  }, [world, visibleObjects, playerRow]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    viewWidth.set(width);
    viewHeight.set(height);

    // centrera på spelaren första gången
    if (!centered.current) {
      centered.current = true;
      offsetX.set(width / 2 - (playerX.get() + TILE_SIZE / 2) * START_SCALE);
      offsetY.set(height / 2 - (playerY.get() + TILE_SIZE / 2) * START_SCALE);
    }
  };

  // skapas bara om när onTileTap ändras, så att GestureDetector inte
  // kopplar om sina handlers vid varje render
  const gesture = useMemo(() => {
    // pan och pinch jobbar med ändringar sedan förra eventet, så att de
    // kan köras samtidigt utan att skriva över varandra
    const pan = Gesture.Pan().onChange((e) => {
      offsetX.set(
        clampOffset(
          offsetX.get() + e.changeX,
          viewWidth.get(),
          mapPixelWidth * scale.get(),
        ),
      );
      offsetY.set(
        clampOffset(
          offsetY.get() + e.changeY,
          viewHeight.get(),
          mapPixelHeight * scale.get(),
        ),
      );
    });

    const pinch = Gesture.Pinch().onChange((e) => {
      const next = clamp(scale.get() * e.scaleChange, MIN_SCALE, MAX_SCALE);
      const ratio = next / scale.get();

      // zooma kring punkten mellan fingrarna
      offsetX.set(
        clampOffset(
          e.focalX - (e.focalX - offsetX.get()) * ratio,
          viewWidth.get(),
          mapPixelWidth * next,
        ),
      );
      offsetY.set(
        clampOffset(
          e.focalY - (e.focalY - offsetY.get()) * ratio,
          viewHeight.get(),
          mapPixelHeight * next,
        ),
      );
      scale.set(next);
    });

    const tap = Gesture.Tap()
      .runOnJS(true)
      .onEnd((e, success) => {
        if (!success) return;

        // kartan skalas från övre vänstra hörnet, så omvandlingen blir enkel
        const x = Math.floor((e.x - offsetX.get()) / scale.get() / TILE_SIZE);
        const y = Math.floor((e.y - offsetY.get()) / scale.get() / TILE_SIZE);

        if (x >= 0 && y >= 0 && x < mapWidth && y < mapHeight) {
          onTileTap({ x, y });
        }
      });

    return Gesture.Race(tap, Gesture.Simultaneous(pan, pinch));
  }, [
    mapWidth,
    mapHeight,
    mapPixelWidth,
    mapPixelHeight,
    onTileTap,
    offsetX,
    offsetY,
    scale,
    viewWidth,
    viewHeight,
  ]);

  // samma förflyttning och zoom som mapStyle, fast för Skia
  const canvasTransform = useDerivedValue(() => [
    { translateX: offsetX.get() },
    { translateY: offsetY.get() },
    { scale: scale.get() },
  ]);

  const facing = useSharedValue<Facing>("down");
  // sträckan spelaren gått, styr vilken ruta i springcykeln som visas
  const distance = useSharedValue(0);
  // idle-rutan räknas fram från tiden varje bildruta, så länge kartan visas
  const idleFrame = useSharedValue(0);

  useFrameCallback(({ timeSinceFirstFrame }) => {
    const frame =
      Math.floor(timeSinceFirstFrame / IDLE_FRAME_MS) % IDLE_FRAME_COUNT;
    if (frame !== idleFrame.get()) idleFrame.set(frame);
  });

  // riktningen tas från hur positionen ändras, så den följer promenaden
  // exakt utan att usePlayerWalk behöver veta något om spriten
  useAnimatedReaction(
    () => ({ x: playerX.get(), y: playerY.get() }),
    (current, previous) => {
      if (!previous) return;
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      if (dx === 0 && dy === 0) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        facing.set(dx > 0 ? "right" : "left");
      } else {
        facing.set(dy > 0 ? "down" : "up");
      }
      distance.set(distance.get() + Math.abs(dx) + Math.abs(dy));
    },
  );

  const runSheet = useImage(RUN_SHEET);
  const idleSheet = useImage(IDLE_SHEET);

  // spelaren är större än en ruta och står med fötterna mitt på sin ruta
  const playerTransform = useDerivedValue(() => [
    { translateX: playerX.get() + TILE_SIZE / 2 },
    { translateY: playerY.get() + TILE_SIZE - FRAME_SIZE },
    // vänster är högerraden spegelvänd, kring spelarens mitt
    { scaleX: facing.get() === "left" ? -1 : 1 },
    { translateX: -FRAME_SIZE / 2 },
  ]);

  const runSprite = useDerivedValue(() =>
    frameRect(
      Math.floor(distance.get() / PIXELS_PER_FRAME) % RUN_FRAME_COUNT,
      facingRow(facing.get()),
    ),
  );
  const idleSprite = useDerivedValue(() =>
    frameRect(idleFrame.get(), facingRow(facing.get())),
  );

  // båda sheeten ritas alltid och visas växelvis
  const runOpacity = useDerivedValue(() => (walking.get() ? 1 : 0));
  const idleOpacity = useDerivedValue(() => (walking.get() ? 0 : 1));

  return (
    <GestureDetector gesture={gesture}>
      <View style={tileStyles.viewport} onLayout={handleLayout}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Group transform={canvasTransform}>
            {tiles.map((batch, i) => (
              <TileAtlas key={i} batch={batch} images={images} />
            ))}
            {floors.map((batch, i) => (
              <TileAtlas key={i} batch={batch} images={images} />
            ))}
            {objects.behind.map((batch, i) => (
              <TileAtlas key={i} batch={batch} images={images} />
            ))}

            {/* målmarkören, med kanten innanför rutan */}
            {target && (
              <Rect
                x={target.x * TILE_SIZE + TARGET_BORDER / 2}
                y={target.y * TILE_SIZE + TARGET_BORDER / 2}
                width={TILE_SIZE - TARGET_BORDER}
                height={TILE_SIZE - TARGET_BORDER}
                style="stroke"
                strokeWidth={TARGET_BORDER}
                color={colors.accent}
              />
            )}

            <Group transform={playerTransform}>
              <Atlas
                image={runSheet}
                sprites={runSprite}
                transforms={PLAYER_TRANSFORMS}
                sampling={PIXEL_SAMPLING}
                opacity={runOpacity}
              />
              <Atlas
                image={idleSheet}
                sprites={idleSprite}
                transforms={PLAYER_TRANSFORMS}
                sampling={PIXEL_SAMPLING}
                opacity={idleOpacity}
              />
            </Group>
          </Group>
        </Canvas>

        {/* objekt som står framför spelaren ritas ovanpå */}
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
          <Group transform={canvasTransform}>
            {objects.front.map((batch, i) => (
              <TileAtlas key={i} batch={batch} images={images} />
            ))}
          </Group>
        </Canvas>
      </View>
    </GestureDetector>
  );
};

const tileStyles = StyleSheet.create({
  viewport: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: colors.background,
  },
});
