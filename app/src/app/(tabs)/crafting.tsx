import { ActionCard } from "@/components/actionCard";
import { useCraftingActions } from "@/hooks/useCraftingActions";
import { styles } from "@/styles/main";
import { ScrollView, View } from "react-native";

export default function Crafting() {
  const { handleCraft } = useCraftingActions();

  return (
    <View style={styles.container}>
      <ScrollView style={{ width: "100%" }}>
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
                  label: "stone spade",
                  description:
                    "A flat stone lashed to a stick. Good for digging.",
                  actionLabel: "craft",
                  icon: require("@assets/icons/stoneSpade.png"),
                  levelUnlocked: 1,
                  xpYield: 10,
                  cost: { "pine branch": 15, stone: 20 },
                },
                {
                  label: "stone axe",
                  description: "A crude axe for chopping wood.",
                  actionLabel: "craft",
                  icon: require("@assets/icons/stone_axe.png"),
                  levelUnlocked: 2,
                  xpYield: 10,
                  cost: { "pine branch": 20, stone: 30 },
                },
                {
                  label: "stone pickaxe",
                  description: "A simple pickaxe for breaking rocks.",
                  actionLabel: "craft",
                  icon: require("@assets/icons/stone_pickaxe.png"),
                  levelUnlocked: 2,
                  xpYield: 10,
                  cost: { "pine branch": 20, stone: 30 },
                },
                {
                  label: "copper dagger",
                  description: "A short blade. Dull, but it shines.",
                  actionLabel: "craft",
                  // platshållare tills riktig ikon finns
                  icon: require("@assets/icons/stone_axe.png"),
                  levelUnlocked: 3,
                  xpYield: 40,
                  cost: { "copper ore": 40, "birch log": 20 },
                },
                {
                  label: "iron helmet",
                  description: "Heavy, hot and very protective.",
                  actionLabel: "craft",
                  // platshållare tills riktig ikon finns
                  icon: require("@assets/icons/woodenShield.png"),
                  levelUnlocked: 4,
                  xpYield: 60,
                  cost: { "iron ore": 60, coal: 30 },
                },
                {
                  label: "bronze sword",
                  description: "Copper and tin, forged into something sharp.",
                  actionLabel: "craft",
                  // platshållare tills riktig ikon finns
                  icon: require("@assets/icons/stone_pickaxe.png"),
                  levelUnlocked: 5,
                  xpYield: 90,
                  cost: { "copper ore": 60, "tin ore": 60, coal: 40 },
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
                  label: "campfire",
                  description: "Warmth for cold nights.",
                  actionLabel: "craft",
                  icon: require("@assets/icons/fire.png"),
                  levelUnlocked: 0,
                  xpYield: 8,
                  cost: { "pine branch": 30, stone: 10 },
                },
                {
                  label: "wood skull",
                  description: "A carved skull. Spooky, but useless.",
                  actionLabel: "craft",
                  icon: require("@assets/icons/woodenSkull.png"),
                  levelUnlocked: 1,
                  xpYield: 20,
                  cost: { "pine branch": 50 },
                },
                {
                  label: "wood shield",
                  description: "A sturdy shield reinforced with stone.",
                  actionLabel: "craft",
                  icon: require("@assets/icons/woodenShield.png"),
                  levelUnlocked: 2,
                  xpYield: 30,
                  cost: { "birch log": 100, stone: 50 },
                },
                {
                  label: "willow bow",
                  description: "Bends without breaking. Mostly.",
                  actionLabel: "craft",
                  // platshållare tills riktig ikon finns
                  icon: require("@assets/icons/wood.png"),
                  levelUnlocked: 3,
                  xpYield: 45,
                  cost: { "willow log": 60, "pine branch": 20 },
                },
                {
                  label: "maple chest",
                  description: "A sturdy box with copper hinges.",
                  actionLabel: "craft",
                  // platshållare tills riktig ikon finns
                  icon: require("@assets/icons/chest.png"),
                  levelUnlocked: 4,
                  xpYield: 60,
                  cost: { "maple log": 80, "copper ore": 20 },
                },
                {
                  label: "oak staff",
                  description: "A tall staff, hardened over coal.",
                  actionLabel: "craft",
                  // platshållare tills riktig ikon finns
                  icon: require("@assets/icons/oak_log.png"),
                  levelUnlocked: 5,
                  xpYield: 80,
                  cost: { "oak log": 100, coal: 20 },
                },
              ],
            },
          ]}
        />
      </ScrollView>
    </View>
  );
}
