import { GATHER_RECIPES } from "@/data/gathering";
import { RESOURCES } from "@/data/resources";
import { findMap } from "@/map/maps";
import { footTiles, ResourceNode } from "@/map/tilemap";
import { atom } from "jotai";
import { currentMapAtom, playerPositionAtom } from "./map";
import { playerLevelAtom } from "./player";
import { GatherResult, gatherAtom } from "./resources";
import { persistedAtom } from "./save";

// objekt-id:n i Tiled är bara unika inom en karta, så kartans id är med
export const nodeKey = (mapId: string, nodeId: number) => `${mapId}:${nodeId}`;

const parseNodeKey = (key: string) => {
  const split = key.lastIndexOf(":");
  return { mapId: key.slice(0, split), nodeId: Number(key.slice(split + 1)) };
};

// nodeKey → tidpunkten (ms) då objektet växer tillbaka
export const depletedNodesAtom = persistedAtom<Record<string, number>>(
  "depletedNodes",
  {},
);

// id:n för uttömda objekt på kartan spelaren står på
export const depletedOnMapAtom = atom((get) => {
  const mapId = get(currentMapAtom).id;
  const ids = new Set<number>();

  for (const key of Object.keys(get(depletedNodesAtom))) {
    const parsed = parseNodeKey(key);
    if (parsed.mapId === mapId) ids.add(parsed.nodeId);
  }
  return ids;
});

// samlar från ett objekt på kartan spelaren står på, som sedan är uttömt
// en stund. Ett objekt är uttömt tills pruneNodesAtom har tagit bort det
export const gatherNodeAtom = atom(
  null,
  (get, set, node: ResourceNode): GatherResult => {
    const recipe = GATHER_RECIPES[node.resource];
    const key = nodeKey(get(currentMapAtom).id, node.id);

    if (key in get(depletedNodesAtom)) {
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
      [key]: Date.now() + recipe.respawnSeconds * 1000,
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
    Object.entries(current).filter(([key, respawnAt]) => {
      const { mapId, nodeId } = parseNodeKey(key);
      const node = findMap(mapId)?.nodesById.get(nodeId);
      // objekt som inte längre finns på kartan kan glömmas
      if (!node) return false;

      const underPlayer =
        mapId === player.mapId &&
        footTiles(node).some(
          (tile) => tile.x === player.x && tile.y === player.y,
        );
      return respawnAt > now || underPlayer;
    }),
  );

  if (Object.keys(next).length === Object.keys(current).length) return;

  set(depletedNodesAtom, next);
});
