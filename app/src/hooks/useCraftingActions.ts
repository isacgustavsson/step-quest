import { Recipe } from "@/components/actionCard";
import { craftAtom } from "@/state/crafting";
import * as Haptics from "expo-haptics";
import { useSetAtom } from "jotai";
import { Alert } from "react-native";

export const useCraftingActions = () => {
  const craft = useSetAtom(craftAtom);

  const handleCraft = (recipe: Recipe, times: number = 1) => {
    const result = craft(recipe, times);

    if (!result.ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Could not craft item..", result.reason);
      return;
    }

    const costText = Object.entries(result.cost)
      .map(([key, amount]) => `${amount} ${key}`)
      .join(", ");

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Success!",
      `+ ${result.amount} ${recipe.label}\n- ${costText}\n+ ${result.xp} xp`,
    );
  };

  return { handleCraft };
};
