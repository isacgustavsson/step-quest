import { ActionCard } from "@/components/actionCard";
import { CRAFT_ACTIVITIES } from "@/data/crafting";
import { useCraftingActions } from "@/hooks/useCraftingActions";
import { styles } from "@/styles/main";
import { ScrollView, View } from "react-native";

export default function Crafting() {
  const { handleCraft } = useCraftingActions();

  return (
    <View style={styles.container}>
      {/* utan detta tar ScrollView över tryck på knappar medan receptlistan
          fortfarande glider, så att man måste trycka igen */}
      <ScrollView style={{ width: "100%" }} disableScrollViewPanResponder>
        <ActionCard
          title="Crafting"
          activities={CRAFT_ACTIVITIES}
          onAction={handleCraft}
        />
      </ScrollView>
    </View>
  );
}
