import { hydratedAtom } from "@/state/save";
import {
  depositAtom,
  isAvailableAtom,
  stepsSyncedAtAtom,
} from "@/state/stepbank";
import { Pedometer } from "expo-sensors";
import { useAtomValue, useSetAtom, useStore } from "jotai";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";

// iOS sparar bara den senaste veckans steg
const HISTORY_MS = 7 * 24 * 60 * 60 * 1000;

type Subscription = { remove: () => void };

export const useStepTracking = () => {
  const store = useStore();
  const hydrated = useAtomValue(hydratedAtom);
  const depositSteps = useSetAtom(depositAtom);
  const setIsAvailable = useSetAtom(isAvailableAtom);
  const setSyncedAt = useSetAtom(stepsSyncedAtAtom);

  useEffect(() => {
    // banken måste vara inläst, annars skrivs insättningar över
    if (!hydrated) return;

    let cancelled = false;
    const subscriptions: Subscription[] = [];

    // iOS: stegen sedan förra hämtningen. Då kommer även steg som togs
    // medan appen var stängd eller i bakgrunden med
    let syncing = false;
    let pending = false;
    const syncFromHistory = async () => {
      if (syncing) {
        pending = true;
        return;
      }
      syncing = true;

      try {
        const now = Date.now();
        const syncedAt = store.get(stepsSyncedAtAtom);

        // första gången börjar räkningen nu
        if (syncedAt !== null) {
          const from = Math.max(syncedAt, now - HISTORY_MS);
          const { steps } = await Pedometer.getStepCountAsync(
            new Date(from),
            new Date(now),
          );
          if (cancelled) return;
          depositSteps(steps);
        }
        setSyncedAt(now);
      } catch (error) {
        console.warn("could not read step history", error);
      } finally {
        syncing = false;
      }

      // steg som rapporterades under hämtningen
      if (pending && !cancelled) {
        pending = false;
        syncFromHistory();
      }
    };

    const start = async () => {
      const available = await Pedometer.isAvailableAsync();
      if (!available || cancelled) return;

      setIsAvailable(true);

      if (Platform.OS === "ios") {
        await syncFromHistory();
        if (cancelled) return;

        // varje rapport och varje gång appen öppnas igen hämtar de nya stegen
        subscriptions.push(
          Pedometer.watchStepCount(() => syncFromHistory()),
          AppState.addEventListener("change", (state) => {
            if (state === "active") syncFromHistory();
          }),
        );
        return;
      }

      // Android har ingen historik, så bara steg medan appen är öppen räknas
      let lastStepCountReport = 0;
      subscriptions.push(
        Pedometer.watchStepCount((result) => {
          depositSteps(result.steps - lastStepCountReport);
          lastStepCountReport = result.steps;
        }),
      );
    };

    start();

    return () => {
      cancelled = true;
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, [hydrated, store, depositSteps, setIsAvailable, setSyncedAt]);
};
