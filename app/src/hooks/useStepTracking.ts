import { hydratedAtom } from "@/state/save";
import { depositAtom, isAvailableAtom } from "@/state/stepbank";
import { Pedometer } from "expo-sensors";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

export const useStepTracking = () => {
  const hydrated = useAtomValue(hydratedAtom);
  const depositSteps = useSetAtom(depositAtom);
  const setIsAvailable = useSetAtom(isAvailableAtom);

  useEffect(() => {
    // banken måste vara inläst, annars skrivs insättningar över
    if (!hydrated) return;

    let cancelled = false;
    let subscription: { remove: () => void } | undefined;
    let lastStepCountReport = 0;

    const start = async () => {
      const available = await Pedometer.isAvailableAsync();
      if (!available || cancelled) return;

      setIsAvailable(true);

      subscription = Pedometer.watchStepCount((result) => {
        depositSteps(result.steps - lastStepCountReport);
        lastStepCountReport = result.steps;
      });
    };

    start();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [hydrated, depositSteps, setIsAvailable]);
};
