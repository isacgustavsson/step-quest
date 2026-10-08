import { ListDivider } from "@/components/actionCard";
import { inventoryAtom } from "@/state/crafting";
import { RESOURCE_ICONS } from "@/state/resourceIcons";
import { resourcesAtom } from "@/state/resources";
import { colors, styles } from "@/styles/main";
import { Image, ImageSource } from "expo-image";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { Pressable, ScrollView, Text, View } from "react-native";

type InventoryListItem = {
  label: string;
  amount: number;
  icon?: ImageSource | number;
};

const Tile = ({ item }: { item: InventoryListItem }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/details/[label]",
          params: { label: item.label },
        })
      }
      style={[
        styles.tile,
        { justifyContent: "space-between", paddingVertical: 12 },
      ]}
    >
      <View style={{ width: 42, height: 42 }}>
        {item.icon && (
          <Image
            source={item.icon}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        )}
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
      <Tile key={item.label} item={item} />
    ))}
  </View>
);

export default function Inventory() {
  const inventory = useAtomValue(inventoryAtom);
  const resources = useAtomValue(resourcesAtom);

  const items: InventoryListItem[] = Object.entries(inventory).map(
    ([label, entry]) => ({ label, amount: entry.amount, icon: entry.icon }),
  );

  const resourceItems: InventoryListItem[] = Object.entries(resources)
    .filter(([, amount]) => amount > 0)
    .map(([label, amount]) => ({
      label,
      amount,
      icon: RESOURCE_ICONS[label],
    }));

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
