// hooks/usePlayerWalk.ts
import { findPath, findPathToAdjacent, Point, TILE_SIZE } from "@/map/tilemap";
import { movePlayerAtom, playerPositionAtom } from "@/state/map";
import { depletedNodesAtom } from "@/state/nodes";
import * as Haptics from "expo-haptics";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const STEP_DURATION = 140;

// ingen väg: en pågående promenad får fortsätta
const noPath = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

// hela promenaden körs som en animation på UI-tråden, så att den inte
// hackar när JS-tråden är upptagen. Positionen sparas först vid ankomst.
export const usePlayerWalk = () => {
  const position = useAtomValue(playerPositionAtom);
  const movePlayer = useSetAtom(movePlayerAtom);
  const depletedNodes = useAtomValue(depletedNodesAtom);
  // uttömda objekt går att gå över
  const depleted = useMemo(
    () => new Set(Object.keys(depletedNodes).map(Number)),
    [depletedNodes],
  );
  const [target, setTarget] = useState<Point | null>(null);

  const playerX = useSharedValue(position.x * TILE_SIZE);
  const playerY = useSharedValue(position.y * TILE_SIZE);
  // styr om spelarens springanimation spelas
  const walking = useSharedValue(false);
  // ökas för varje ny promenad, så att en gammal ankomst ignoreras
  const walkId = useRef(0);

  // atomen ändras bara vid laddning, reset och ankomst, så positionen
  // kan sättas direkt utan animation
  useEffect(() => {
    cancelAnimation(playerX);
    cancelAnimation(playerY);
    walking.set(false);
    playerX.set(position.x * TILE_SIZE);
    playerY.set(position.y * TILE_SIZE);
  }, [position, playerX, playerY, walking]);

  // anropas när spelaren kommer fram, om promenaden inte har avbrutits
  const onArrive = useRef<(() => void) | null>(null);

  const arrive = useCallback(
    (destination: Point, id: number) => {
      if (walkId.current !== id) return;

      movePlayer(destination);
      setTarget(null);

      const callback = onArrive.current;
      onArrive.current = null;
      callback?.();
    },
    [movePlayer],
  );

  // mitt i ett steg står spelaren mellan två gångbara rutor,
  // så närmaste ruta är alltid en giltig start
  const currentTile = useCallback(
    (): Point => ({
      x: Math.round(playerX.get() / TILE_SIZE),
      y: Math.round(playerY.get() / TILE_SIZE),
    }),
    [playerX, playerY],
  );

  // går längs path, och markerar marker som mål under tiden
  const walkPath = useCallback(
    (path: Point[], marker: Point, callback?: () => void) => {
      const fromX = playerX.get();
      const fromY = playerY.get();
      const start = currentTile();
      const destination = path.at(-1) ?? start;

      const id = ++walkId.current;
      onArrive.current = callback ?? null;
      Haptics.selectionAsync();
      setTarget(marker);

      // första biten tar spelaren från där den står till startrutan
      const offset =
        (Math.abs(start.x * TILE_SIZE - fromX) +
          Math.abs(start.y * TILE_SIZE - fromY)) /
        TILE_SIZE;
      const segments = [
        { tile: start, duration: offset * STEP_DURATION },
        ...path.map((tile) => ({ tile, duration: STEP_DURATION })),
      ];

      // x och y får lika många delar så att de håller takten
      const xs = segments.map(({ tile, duration }, i) =>
        withTiming(
          tile.x * TILE_SIZE,
          { duration, easing: Easing.linear },
          (finished) => {
            "worklet";
            if (finished && i === segments.length - 1) {
              walking.set(false);
              scheduleOnRN(arrive, destination, id);
            }
          },
        ),
      );
      const ys = segments.map(({ tile, duration }) =>
        withTiming(tile.y * TILE_SIZE, { duration, easing: Easing.linear }),
      );

      walking.set(true);
      playerX.set(withSequence(...xs));
      playerY.set(withSequence(...ys));
    },
    [playerX, playerY, walking, arrive, currentTile],
  );

  const walkTo = useCallback(
    (destination: Point) => {
      const path = findPath(currentTile(), destination, depleted);
      if (!path) return noPath();

      walkPath(path, destination);
    },
    [currentTile, walkPath, depleted],
  );

  // går till en ruta bredvid någon av tiles, t.ex. foten på ett träd,
  // och anropar callback när spelaren står där
  const walkNextTo = useCallback(
    (tiles: Point[], callback: () => void) => {
      const path = findPathToAdjacent(currentTile(), tiles, depleted);
      if (!path) return noPath();

      walkPath(path, tiles[0], callback);
    },
    [currentTile, walkPath, depleted],
  );

  return { playerX, playerY, walking, target, walkTo, walkNextTo };
};
