// hooks/useInventoryTracking.ts
import { INVENTORY_KEY, inventoryAtom } from "@/state/crafting";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export const useInventoryTracking = () => {
  const setInventory = useSetAtom(inventoryAtom);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(INVENTORY_KEY);

      setInventory(stored ? JSON.parse(stored) : {});
    };

    load();
  }, [setInventory]);
};
