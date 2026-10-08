import { RESOURCES_KEY, resourcesAtom } from "@/state/resources";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export const useResourceTracking = () => {
  const setResources = useSetAtom(resourcesAtom);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(RESOURCES_KEY);
      setResources(stored ? JSON.parse(stored) : {});
    };

    load();
  }, [setResources]);
};
