import { HeaderComponent } from "@/components/header";
import { useInventoryTracking } from "@/hooks/useInventoryTracking";
import { usePlayerTracking } from "@/hooks/usePlayerTracking";
import { useResourceTracking } from "@/hooks/useResourceTracking";
import { useStepTracking } from "@/hooks/useStepTracking";
import { colors } from "@/styles/main";
import { useFonts } from "expo-font";
import { DefaultTheme, Stack, ThemeProvider } from "expo-router";

export default function RootLayout() {
  useStepTracking();
  useResourceTracking();
  usePlayerTracking();
  useInventoryTracking();

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
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="details/[label]"
          options={{ header: () => <HeaderComponent /> }}
        />
      </Stack>
    </ThemeProvider>
  );
}
