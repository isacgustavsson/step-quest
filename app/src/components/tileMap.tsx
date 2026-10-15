import {
  MAP_HEIGHT,
  MAP_WIDTH,
  Point,
  TILE_SIZE,
  TILESET_IMAGE,
  WORLD,
} from "@/map/tilemap";
import { colors } from "@/styles/main";
import {
  Atlas,
  Canvas,
  FilterMode,
  Group,
  MipmapMode,
  Skia,
  useImage,
} from "@shopify/react-native-skia";
import { Image } from "expo-image";
import { useEffect, useMemo, useRef } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Easing,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// spelarens animationer: en rad per riktning, i samma ordning i båda
// sheeten. Raderna 1 och 3 är diagonaler, som inte behövs när spelaren
// bara går i fyra riktningar
const FRAME_SIZE = 32;
const ROW_DOWN = 0;
const ROW_SIDE = 2;
const ROW_UP = 4;

const RUN_SHEET = require("@assets/sprites/player-run.png");
const RUN_FRAME_COUNT = 4;
const RUN_SHEET_WIDTH = FRAME_SIZE * RUN_FRAME_COUNT;
const RUN_SHEET_HEIGHT = FRAME_SIZE * 5;
// en hel springcykel per två tiles
const PIXELS_PER_FRAME = TILE_SIZE / 3;

const IDLE_SHEET = require("@assets/sprites/player-idle.png");
const IDLE_FRAME_COUNT = 4;
const IDLE_FRAME_MS = 200;
const IDLE_SHEET_WIDTH = FRAME_SIZE * IDLE_FRAME_COUNT;
const IDLE_SHEET_HEIGHT = FRAME_SIZE * 6;

type Facing = "down" | "up" | "left" | "right";

const facingRow = (facing: Facing) => {
  "worklet";
  return facing === "down" ? ROW_DOWN : facing === "up" ? ROW_UP : ROW_SIDE;
};

// flyttar ett sheet så att rätt ruta hamnar i spelarvyns urklipp
const frameTransform = (frame: number, row: number) => {
  "worklet";
  return [
    { translateX: -frame * FRAME_SIZE },
    { translateY: -row * FRAME_SIZE },
  ];
};

const MAP_PIXEL_WIDTH = MAP_WIDTH * TILE_SIZE;
const MAP_PIXEL_HEIGHT = MAP_HEIGHT * TILE_SIZE;

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

// alla tiles i alla lager, i samma ordning som i Tiled. Varje tile är en
// bit av tileset-bilden (sprite) och en position på kartan (transform)
const buildTiles = () => {
  const sprites = [];
  const transforms = [];
  const tileScale = TILE_SIZE / WORLD.tileWidth;

  for (const layer of WORLD.layers) {
    for (let i = 0; i < layer.length; i++) {
      const index = layer[i];
      if (index < 0) continue;

      sprites.push(
        Skia.XYWHRect(
          (index % WORLD.columns) * WORLD.tileWidth,
          Math.floor(index / WORLD.columns) * WORLD.tileHeight,
          WORLD.tileWidth,
          WORLD.tileHeight,
        ),
      );
      transforms.push(
        Skia.RSXform(
          tileScale,
          0,
          (i % MAP_WIDTH) * TILE_SIZE,
          Math.floor(i / MAP_WIDTH) * TILE_SIZE,
        ),
      );
    }
  }

  return { sprites, transforms };
};

type TileMapProps = {
  // spelarens position i pixlar, animeras av usePlayerWalk
  playerX: SharedValue<number>;
  playerY: SharedValue<number>;
  walking: SharedValue<boolean>;
  target: Point | null;
  onTileTap: (tile: Point) => void;
};

export const TileMap = ({
  playerX,
  playerY,
  walking,
  target,
  onTileTap,
}: TileMapProps) => {
  const viewWidth = useSharedValue(0);
  const viewHeight = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(START_SCALE);

  const centered = useRef(false);

  // hela kartan ritas med ett enda anrop i Skia, i stället för en vy per
  // tile, vilket både laddar snabbare och tar mycket mindre minne
  const tileset = useImage(TILESET_IMAGE);
  const tiles = useMemo(() => buildTiles(), []);

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
          MAP_PIXEL_WIDTH * scale.get(),
        ),
      );
      offsetY.set(
        clampOffset(
          offsetY.get() + e.changeY,
          viewHeight.get(),
          MAP_PIXEL_HEIGHT * scale.get(),
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
          MAP_PIXEL_WIDTH * next,
        ),
      );
      offsetY.set(
        clampOffset(
          e.focalY - (e.focalY - offsetY.get()) * ratio,
          viewHeight.get(),
          MAP_PIXEL_HEIGHT * next,
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

        if (x >= 0 && y >= 0 && x < MAP_WIDTH && y < MAP_HEIGHT) {
          onTileTap({ x, y });
        }
      });

    return Gesture.Race(tap, Gesture.Simultaneous(pan, pinch));
  }, [onTileTap, offsetX, offsetY, scale, viewWidth, viewHeight]);

  // samma förflyttning och zoom som mapStyle, fast för Skia
  const canvasTransform = useDerivedValue(() => [
    { translateX: offsetX.get() },
    { translateY: offsetY.get() },
    { scale: scale.get() },
  ]);

  const mapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.get() },
      { translateY: offsetY.get() },
      { scale: scale.get() },
    ],
  }));

  const facing = useSharedValue<Facing>("down");
  // sträckan spelaren gått, styr vilken ruta i springcykeln som visas
  const distance = useSharedValue(0);
  // räknar upp idle-rutorna i en loop som går så länge kartan visas
  const idleClock = useSharedValue(0);

  useEffect(() => {
    idleClock.set(
      withRepeat(
        withTiming(IDLE_FRAME_COUNT, {
          duration: IDLE_FRAME_COUNT * IDLE_FRAME_MS,
          easing: Easing.linear,
        }),
        -1,
      ),
    );
    return () => cancelAnimation(idleClock);
  }, [idleClock]);

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

  const playerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: playerX.get() },
      { translateY: playerY.get() },
      // vänster är högerraden spegelvänd
      { scaleX: facing.get() === "left" ? -1 : 1 },
    ],
  }));

  // båda sheeten ligger alltid i spelarvyn och visas växelvis, så att
  // bilden inte behöver laddas om när spelaren stannar eller börjar gå
  const runStyle = useAnimatedStyle(() => {
    const frame =
      Math.floor(distance.get() / PIXELS_PER_FRAME) % RUN_FRAME_COUNT;
    return {
      opacity: walking.get() ? 1 : 0,
      transform: frameTransform(frame, facingRow(facing.get())),
    };
  });

  const idleStyle = useAnimatedStyle(() => {
    const frame = Math.floor(idleClock.get()) % IDLE_FRAME_COUNT;
    return {
      opacity: walking.get() ? 0 : 1,
      transform: frameTransform(frame, facingRow(facing.get())),
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <View style={tileStyles.viewport} onLayout={handleLayout}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Group transform={canvasTransform}>
            <Atlas
              image={tileset}
              sprites={tiles.sprites}
              transforms={tiles.transforms}
              sampling={PIXEL_SAMPLING}
              antiAlias={false}
            />
          </Group>
        </Canvas>

        {/* spelare och målmarkör ligger ovanpå kartan med samma transform */}
        <Animated.View style={[tileStyles.map, mapStyle]} pointerEvents="none">
          {target && (
            <View
              style={[
                tileStyles.tile,
                tileStyles.target,
                { left: target.x * TILE_SIZE, top: target.y * TILE_SIZE },
              ]}
            />
          )}

          <Animated.View style={[tileStyles.player, playerStyle]}>
            <Animated.View style={[tileStyles.runSheet, runStyle]}>
              <Image source={RUN_SHEET} style={tileStyles.runSheet} />
            </Animated.View>
            <Animated.View style={[tileStyles.idleSheet, idleStyle]}>
              <Image source={IDLE_SHEET} style={tileStyles.idleSheet} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
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

  map: {
    width: MAP_PIXEL_WIDTH,
    height: MAP_PIXEL_HEIGHT,
    transformOrigin: "top left",
  },

  tile: {
    position: "absolute",
    width: TILE_SIZE,
    height: TILE_SIZE,
  },

  target: {
    borderWidth: 2,
    borderColor: colors.accent,
  },

  player: {
    position: "absolute",
    left: 0,
    top: 0,
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    overflow: "hidden",
  },

  runSheet: {
    position: "absolute",
    width: RUN_SHEET_WIDTH,
    height: RUN_SHEET_HEIGHT,
  },

  idleSheet: {
    position: "absolute",
    width: IDLE_SHEET_WIDTH,
    height: IDLE_SHEET_HEIGHT,
  },
});
