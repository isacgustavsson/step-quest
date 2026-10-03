import { depositAtom } from "@/state/stepbank";
import { useSetAtom } from "jotai";
import { Alert } from "react-native";

export const useSimulateSteps = () => {
  const deposit = useSetAtom(depositAtom);

  const handleSimulateSteps = (amount: number) => {
    deposit(amount);

    Alert.alert("deposit succeeded");
  };

  return { handleSimulateSteps };
};
