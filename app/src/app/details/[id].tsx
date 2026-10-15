// app/details/[id].tsx
import { ITEMS } from "@/data/items";
import { RESOURCES } from "@/data/resources";
import { inventoryAtom } from "@/state/crafting";
import { resourcesAtom } from "@/state/resources";
import { colors, styles } from "@/styles/main";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { Pressable, Text, View } from "react-native";

export default function ItemDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const inventory = useAtomValue(inventoryAtom);
  const resources = useAtomValue(resourcesAtom);

  // id:n är unika för både resurser och föremål
  const resource = id ? RESOURCES[id] : undefined;
  const item = id ? ITEMS[id] : undefined;
  const entry = resource ?? item;

  const amount = (resource ? resources[id] : inventory[id]) ?? 0;

  return (
    <View
      style={[
        styles.container,
        { alignItems: "center", justifyContent: "center" },
      ]}
    >
      <Pressable
        onPress={() => router.back()}
        style={{ position: "absolute", top: 64, left: 24 }}
      >
        <Text style={styles.text}>← back</Text>
      </Pressable>

      <View style={{ width: 120, height: 120, marginBottom: 24 }}>
        {entry && (
          <Image
            source={entry.icon}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        )}
      </View>

      <Text style={[styles.text, { fontSize: 32, marginBottom: 12 }]}>
        {entry?.label ?? "unknown"}
      </Text>
      <Text style={[styles.text, { fontSize: 24, color: colors.textMuted }]}>
        {resource ? "Resource" : "Crafted item"} · x{amount}
      </Text>
    </View>
  );
}
