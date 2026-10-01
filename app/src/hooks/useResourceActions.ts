import { chopWoodAtom, GatherResult, mineStoneAtom } from "@/state/resources";
import { useSetAtom } from "jotai";
import { Alert } from "react-native";

export const useResourceActions = () => {
  const chopWood = useSetAtom(chopWoodAtom);
  const mineStone = useSetAtom(mineStoneAtom);

  // tar emot en funktion som argument och returnerar ett GatherResult
  const performAction = (action: () => GatherResult) => {
    const result = action();

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
    handleChopWood: () => performAction(chopWood),
    handleMineStone: () => performAction(mineStone),
  };
};
