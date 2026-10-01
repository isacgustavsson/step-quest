import { useResourceActions } from "@/hooks/useResourceActions";
import { isAvailableAtom } from "@/state/pedometer";
import { resourcesAtom } from "@/state/resources";
import { bankedStepsAtom } from "@/state/stepbank";
import { useAtomValue } from "jotai";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const bank = useAtomValue(bankedStepsAtom);
  const resource = useAtomValue(resourcesAtom);
  const isAvailable = useAtomValue(isAvailableAtom);
  const { handleChopWood } = useResourceActions();

  return (
    <View style={styles.container}>
      <Text>pedometer available: {String(isAvailable)}</Text>
      <Text>stepbank: {bank}</Text>
      <Text>wood: {resource.wood}</Text>

      <Pressable onPress={() => handleChopWood()}>
        <Text>chop wood</Text>
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
