import { useSimulateSteps } from "@/hooks/useSimulateSteps";
import { resetProgressAtom } from "@/state/settings";
import { colors, styles } from "@/styles/main";
import { Image } from "expo-image";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

const sprites = {
  ruins: require("@assets/img/ruins.jpg"),
};

export default function Settings() {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const addSteps = useSimulateSteps();

  const resetProgress = useSetAtom(resetProgressAtom);

  const amount = parseInt(input, 10);
  const isValid = !isNaN(amount) && amount > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    addSteps.handleSimulateSteps(amount);
    setInput("");
    Keyboard.dismiss();
  };

  const handleClearBank = () => {
    resetProgress();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.card, { alignItems: "center" }]}>
          <Text style={styles.text}>Settings</Text>

          <View style={{ width: "100%", height: 200, overflow: "hidden" }}>
            <Image
              source={sprites.ruins}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            ></Image>
          </View>

          <View style={[styles.rowBetween, { justifyContent: "flex-end" }]}>
            <View style={[styles.row, { gap: 4 }]}>
              <Text style={[styles.text, { paddingRight: 12 }]}>add steps</Text>

              <TextInput
                style={[styles.input, styles.button]}
                value={input}
                onChangeText={setInput}
                placeholder={isFocused ? "" : "amount.."}
                placeholderTextColor={colors.textMuted}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="number-pad"
              />

              <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.text}>add</Text>
              </Pressable>
            </View>
          </View>

          <View
            style={[
              styles.row,
              {
                width: "100%",
                alignSelf: "flex-end",
                gap: 12,
              },
            ]}
          >
            <Pressable style={styles.button} onPress={() => handleClearBank()}>
              <Text style={styles.text}>clear storage</Text>
            </Pressable>
            <Text
              style={[
                styles.textWarning,
                {
                  flex: 1,
                  alignSelf: "flex-start",
                },
              ]}
            >
              Warning: clearing storage will not only remove all the steps from
              the bank but also your progress..
            </Text>
          </View>

          <View
            style={[
              styles.row,
              {
                width: "100%",
                alignSelf: "flex-end",
                gap: 12,
              },
            ]}
          ></View>
        </View>
      </View>
    </>
  );
}
