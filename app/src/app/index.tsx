import {
  BANK_KEY,
  bankedStepsAtom,
  depositAtom,
  withdrawAtom,
} from "@/state/stepbank";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [stepCount, setStepCount] = useAtom(bankedStepsAtom);
  const depositSteps = useSetAtom(depositAtom);
  const withDrawSteps = useSetAtom(withdrawAtom);

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

  const handleWithDraw = (amount: number) => {
    const result = withDrawSteps(amount);

    if (!result.ok) {
      Alert.alert("could not withdraw", result.reason);
      return;
    }

    Alert.alert("withdraw succeded", `new balance: ${result.newBalance}`);
  };

  return (
    <View style={styles.container}>
      <Text>{String(isAvailable)}</Text>
      <Text>delta: {stepCount}</Text>

      <Text>withdraw steps</Text>
      <Pressable onPress={() => handleWithDraw(5)}>
        <Text>ta ut steg</Text>
      </Pressable>
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
