import { HeaderComponent } from "@/components/header";
import { useInventoryTracking } from "@/hooks/useInventoryTracking";
import { useMapTracking } from "@/hooks/useMapTracking";
import { useNodeTracking } from "@/hooks/useNodeTracking";
import { usePlayerTracking } from "@/hooks/usePlayerTracking";
import { useResourceTracking } from "@/hooks/useResourceTracking";
import { useStepTracking } from "@/hooks/useStepTracking";
import { colors } from "@/styles/main";
import { useFonts } from "expo-font";
import { DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  useStepTracking();
  useResourceTracking();
  usePlayerTracking();
  useInventoryTracking();
  useMapTracking();
  useNodeTracking();

  const [loaded] = useFonts({
    monogram: require("@assets/fonts/monogram.ttf"),
  });

  if (!loaded) return null;

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.card,
      card: colors.card,
      text: colors.text,
      border: "transparent",
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="details/[label]"
            options={{ header: () => <HeaderComponent /> }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
