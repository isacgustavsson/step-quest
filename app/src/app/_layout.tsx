import { useResourceTracking } from "@/hooks/useResourceTracking";
import { useStepTracking } from "@/hooks/useStepTracking";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    monogram: require("@assets/fonts/monogram.ttf"),
  });

  if (!loaded) return null;

  useStepTracking();
  useResourceTracking();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
