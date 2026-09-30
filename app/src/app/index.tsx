import { useWithdraw } from "@/hooks/useWithdraw";
import { isAvailableAtom } from "@/state/pedometer";
import { bankedStepsAtom } from "@/state/stepbank";
import { useAtomValue } from "jotai";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const stepCount = useAtomValue(bankedStepsAtom);
  const isAvailable = useAtomValue(isAvailableAtom);
  const { handleWithDraw } = useWithdraw();

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
