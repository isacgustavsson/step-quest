import { ActionCard } from "@/components/actionCard";
import { useResourceActions } from "@/hooks/useResourceActions";
import { styles } from "@/styles/main";
import { ScrollView, View } from "react-native";

export default function Home() {
  const { handleChopWood, handleMineStone } = useResourceActions();

  return (
    <View style={styles.container}>
      <ScrollView>
        <ActionCard
          title="resources"
          actionLabel="gather"
          activities={[
            {
              label: "wood",
              image: require("@assets/img/forest.jpg"),
              icon: require("@assets/icons/wood.png"),
              onAction: handleChopWood,
              recipes: [
                {
                  label: "branches",
                  levelUnlocked: 0,
                  xpYield: 5,
                },
                {
                  label: "tree",
                  levelUnlocked: 1,
                  xpYield: 15,
                },
              ],
            },
            {
              label: "stone",
              image: require("@assets/img/mushrooms.jpg"),
              icon: require("@assets/icons/stone.png"),
              onAction: handleMineStone,
              recipes: [
                {
                  label: "stones",
                  levelUnlocked: 0,
                  xpYield: 5,
                },
                {
                  label: "boulder",
                  levelUnlocked: 1,
                  xpYield: 15,
                },
              ],
            },
          ]}
        />
      </ScrollView>
    </View>
  );
}
