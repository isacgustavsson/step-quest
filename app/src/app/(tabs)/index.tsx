import { ResourceActionCard } from "@/components/resourceActionCard";
import { useResourceActions } from "@/hooks/useResourceActions";
import { styles } from "@/styles/main";
import { View } from "react-native";

export default function Home() {
  const { handleChopWood, handleMineStone } = useResourceActions();

  return (
    <View style={styles.container}>
      <ResourceActionCard
        activities={[
          { label: "wood", onAction: handleChopWood },
          {
            label: "stone",
            onAction: handleMineStone,
          },
        ]}
      />
    </View>
  );
}
