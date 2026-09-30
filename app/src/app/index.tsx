import { bankedStepsAtom, depositAtom } from "@/state/stepbank";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export const BANK_KEY = "stepBank:balance";

export default function Index() {
  const [stepCount, setStepCount] = useAtom(bankedStepsAtom);
  const depositSteps = useSetAtom(depositAtom);

  const [isAvailable, setIsAvailable] = useState(false);

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

  return (
    <View style={styles.container}>
      <Text>{String(isAvailable)}</Text>
      <Text>delta: {stepCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
