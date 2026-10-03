import { HeaderComponent } from "@/components/header";
import { Image } from "expo-image";
import { Tabs } from "expo-router";

const icons = {
  home: require("@assets/icons/home.png"),
  settings: require("@assets/icons/settings.png"),
  crafting: require("@assets/icons/anvil.png"),
};

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          header: () => <HeaderComponent />,
          headerTitleStyle: { color: "#fff" },

          tabBarItemStyle: {
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 12,
          },

          tabBarIconStyle: {
            width: 32,
            height: 32,
            paddingBottom: 12,
          },

          tabBarLabelStyle: {
            fontSize: 18,
            fontFamily: "monogram",
          },

          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#888",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: () => (
              <Image source={icons.home} style={{ width: 36, height: 36 }} />
            ),
          }}
        />

        <Tabs.Screen
          name="crafting"
          options={{
            title: "Crafting",
            tabBarIcon: () => (
              <Image
                source={icons.crafting}
                style={{ width: 36, height: 36 }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: () => (
              <Image
                source={icons.settings}
                style={{ width: 36, height: 36 }}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
