import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { Alert } from "react-native";
import { inventoryAtom } from "./crafting";
import { PLAYER_XP_KEY, playerXpAtom } from "./player";
import { RESOURCES_KEY, resourcesAtom } from "./resources";
import { BANK_KEY, bankedStepsAtom } from "./stepbank";

export const resetProgressAtom = atom(null, async (get, set) => {
  set(bankedStepsAtom, 0);
  set(resourcesAtom, { wood: 0, stone: 0 });
  set(playerXpAtom, 0);
  set(inventoryAtom, {});

  Alert.alert("storage cleared");

  await AsyncStorage.multiRemove([BANK_KEY, RESOURCES_KEY, PLAYER_XP_KEY]);
});
