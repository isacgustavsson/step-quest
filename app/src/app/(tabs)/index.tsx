import { ActionCard } from "@/components/actionCard";
import { useResourceActions } from "@/hooks/useResourceActions";
import { styles } from "@/styles/main";
import { ScrollView, View } from "react-native";

export default function Home() {
  const { handleGather } = useResourceActions();

  return (
    <View style={styles.container}>
      <ScrollView>
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
