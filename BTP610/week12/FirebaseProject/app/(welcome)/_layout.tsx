// app/_layout.tsx

import { HeaderShownContext } from "@react-navigation/elements";
import { Stack } from "expo-router";
import React from "react";

export default function Welcome() {
  return <Stack >
    <Stack.Screen name="(tabs)" options={headerShown: false} />
  </Stack>;
}
