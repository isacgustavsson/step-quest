import { ActionCard } from "@/components/actionCard";
import { useResourceActions } from "@/hooks/useResourceActions";
import { styles } from "@/styles/main";
import { ScrollView, View } from "react-native";

export default function Crafting() {
  const action = useResourceActions();

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <ActionCard
            title="crafting"
            actionLabel="craft"
            activities={[
              {
                label: "blacksmithing",
                image: require("@assets/img/blacksmith.png"),
                icon: require("@assets/icons/anvil.png"),
                recipes: [
                  {
                    label: "stone axe",
                    onAction: () => console.log("crafting stone axe"),
                  },
                  {
                    label: "stone pickaxe",
                    onAction: () => console.log("craft stone pickaxe"),
                  },
                ],
              },

              {
                label: "carpentry",
                image: require("@assets/img/carpentry.png"),
                icon: require("@assets/icons/wood.png"),
                recipes: [
                  {
                    label: "wooden handle",
                    onAction: () => console.log("crafting wooden handle"),
                  },
                  {
                    label: "wood spade",
                    onAction: () => console.log("craft wooden spade"),
                  },
                  {
                    label: "wooden gnome",
                    onAction: () => console.log("crafting wooden gnome"),
                  },
                ],
              },
            ]}
          />
        </ScrollView>
      </View>
    </>
  );
}
