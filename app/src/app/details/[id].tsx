// app/details/[id].tsx
// visas som en modal över inventoryt, se _layout.tsx
import { Backdrop } from "@/components/recipeModal";
import { getEntry } from "@/data/entries";
import { inventoryAtom } from "@/state/crafting";
import { dropEntryAtom } from "@/state/inventory";
import { resourcesAtom } from "@/state/resources";
import { colors, styles } from "@/styles/main";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

// luft mellan texten och drop, utöver kortets gap
const DROP_SPACING = 16;

export default function ItemDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const inventory = useAtomValue(inventoryAtom);
  const resources = useAtomValue(resourcesAtom);
  const dropEntry = useSetAtom(dropEntryAtom);
  // drop slänger allt, så det bekräftas i ett andra steg
  const [confirming, setConfirming] = useState(false);

  const entry = id ? getEntry(id) : undefined;
  const isResource = entry?.kind === "resource";
  const amount = (isResource ? resources[id] : inventory[id]) ?? 0;

  // inget att visa, t.ex. ett okänt id eller något som just slängts.
  // Stänger också modalen efter drop
  const missing = !entry || amount <= 0;
  // bara en gång, så att inte skärmen bakom också stängs
  const closed = useRef(false);
  useEffect(() => {
    if (!missing || closed.current || !router.canGoBack()) return;
    closed.current = true;
    router.back();
  }, [missing, router]);

  const close = () => router.back();

  const drop = () => {
    dropEntry(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <Backdrop onPress={close}>
      {entry && !missing && (
        // fångar trycket så att modalen inte stängs vid tryck på kortet
        <Pressable style={[styles.card, { alignItems: "center", gap: 16 }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.text, { fontSize: 32 }]}>{entry.label}</Text>
            <Pressable onPress={close} hitSlop={20}>
              <Text style={[styles.text, { color: colors.textMuted }]}>x</Text>
            </Pressable>
          </View>

          <Image
            source={entry.icon}
            style={{ width: 96, height: 96 }}
            contentFit="cover"
          />

          <Text style={[styles.text, { color: colors.textMuted }]}>
            {isResource ? "Resource" : "Crafted item"} x{amount}
          </Text>

          {entry.description && (
            <Text style={[styles.text, { textAlign: "center" }]}>
              {entry.description}
            </Text>
          )}

          {confirming ? (
            <View
              style={{
                width: "100%",
                gap: 12,
                alignItems: "center",
                marginTop: DROP_SPACING,
              }}
            >
              <Text style={[styles.text, { color: colors.danger }]}>
                drop all {amount} {entry.label}?
              </Text>
              <View style={[styles.row, { gap: 12 }]}>
                <Pressable
                  style={styles.button}
                  onPress={() => setConfirming(false)}
                >
                  <Text style={styles.text}>cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, { borderColor: colors.danger }]}
                  onPress={drop}
                >
                  <Text style={[styles.text, { color: colors.danger }]}>
                    drop
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={[styles.button, { marginTop: DROP_SPACING }]}
              onPress={() => setConfirming(true)}
            >
              <Text style={[styles.text, { color: colors.danger }]}>drop</Text>
            </Pressable>
          )}
        </Pressable>
      )}
    </Backdrop>
  );
}
