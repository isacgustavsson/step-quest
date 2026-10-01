import { Resources, RESOURCES_KEY, resourcesAtom } from "@/state/resources";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export const useResourceTracking = () => {
  const setResources = useSetAtom(resourcesAtom);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(RESOURCES_KEY);
      const resources: Resources = stored
        ? JSON.parse(stored)
        : { wood: 0, stone: 0 };

      setResources(resources);
    };

    load();
  }, [setResources]);
};
