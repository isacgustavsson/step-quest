import { Recipe } from "@/components/actionCard";
import { craftAtom } from "@/state/crafting";
import { useSetAtom } from "jotai";
import { Alert } from "react-native";

export const useCraftingActions = () => {
  const craft = useSetAtom(craftAtom);

  const handleCraft = (recipe: Recipe, times: number = 1) => {
    const result = craft(recipe.label, recipe.cost ?? {}, recipe.xpYield);

    if (!result.ok) {
      Alert.alert("Kunde inte crafta", result.reason);
      return;
    }

    Alert.alert("Success!", `Du fick ${result.xp} XP`);
  };

  return { handleCraft };
};
