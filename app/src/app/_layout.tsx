import { useStepTracking } from "@/hooks/useStepTracking";
import { Stack } from "expo-router";

export default function RootLayout() {
  useStepTracking();

  return <Stack />;
}
