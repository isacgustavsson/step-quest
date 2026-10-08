import { ActionCard } from "@/components/actionCard";
import { useCraftingActions } from "@/hooks/useCraftingActions";
import { styles } from "@/styles/main";
import { ScrollView, View } from "react-native";

export default function Crafting() {
  const { handleCraft } = useCraftingActions();

  return (
    <View style={styles.container}>
      <ScrollView>
        <ActionCard
          title="crafting"
          activities={[
            {
              label: "blacksmithing",
              image: require("@assets/img/blacksmith.png"),
              icon: require("@assets/icons/anvil.png"),
              onAction: handleCraft,
              recipes: [
                {
                  label: "stone axe",
                  actionLabel: "craft",
                  icon: require("@assets/icons/stone_axe.png"),
                  levelUnlocked: 2,
                  xpYield: 10,
                  cost: { "pine branch": 20, stone: 30 },
                },
                {
                  label: "stone pickaxe",
                  actionLabel: "craft",
                  icon: require("@assets/icons/stone_pickaxe.png"),
                  levelUnlocked: 2,
                  xpYield: 10,
                  cost: { "pine branch": 20, stone: 30 },
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
                  label: "wood skull",
                  actionLabel: "craft",
                  icon: require("@assets/icons/woodenSkull.png"),
                  levelUnlocked: 1,
                  xpYield: 20,
                  cost: { "pine branch": 50 },
                },
                {
                  label: "wood shield",
                  actionLabel: "craft",
                  icon: require("@assets/icons/woodenShield.png"),
                  levelUnlocked: 2,
                  xpYield: 30,
                  cost: { "birch log": 100, stone: 50 },
                },
              ],
            },
          ]}
        />
      </ScrollView>
    </View>
  );
}
