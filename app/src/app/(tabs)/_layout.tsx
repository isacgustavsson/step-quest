import { Image } from "expo-image";
import { Tabs } from "expo-router";

const icons = {
  home: require("@assets/app/fc35.png"),
};

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#2b2b2b",
            height: 80,
            borderTopWidth: 0,
          },
          tabBarItemStyle: {
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 8,
          },
          tabBarIconStyle: {
            width: 32,
            height: 32,
            paddingBottom: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
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
              <Image source={icons.home} style={{ width: 32, height: 32 }} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
