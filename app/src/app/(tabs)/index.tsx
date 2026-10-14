import { ActionCard } from "@/components/actionCard";
import { useResourceActions } from "@/hooks/useResourceActions";
import { styles } from "@/styles/main";
import { ScrollView, View } from "react-native";

export default function Home() {
  const { handleGather } = useResourceActions();

  return (
    <View style={styles.container}>
      <ScrollView style={{ width: "100%" }}>
        <ActionCard
          title="resources"
          activities={[
            {
              label: "wood",
              image: require("@assets/img/forest.jpg"),
              icon: require("@assets/icons/wood.png"),
              onAction: handleGather,
              recipes: [
                {
                  label: "pine branch",
                  resourceKey: "pine branch",
                  actionLabel: "gather",
                  levelUnlocked: 0,
                  xpYield: 5,
                },
                {
                  label: "birch log",
                  resourceKey: "birch log",
                  actionLabel: "chop tree",
                  levelUnlocked: 2,
                  xpYield: 15,
                },
                {
                  label: "willow log",
                  resourceKey: "willow log",
                  actionLabel: "chop tree",
                  levelUnlocked: 3,
                  xpYield: 20,
                },
                {
                  label: "maple log",
                  resourceKey: "maple log",
                  actionLabel: "chop tree",
                  levelUnlocked: 4,
                  xpYield: 22,
                },
                {
                  label: "oak log",
                  resourceKey: "oak log",
                  actionLabel: "log tree",
                  levelUnlocked: 5,
                  xpYield: 25,
                },
              ],
            },
            {
              label: "stone",
              image: require("@assets/img/mushrooms.jpg"),
              icon: require("@assets/icons/stone.png"),
              onAction: handleGather,
              recipes: [
                {
                  label: "stone",
                  resourceKey: "stone",
                  actionLabel: "gather",
                  levelUnlocked: 0,
                  xpYield: 5,
                },
                {
                  label: "copper ore",
                  resourceKey: "copper ore",
                  actionLabel: "mine",
                  levelUnlocked: 2,
                  xpYield: 15,
                },
                {
                  label: "coal",
                  resourceKey: "coal",
                  actionLabel: "mine",
                  levelUnlocked: 3,
                  xpYield: 20,
                },
                {
                  label: "iron ore",
                  resourceKey: "iron ore",
                  actionLabel: "mine",
                  levelUnlocked: 4,
                  xpYield: 22,
                },
                {
                  label: "tin ore",
                  resourceKey: "tin ore",
                  actionLabel: "mine",
                  levelUnlocked: 5,
                  xpYield: 25,
                },
              ],
            },
          ]}
        />
      </ScrollView>
    </View>
  );
}
