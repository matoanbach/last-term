import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0a3d62",
        },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen name="signIn" options={{ title: "Sign In" }} />
      <Stack.Screen name="signUp" options={{ title: "Sign Up" }} />
    </Stack>
  );
}
