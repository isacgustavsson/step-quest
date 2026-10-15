import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";
import { Alert } from "react-native";
import { START_POSITION } from "@/map/tilemap";
import { INVENTORY_KEY, inventoryAtom } from "./crafting";
import { MAP_POSITION_KEY, playerPositionAtom } from "./map";
import { depletedNodesAtom, NODES_KEY } from "./nodes";
import { PLAYER_XP_KEY, playerXpAtom } from "./player";
import { RESOURCES_KEY, resourcesAtom } from "./resources";
import { BANK_KEY, bankedStepsAtom } from "./stepbank";

export const resetProgressAtom = atom(null, async (get, set) => {
  set(bankedStepsAtom, 0);
  set(resourcesAtom, { wood: 0, stone: 0 });
  set(playerXpAtom, 0);
  set(inventoryAtom, {});
  set(playerPositionAtom, START_POSITION);
  set(depletedNodesAtom, {});

  Alert.alert("storage cleared");

  await AsyncStorage.multiRemove([
    BANK_KEY,
    RESOURCES_KEY,
    PLAYER_XP_KEY,
    INVENTORY_KEY,
    MAP_POSITION_KEY,
    NODES_KEY,
  ]);
});
