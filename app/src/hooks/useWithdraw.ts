import { withdrawAtom } from "@/state/stepbank";
import { useSetAtom } from "jotai";
import { Alert } from "react-native";

export const useWithdraw = () => {
  const withDrawSteps = useSetAtom(withdrawAtom);

  const handleWithDraw = (amount: number) => {
    const result = withDrawSteps(amount);

    if (!result.ok) {
      Alert.alert("could not withdraw", result.reason);
      return;
    }

    Alert.alert("withdraw succeded", `new balance: ${result.newBalance}`);
  };

  return { handleWithDraw };
};
