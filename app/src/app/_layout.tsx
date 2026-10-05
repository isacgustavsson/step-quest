import { useResourceTracking } from "@/hooks/useResourceTracking";
import { useStepTracking } from "@/hooks/useStepTracking";
import { colors } from "@/styles/main";
import { useFonts } from "expo-font";
import { DefaultTheme, Stack, ThemeProvider } from "expo-router";

export default function RootLayout() {
  useStepTracking();
  useResourceTracking();

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
      </Stack>
    </ThemeProvider>
  );
}
