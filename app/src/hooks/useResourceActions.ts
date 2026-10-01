import { chopWoodAtom, mineStoneAtom } from "@/state/resources";
import { useSetAtom } from "jotai";
import { Alert } from "react-native";

export const useResourceActions = () => {
  const chopWood = useSetAtom(chopWoodAtom);
  const mineStone = useSetAtom(mineStoneAtom);

  const handleChopWood = () => {
    const result = chopWood();

    if (!result.ok) {
      Alert.alert("could not perform action", result.reason);
      return;
    }

    Alert.alert(
      "action performed..",
      `lost: ${result.cost} steps, gained: ${result.gain} wood`,
    );
  };

  const handleMineStone = () => {
    const result = mineStone();

    if (!result.ok) {
      Alert.alert("could not perform action", result.reason);
      return;
    }

    Alert.alert(
      "action succeeded",
      `lost: ${result.cost} gained: ${result.gain}`,
    );
  };

  return { handleChopWood, handleMineStone };
};
