import { HeaderComponent } from "@/components/header";
import { colors } from "@/styles/main";
import { Image, ImageSource } from "expo-image";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Tab = {
  name: string;
  title: string;
  icon: ImageSource | number;
  size?: number;
  // flyttar fliken i sidled för att den ska se jämnt placerad ut
  offsetX?: number;
};

const TABS: Tab[] = [
  {
    name: "index",
    title: "Home",
    icon: require("@assets/icons/home.png"),
  },
  {
    name: "crafting",
    title: "Crafting",
    icon: require("@assets/icons/anvil.png"),
    offsetX: -6,
  },
  {
    name: "map",
    title: "Map",
    icon: require("@assets/icons/player.png"),
  },
  {
    name: "inventory",
    title: "Inventory",
    icon: require("@assets/icons/chest.png"),
  },
  {
    name: "settings",
    title: "Settings",
    icon: require("@assets/icons/settings.png"),
  },
];

type TabIconProps = {
  source: ImageSource | number;
  size?: number;
  focused: boolean;
};

const ICON_SIZE = 32;
const TAB_BAR_HEIGHT = 64;
const DEFAULT_TAB_BAR_HEIGHT = 64;

const ITEM_STYLE = {
  alignItems: "center",
  justifyContent: "center",
  paddingTop: 14 + (TAB_BAR_HEIGHT - DEFAULT_TAB_BAR_HEIGHT),
} as const;

const TabIcon = ({ source, size = ICON_SIZE, focused }: TabIconProps) => (
  <Image
    source={source}
    style={{ width: size, height: size, opacity: focused ? 1 : 0.5 }}
  />
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        header: () => <HeaderComponent />,

        tabBarStyle: {
          backgroundColor: colors.background,
          height: TAB_BAR_HEIGHT + insets.bottom,
        },

        tabBarIconStyle: {
          width: ICON_SIZE,
          height: ICON_SIZE + 8,
          paddingBottom: 8,
        },

        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: "monogram",
        },

        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarItemStyle: [
              ITEM_STYLE,
              { transform: [{ translateX: tab.offsetX ?? 0 }] },
            ],
            tabBarIcon: ({ focused }) => (
              <TabIcon source={tab.icon} size={tab.size} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
