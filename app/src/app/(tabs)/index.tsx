import { GatherModal } from "@/components/gatherModal";
import { TileMap } from "@/components/tileMap";
import { GATHER_RECIPES } from "@/data/gathering";
import { RESOURCES } from "@/data/resources";
import { usePlayerWalk } from "@/hooks/usePlayerWalk";
import { useResourceActions } from "@/hooks/useResourceActions";
import { footTiles, getNodeAtTap, Point, ResourceNode } from "@/map/tilemap";
import { currentMapAtom, playerPositionAtom } from "@/state/map";
import {
  depletedNodesAtom,
  depletedOnMapAtom,
  nodeKey,
  pruneNodesAtom,
} from "@/state/nodes";
import { playerLevelAtom } from "@/state/player";
import { colors } from "@/styles/main";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { Alert, View } from "react-native";

export default function MapScreen() {
  const { playerX, playerY, walking, target, walkTo, walkNextTo } =
    usePlayerWalk();
  const { handleGatherNode } = useResourceActions();
  const map = useAtomValue(currentMapAtom);
  const depletedNodes = useAtomValue(depletedNodesAtom);
  const depleted = useAtomValue(depletedOnMapAtom);
  const pruneNodes = useSetAtom(pruneNodesAtom);
  const playerLevel = useAtomValue(playerLevelAtom);
  const playerPosition = useAtomValue(playerPositionAtom);
  const [openNode, setOpenNode] = useState<ResourceNode | null>(null);

  // när nästa objekt växer tillbaka tas det bort ur listan, så att det
  // ritas upp igen medan kartan är öppen. Står spelaren på rutan väntar
  // objektet, och en ny koll görs när spelaren har flyttat sig
  useEffect(() => {
    const now = Date.now();
    const upcoming = Object.values(depletedNodes).filter((t) => t > now);
    const hasDue = upcoming.length < Object.keys(depletedNodes).length;

    if (hasDue) pruneNodes();
    if (upcoming.length === 0) return;

    const timeout = setTimeout(pruneNodes, Math.min(...upcoming) - now);
    return () => clearTimeout(timeout);
  }, [depletedNodes, playerPosition, pruneNodes]);

  const openGather = useCallback(
    (node: ResourceNode) => {
      const recipe = GATHER_RECIPES[node.resource];
      const { label } = RESOURCES[node.resource];
      const respawnAt = depletedNodes[nodeKey(map.id, node.id)];

      if (respawnAt !== undefined) {
        const seconds = Math.max(1, Math.ceil((respawnAt - Date.now()) / 1000));
        Alert.alert(label, `grows back in ${seconds}s`);
        return;
      }

      if (playerLevel < recipe.levelUnlocked) {
        Alert.alert(label, `requires level ${recipe.levelUnlocked}`);
        return;
      }

      setOpenNode(node);
    },
    [map, depletedNodes, playerLevel],
  );

  // ett objekt på rutan, foten eller resten av bilden: gå fram till det och
  // samla, annars gå dit. Ett uttömt objekt syns inte, så då går spelaren
  // till rutan
  const handleTileTap = useCallback(
    (tile: Point) => {
      const node = getNodeAtTap(map, tile, depleted);
      if (node) {
        walkNextTo(footTiles(node), () => openGather(node));
      } else {
        walkTo(tile);
      }
    },
    [map, walkTo, walkNextTo, openGather, depleted],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* en ny karta får en ny TileMap, som centreras på spelaren igen */}
      <TileMap
        key={map.id}
        map={map}
        playerX={playerX}
        playerY={playerY}
        walking={walking}
        target={target}
        depleted={depleted}
        onTileTap={handleTileTap}
      />

      <GatherModal
        recipe={openNode && GATHER_RECIPES[openNode.resource]}
        onGather={() => {
          if (openNode && handleGatherNode(openNode)) setOpenNode(null);
        }}
        onClose={() => setOpenNode(null)}
      />
    </View>
  );
}
