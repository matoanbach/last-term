import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="SettingsScreen1" />
      <Stack.Screen name="SettingsScreen2" />
    </Stack>
  );
}
