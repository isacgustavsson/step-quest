import { GatherModal } from "@/components/gatherModal";
import { TileMap } from "@/components/tileMap";
import { GATHER_RECIPES } from "@/data/gathering";
import { RESOURCES } from "@/data/resources";
import { usePlayerWalk } from "@/hooks/usePlayerWalk";
import { useResourceActions } from "@/hooks/useResourceActions";
import { footTiles, getNodeAtTap, Point, ResourceNode } from "@/map/tilemap";
import { playerPositionAtom } from "@/state/map";
import { playerLevelAtom } from "@/state/player";
import { depletedNodesAtom, isDepleted, pruneNodesAtom } from "@/state/nodes";
import { colors } from "@/styles/main";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, View } from "react-native";

export default function MapScreen() {
  const { playerX, playerY, walking, target, walkTo, walkNextTo } =
    usePlayerWalk();
  const { handleGatherNode } = useResourceActions();
  const depletedNodes = useAtomValue(depletedNodesAtom);
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

  const depleted = useMemo(
    () => new Set(Object.keys(depletedNodes).map(Number)),
    [depletedNodes],
  );

  const openGather = useCallback(
    (node: ResourceNode) => {
      const recipe = GATHER_RECIPES[node.resource];
      const { label } = RESOURCES[node.resource];

      if (isDepleted(depletedNodes, node)) {
        const seconds = Math.max(
          1,
          Math.ceil((depletedNodes[node.id] - Date.now()) / 1000),
        );
        Alert.alert(label, `grows back in ${seconds}s`);
        return;
      }

      if (playerLevel < recipe.levelUnlocked) {
        Alert.alert(label, `requires level ${recipe.levelUnlocked}`);
        return;
      }

      setOpenNode(node);
    },
    [depletedNodes, playerLevel],
  );

  // ett objekt på rutan, foten eller resten av bilden: gå fram till det och
  // samla, annars gå dit. Ett uttömt objekt syns inte, så då går spelaren
  // till rutan
  const handleTileTap = useCallback(
    (tile: Point) => {
      const node = getNodeAtTap(tile, depleted);
      if (node) {
        walkNextTo(footTiles(node), () => openGather(node));
      } else {
        walkTo(tile);
      }
    },
    [walkTo, walkNextTo, openGather, depleted],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TileMap
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
