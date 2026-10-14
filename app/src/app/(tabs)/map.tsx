import { TileMap } from "@/components/tileMap";
import { usePlayerWalk } from "@/hooks/usePlayerWalk";
import { colors } from "@/styles/main";
import { View } from "react-native";

export default function MapScreen() {
  const { playerX, playerY, target, walkTo } = usePlayerWalk();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TileMap
        playerX={playerX}
        playerY={playerY}
        target={target}
        onTileTap={walkTo}
      />
    </View>
  );
}
