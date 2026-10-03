import { CraftingActionCard } from "@/components/craftingActionCard";
import { styles } from "@/styles/main";
import { View } from "react-native";

export default function Crafting() {
  return (
    <>
      <View style={styles.container}>
        <CraftingActionCard
          activities={[
            {
              label: "blacksmithing",
              image: require("@assets/img/blacksmith.png"),
              icon: require("@assets/icons/anvil.png"),
              onAction: () => console.log("bla"),
            },

            {
              label: "carpentry",
              image: require("@assets/img/carpentry.png"),
              icon: require("@assets/icons/wood.png"),
              onAction: () => console.log("bla"),
            },
          ]}
        />
      </View>
    </>
  );
}
