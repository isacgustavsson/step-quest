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
              recipes: [
                {
                  label: "branches",
                  onAction: handleChopWood,
                },
                {
                  label: "tree",
                  onAction: handleChopWood,
                },
              ],
            },
            {
              label: "stone",
              image: require("@assets/img/mushrooms.jpg"),
              icon: require("@assets/icons/stone.png"),
              recipes: [
                {
                  label: "stones",
                  onAction: handleMineStone,
                },
                {
                  label: "boulder",
                  onAction: handleChopWood,
                },
              ],
            },
          ]}
        />
      </ScrollView>
    </View>
  );
}
