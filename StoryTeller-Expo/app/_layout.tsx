import { Stack } from "expo-router";
import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { View, ActivityIndicator } from 'react-native';

import { readData } from '../components/readWriteData';
import DataContext from "@/components/DataContext";
import { UserSettingsProvider } from "@/components/UserSettingsContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  


  return (
    <UserSettingsProvider>

    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="ChildScreen" options={{ headerShown: false }}/>
      <Stack.Screen name="ParentScreen" options={{ headerShown: false }}/>
    </Stack>
    </UserSettingsProvider>
  );
}
