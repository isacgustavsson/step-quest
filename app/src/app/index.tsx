import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [stepCount, setStepCount] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);

  const subscribe = async () => {
    const available = await Pedometer.isAvailableAsync();

    if (!available) return;

    setIsAvailable(true);

    return Pedometer.watchStepCount((result) => {
      setStepCount(result.steps);
      console.log("report:", result.steps, new Date().toLocaleTimeString());
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
      <Text>{stepCount}</Text>
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
