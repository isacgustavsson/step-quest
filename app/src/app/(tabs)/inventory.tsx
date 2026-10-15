import { InventoryGrid } from "@/components/inventoryGrid";
import { inventoryGridAtom, moveSlotAtom } from "@/state/inventory";
import { colors, styles } from "@/styles/main";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Inventory() {
  const router = useRouter();
  const slots = useAtomValue(inventoryGridAtom);
  const moveSlot = useSetAtom(moveSlotAtom);
  // ingen scrollning medan en sak dras
  const [dragging, setDragging] = useState(false);

  const isEmpty = slots.every((slot) => slot === null);

  // info och drop finns i modal-routen details/[id]
  const openDetails = useCallback(
    (id: string) => router.push({ pathname: "/details/[id]", params: { id } }),
    [router],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ width: "100%", padding: 12 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        scrollEnabled={!dragging}
      >
        <Text style={[styles.text, { marginBottom: 24, alignSelf: "center" }]}>
          inventory
        </Text>

        <View style={{ width: "100%", height: 200, overflow: "hidden" }}>
          <Image
            source={require("@assets/img/inventory.png")}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          ></Image>
        </View>

        <Text
          style={[
            styles.text,
            { marginVertical: 12, alignSelf: "center", fontSize: 14 },
            { color: colors.textMuted },
          ]}
        >
          {isEmpty
            ? "Your inventory is empty"
            : "hold an item to drag it to another slot"}
        </Text>

        <InventoryGrid
          slots={slots}
          onMove={moveSlot}
          onOpen={openDetails}
          onDragStateChange={setDragging}
        />
      </ScrollView>
    </View>
  );
}
