import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const BANK_KEY = "stepBank:balance";

export default function Index() {
  const [stepCount, setStepCount] = useState(0);
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

      if (delta <= 0) return;

      setStepCount((prev) => {
        const next = prev + delta;
        AsyncStorage.setItem(BANK_KEY, String(next));
        return next;
      });
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
