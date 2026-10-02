import { HeaderComponent } from "@/components/header";
import { ResourceActionCard } from "@/components/resourceActionCard";
import { useResourceActions } from "@/hooks/useResourceActions";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const { handleChopWood, handleMineStone } = useResourceActions();

  return (
    <View style={styles.container}>
      <HeaderComponent />

      <ResourceActionCard
        activities={[
          { label: "wood", actionLabel: "chop wood", onAction: handleChopWood },
          {
            label: "stone",
            actionLabel: "mine stone",
            onAction: handleMineStone,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 12,
    flex: 1,
    alignItems: "center",
  },
});
