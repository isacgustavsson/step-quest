// app/item/[label].tsx
import { inventoryAtom } from "@/state/crafting";
import { RESOURCE_ICONS } from "@/state/resourceIcons";
import { resourcesAtom } from "@/state/resources";
import { colors, styles } from "@/styles/main";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { Pressable, Text, View } from "react-native";

export default function ItemDetail() {
  const params = useLocalSearchParams<{ label: string }>();
  const label = Array.isArray(params.label) ? params.label[0] : params.label;
  const router = useRouter();

  const inventory = useAtomValue(inventoryAtom);
  const resources = useAtomValue(resourcesAtom);

  const inventoryEntry = label ? inventory[label] : undefined;
  const resourceAmount = label ? resources[label] : undefined;
  const isResource = resourceAmount !== undefined;

  const amount = isResource ? resourceAmount : (inventoryEntry?.amount ?? 0);
  const icon = isResource ? RESOURCE_ICONS[label ?? ""] : inventoryEntry?.icon;

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
        {icon && (
          <Image
            source={icon}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        )}
      </View>

      <Text style={[styles.text, { fontSize: 32, marginBottom: 12 }]}>
        {label}
      </Text>
      <Text style={[styles.text, { fontSize: 24, color: colors.textMuted }]}>
        {isResource ? "Resource" : "Crafted item"} · x{amount}
      </Text>
    </View>
  );
}
