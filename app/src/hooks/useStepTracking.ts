import {
  BANK_KEY,
  bankedStepsAtom,
  depositAtom,
  isAvailableAtom,
} from "@/state/stepbank";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

export const useStepTracking = () => {
  // state
  const setStepCount = useSetAtom(bankedStepsAtom);
  const depositSteps = useSetAtom(depositAtom);
  const setIsAvailable = useSetAtom(isAvailableAtom);

  // ref
  const lastStepCountReport = useRef(0);

  const subscribe = async () => {
    const stored = await AsyncStorage.getItem(BANK_KEY);
    setStepCount(stored ? Number(stored) : 0);

    const available = await Pedometer.isAvailableAsync();
    if (!available) return;

    setIsAvailable(true);

    return Pedometer.watchStepCount((result) => {
      const delta = result.steps - lastStepCountReport.current;
      lastStepCountReport.current = result.steps;

      depositSteps(delta);
    });
  };

  useEffect(() => {
    const subscriptionPromise = subscribe();

    return () => {
      subscriptionPromise.then((subscription) => subscription?.remove());
    };
  }, []);
};
