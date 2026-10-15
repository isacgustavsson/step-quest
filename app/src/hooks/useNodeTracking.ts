import { depletedNodesAtom, NODES_KEY, pruneNodesAtom } from "@/state/nodes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export const useNodeTracking = () => {
  const setDepleted = useSetAtom(depletedNodesAtom);
  const prune = useSetAtom(pruneNodesAtom);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(NODES_KEY);
      setDepleted(stored ? JSON.parse(stored) : {});
      // objekt som växt tillbaka medan appen var stängd
      prune();
    };

    load();
  }, [setDepleted, prune]);
};
