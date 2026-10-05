import { Recipe } from "@/components/actionCard";
import { chopWoodAtom, GatherResult, mineStoneAtom } from "@/state/resources";
import { useSetAtom } from "jotai";
import { Alert } from "react-native";

export const useResourceActions = () => {
  const chopWood = useSetAtom(chopWoodAtom);
  const mineStone = useSetAtom(mineStoneAtom);

  const performAction = (result: GatherResult) => {
    if (!result.ok) {
      Alert.alert("could not perform action", result.reason);
      return;
    }

    Alert.alert(
      "action succeeded",
      `lost: ${result.cost} steps, gained: ${result.gain}`,
    );
  };

  return {
    handleChopWood: (recipe: Recipe, times: number = 1) =>
      performAction(chopWood(times, recipe.xpYield)),
    handleMineStone: (recipe: Recipe, times: number = 1) =>
      performAction(mineStone(times, recipe.xpYield)),
  };
};
