import { useSaveGame } from "@/hooks/useSaveGame";
import { useStepTracking } from "@/hooks/useStepTracking";
import { colors } from "@/styles/main";
import { useFonts } from "expo-font";
import { DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const hydrated = useSaveGame();
  useStepTracking();

  const [loaded] = useFonts({
    monogram: require("@assets/fonts/monogram.ttf"),
  });

  // spelet visas först när sparfilen är inläst
  if (!loaded || !hydrated) return null;

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
          {/* öppnas som en modal över inventoryt */}
          <Stack.Screen
            name="details/[id]"
            options={{
              presentation: "transparentModal",
              animation: "fade",
              headerShown: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
