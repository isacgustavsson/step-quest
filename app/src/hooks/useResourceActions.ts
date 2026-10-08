import { Recipe } from "@/components/actionCard";
import * as Haptics from "expo-haptics";
import { useSetAtom } from "jotai";
import { Alert } from "react-native";

import { gatherAtom } from "@/state/resources";

export const useResourceActions = () => {
  const gather = useSetAtom(gatherAtom);

  const handleGather = (recipe: Recipe, times: number = 1) => {
    const result = gather(recipe, times);

    if (!result.ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Could not gather", result.reason);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "success!",
      `-${result.cost} steps. \n+${result.gain} ${recipe.label} \n+${result.xp} xp`,
    );
  };

  return { handleGather };
};
