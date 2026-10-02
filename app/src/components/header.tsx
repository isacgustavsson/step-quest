import { isAvailableAtom } from "@/state/pedometer";
import { resourcesAtom } from "@/state/resources";
import { bankedStepsAtom } from "@/state/stepbank";
import { Image } from "expo-image";
import { useAtomValue } from "jotai";
import { Text, View } from "react-native";

const sprites = {
  player: require("@assets/app/player.png"),
  coin: require("@assets/app/fc136.png"),
  wood: require("@assets/app/fc202.png"),
  stone: require("@assets/app/fc212.png"),
};

export const HeaderComponent = () => {
  const bank = useAtomValue(bankedStepsAtom);
  const resource = useAtomValue(resourcesAtom);
  const isAvailable = useAtomValue(isAvailableAtom);

  return (
    <>
      {/* <Text>pedometer available: {String(isAvailable)}</Text> */}
      <View
        style={{
          flexDirection: "row",
          borderWidth: 1,
          width: "100%",
          padding: 20,
          gap: 12,
          marginBottom: 12,
        }}
      >
        <View>
          <Image
            source={sprites.player}
            style={{ width: 72, height: 72 }}
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
            <Text style={{ fontSize: 14, fontWeight: 500 }}>Player Name</Text>
            <Text style={{ fontSize: 14, fontWeight: 500 }}>Level 0</Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Image
                source={sprites.coin}
                style={{ width: 16, height: 16 }}
              ></Image>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>{bank}</Text>
            </View>
          </View>

          <View style={{ gap: 4 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Resources
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Image
                source={sprites.wood}
                style={{ width: 16, height: 16 }}
              ></Image>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>
                {resource.wood}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Image
                source={sprites.stone}
                style={{ width: 16, height: 16 }}
              ></Image>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>
                {resource.stone}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
