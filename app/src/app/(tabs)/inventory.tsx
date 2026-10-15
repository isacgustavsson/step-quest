import { ListDivider } from "@/components/actionCard";
import { ITEMS } from "@/data/items";
import { RESOURCES } from "@/data/resources";
import { Icon } from "@/data/types";
import { inventoryAtom } from "@/state/crafting";
import { resourcesAtom } from "@/state/resources";
import { colors, styles } from "@/styles/main";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { Pressable, ScrollView, Text, View } from "react-native";

type InventoryListItem = {
  id: string;
  label: string;
  amount: number;
  icon: Icon;
};

// det som finns i sparfilen men inte längre i data/ visas inte
const toListItems = (
  amounts: Record<string, number>,
  lookup: Record<string, { label: string; icon: Icon }>,
): InventoryListItem[] =>
  Object.entries(amounts).flatMap(([id, amount]) => {
    const entry = lookup[id];
    return entry && amount > 0
      ? [{ id, label: entry.label, amount, icon: entry.icon }]
      : [];
  });

const Tile = ({ item }: { item: InventoryListItem }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/details/[id]",
          params: { id: item.id },
        })
      }
      style={[
        styles.tile,
        { justifyContent: "space-between", paddingVertical: 12 },
      ]}
    >
      <View style={{ width: 42, height: 42 }}>
        <Image
          source={item.icon}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>

      <Text style={[styles.text, { fontSize: 14 }]} numberOfLines={1}>
        {item.label} x {item.amount}
      </Text>
    </Pressable>
  );
};

const TileGrid = ({ items }: { items: InventoryListItem[] }) => (
  <View
    style={[
      styles.row,
      {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        alignSelf: "flex-start",
        paddingVertical: 12,
      },
    ]}
  >
    {items.map((item) => (
      <Tile key={item.id} item={item} />
    ))}
  </View>
);

export default function Inventory() {
  const inventory = useAtomValue(inventoryAtom);
  const resources = useAtomValue(resourcesAtom);

  const items = toListItems(inventory, ITEMS);
  const resourceItems = toListItems(resources, RESOURCES);

  if (items.length === 0 && resourceItems.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Text style={[styles.text, { color: colors.textMuted }]}>
          Your inventory is empty
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ width: "100%", padding: 12 }}>
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

        {items.length > 0 && (
          <>
            <Text
              style={[
                styles.text,
                { fontSize: 18, marginVertical: 12, paddingHorizontal: 12 },
              ]}
            >
              Items
            </Text>
            <ListDivider />
            <TileGrid items={items} />
          </>
        )}

        {resourceItems.length > 0 && (
          <>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 18,
                  marginTop: 24,
                  marginBottom: 8,
                  paddingHorizontal: 12,
                },
              ]}
            >
              Resources
            </Text>
            <ListDivider />

            <TileGrid items={resourceItems} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
