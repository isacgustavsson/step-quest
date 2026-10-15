import { isOpenGround, Point, START_POSITION } from "@/map/tilemap";
import { atom } from "jotai";
import { persistedAtom } from "./save";

// kartan kan ha ändrats sedan positionen sparades. Resursobjekt räknas
// inte, eftersom spelaren kan stå där ett uttömt objekt stod
const restorePosition = (stored: unknown): Point => {
  const position = stored as Partial<Point>;

  if (
    typeof position.x !== "number" ||
    typeof position.y !== "number" ||
    !isOpenGround({ x: position.x, y: position.y })
  ) {
    return START_POSITION;
  }

  return { x: position.x, y: position.y };
};

export const playerPositionAtom = persistedAtom<Point>(
  "position",
  START_POSITION,
  restorePosition,
);

export const movePlayerAtom = atom(null, (get, set, position: Point) => {
  set(playerPositionAtom, position);
});
