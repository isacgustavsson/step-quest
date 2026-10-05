import { resourcesAtom } from "@/state/resources";
import { bankedStepsAtom } from "@/state/stepbank";
import { colors, styles } from "@/styles/main";
import { Image } from "expo-image";
import { useAtomValue } from "jotai";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const sprites = {
  player: require("@assets/icons/player.png"),
  coin: require("@assets/icons/coins.png"),
  wood: require("@assets/icons/wood.png"),
  stone: require("@assets/icons/stone.png"),
};

export const HeaderComponent = () => {
  const bank = useAtomValue(bankedStepsAtom);
  const resource = useAtomValue(resourcesAtom);
  // const isAvailable = useAtomValue(isAvailableAtom);

  return (
    <>
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: colors.background }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            flexDirection: "row",
            width: "100%",
            padding: 12,
            gap: 12,
            marginBottom: 12,
          }}
        >
          <View>
            <Image
              source={sprites.player}
              style={{
                borderWidth: 1,
                borderColor: colors.cardBorder,
                width: 72,
                height: 72,
              }}
            ></Image>
          </View>

          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <View style={{ gap: 4 }}>
              <Text style={styles.text}>Player Name</Text>
              <Text style={styles.text}>Level 0</Text>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Image
                  source={sprites.coin}
                  style={{ width: 16, height: 16 }}
                ></Image>
                <Text style={styles.text}>{bank}</Text>
              </View>
            </View>

            <View style={{ gap: 4 }}>
              <Text style={styles.text}>Resources</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Image
                  source={sprites.wood}
                  style={{ width: 16, height: 16 }}
                ></Image>
                <Text style={styles.text}>{resource.wood}</Text>
              </View>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Image
                  source={sprites.stone}
                  style={{ width: 16, height: 16 }}
                ></Image>
                <Text style={styles.text}>{resource.stone}</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
