import { ITEMS } from "@/data/items";
import { RESOURCES } from "@/data/resources";
import type { CraftRecipe } from "@/data/types";
import { craftAtom } from "@/state/crafting";
import * as Haptics from "expo-haptics";
import { useSetAtom } from "jotai";
import { Alert } from "react-native";

export const useCraftingActions = () => {
  const craft = useSetAtom(craftAtom);

  const handleCraft = (recipe: CraftRecipe, times: number = 1) => {
    const result = craft(recipe, times);

    if (!result.ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Could not craft item..", result.reason);
      return;
    }

    const costText = Object.entries(result.cost)
      .map(([key, amount]) => `${amount} ${RESOURCES[key]?.label ?? key}`)
      .join(", ");

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Success!",
      `+ ${result.amount} ${ITEMS[recipe.item].label}\n- ${costText}\n+ ${result.xp} xp`,
    );
  };

  return { handleCraft };
};
