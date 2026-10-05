import { ActionCard } from "@/components/actionCard";
import { useCraftingActions } from "@/hooks/useCraftingActions";
import { styles } from "@/styles/main";
import { ScrollView, View } from "react-native";

export default function Crafting() {
  const { handleCraft } = useCraftingActions();

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
                onAction: handleCraft,
                recipes: [
                  {
                    label: "stone axe",
                    levelUnlocked: 1,
                    xpYield: 5,
                    cost: { wood: 1, stone: 2 },
                  },
                  {
                    label: "stone pickaxe",
                    levelUnlocked: 1,
                    xpYield: 15,
                    cost: { wood: 2, stone: 3 },
                  },
                ],
              },

              {
                label: "carpentry",
                image: require("@assets/img/carpentry.png"),
                icon: require("@assets/icons/wood.png"),
                onAction: handleCraft,
                recipes: [
                  {
                    label: "wooden handle",
                    levelUnlocked: 1,
                    xpYield: 5,
                    cost: { wood: 1, stone: 2 },
                  },
                  {
                    label: "wood spade",
                    levelUnlocked: 1,
                    xpYield: 15,
                    cost: { wood: 2, stone: 3 },
                  },
                  {
                    label: "wooden gnome",
                    levelUnlocked: 2,
                    xpYield: 30,
                    cost: { wood: 3, stone: 4 },
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
