import { RESOURCES } from "@/data/resources";
import { ResourceNode } from "@/map/tilemap";
import * as Haptics from "expo-haptics";
import { useSetAtom } from "jotai";
import { Alert } from "react-native";

import { gatherNodeAtom } from "@/state/nodes";

export const useResourceActions = () => {
  const gatherNode = useSetAtom(gatherNodeAtom);

  // returnerar om insamlingen lyckades, så att modalen kan stängas
  const handleGatherNode = (node: ResourceNode) => {
    const result = gatherNode(node);

    if (!result.ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Could not gather", result.reason);
      return false;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "success!",
      `-${result.cost} steps. \n+${result.gain} ${RESOURCES[node.resource].label}`,
    );
    return true;
  };

  return { handleGatherNode };
};
