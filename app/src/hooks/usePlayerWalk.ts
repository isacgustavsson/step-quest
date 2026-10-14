// hooks/usePlayerWalk.ts
import { findPath, Point, TILE_SIZE } from "@/map/tilemap";
import { movePlayerAtom, playerPositionAtom } from "@/state/map";
import * as Haptics from "expo-haptics";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const STEP_DURATION = 140;

// hela promenaden körs som en animation på UI-tråden, så att den inte
// hackar när JS-tråden är upptagen. Positionen sparas först vid ankomst.
export const usePlayerWalk = () => {
  const position = useAtomValue(playerPositionAtom);
  const movePlayer = useSetAtom(movePlayerAtom);
  const [target, setTarget] = useState<Point | null>(null);

  const playerX = useSharedValue(position.x * TILE_SIZE);
  const playerY = useSharedValue(position.y * TILE_SIZE);
  // ökas för varje ny promenad, så att en gammal ankomst ignoreras
  const walkId = useRef(0);

  // atomen ändras bara vid laddning, reset och ankomst, så positionen
  // kan sättas direkt utan animation
  useEffect(() => {
    cancelAnimation(playerX);
    cancelAnimation(playerY);
    playerX.set(position.x * TILE_SIZE);
    playerY.set(position.y * TILE_SIZE);
  }, [position, playerX, playerY]);

  const arrive = useCallback(
    (destination: Point, id: number) => {
      if (walkId.current !== id) return;

      movePlayer(destination);
      setTarget(null);
    },
    [movePlayer],
  );

  const walkTo = useCallback(
    (destination: Point) => {
      // mitt i ett steg står spelaren mellan två gångbara rutor,
      // så närmaste ruta är alltid en giltig start
      const fromX = playerX.get();
      const fromY = playerY.get();
      const start = {
        x: Math.round(fromX / TILE_SIZE),
        y: Math.round(fromY / TILE_SIZE),
      };

      const path = findPath(start, destination);

      // ingen väg: en pågående promenad får fortsätta
      if (!path) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      const id = ++walkId.current;
      Haptics.selectionAsync();
      setTarget(destination);

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
              scheduleOnRN(arrive, destination, id);
            }
          },
        ),
      );
      const ys = segments.map(({ tile, duration }) =>
        withTiming(tile.y * TILE_SIZE, { duration, easing: Easing.linear }),
      );

      playerX.set(withSequence(...xs));
      playerY.set(withSequence(...ys));
    },
    [playerX, playerY, arrive],
  );

  return { playerX, playerY, target, walkTo };
};
