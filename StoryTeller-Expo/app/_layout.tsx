import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="ChildScreen" options={{ headerShown: false }} />
        <Stack.Screen name="ParentScreen" options={{ headerShown: false }} />
        <Stack.Screen name="HistoryScreen" options={{ headerShown: false }} />
        <Stack.Screen name="StoryScreen" options={{ headerShown: false }} />
      </Stack>    
  );
}
