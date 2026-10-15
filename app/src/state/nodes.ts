import { GATHER_RECIPES } from "@/data/gathering";
import { RESOURCES } from "@/data/resources";
import { footTiles, RESOURCE_NODES, ResourceNode } from "@/map/tilemap";
import { atom } from "jotai";
import { playerPositionAtom } from "./map";
import { playerLevelAtom } from "./player";
import { GatherResult, gatherAtom } from "./resources";
import { persistedAtom } from "./save";

// objekt-id på kartan → tidpunkten (ms) då objektet växer tillbaka
export const depletedNodesAtom = persistedAtom<Record<number, number>>(
  "depletedNodes",
  {},
);

// ett objekt är uttömt tills pruneNodesAtom har tagit bort det
export const isDepleted = (
  depleted: Record<number, number>,
  node: ResourceNode,
) => node.id in depleted;

// id → objekt, för att hitta var ett uttömt objekt står
const nodesById = new Map(RESOURCE_NODES.map((node) => [node.id, node]));

// samlar från ett objekt på kartan, som sedan är uttömt en stund
export const gatherNodeAtom = atom(
  null,
  (get, set, node: ResourceNode): GatherResult => {
    const recipe = GATHER_RECIPES[node.resource];

    if (isDepleted(get(depletedNodesAtom), node)) {
      return {
        ok: false,
        reason: `the ${RESOURCES[node.resource].label} has not grown back`,
      };
    }

    if (get(playerLevelAtom) < recipe.levelUnlocked) {
      return {
        ok: false,
        reason: `requires level ${recipe.levelUnlocked}`,
      };
    }

    const result = set(gatherAtom, recipe);
    if (!result.ok) return result;

    set(depletedNodesAtom, {
      ...get(depletedNodesAtom),
      [node.id]: Date.now() + recipe.respawnSeconds * 1000,
    });

    return result;
  },
);

// tar bort objekt som har växt tillbaka. Ett objekt växer inte upp under
// spelaren, utan väntar tills spelaren har gått därifrån
export const pruneNodesAtom = atom(null, (get, set) => {
  const now = Date.now();
  const player = get(playerPositionAtom);
  const current = get(depletedNodesAtom);

  const next = Object.fromEntries(
    Object.entries(current).filter(([id, respawnAt]) => {
      const node = nodesById.get(Number(id));
      // objekt som inte längre finns på kartan kan glömmas
      if (!node) return false;

      const underPlayer = footTiles(node).some(
        (tile) => tile.x === player.x && tile.y === player.y,
      );
      return respawnAt > now || underPlayer;
    }),
  );

  if (Object.keys(next).length === Object.keys(current).length) return;

  set(depletedNodesAtom, next);
});
