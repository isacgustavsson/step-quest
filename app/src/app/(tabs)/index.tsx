import { ActionCard } from "@/components/actionCard";
import { useResourceActions } from "@/hooks/useResourceActions";
import { addPlayerLevelAtom } from "@/state/player";
import { styles } from "@/styles/main";
import { useSetAtom } from "jotai";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Home() {
  const { handleChopWood, handleMineStone } = useResourceActions();

  const addLevel = useSetAtom(addPlayerLevelAtom);

  const handlePress = () => {
    addLevel();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Pressable onPress={handlePress}>
          <Text>add</Text>
        </Pressable>
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
                  levelUnlocked: 0,
                  onAction: handleChopWood,
                },
                {
                  label: "tree",
                  levelUnlocked: 1,
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
                  levelUnlocked: 0,
                  onAction: handleMineStone,
                },
                {
                  label: "boulder",
                  levelUnlocked: 1,
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
