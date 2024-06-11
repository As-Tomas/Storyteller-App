import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import BlurredHeaderBackground from '../components/navigation/BlurredHeaderBackground';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="ChildScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="ParentScreen"
        options={{
          headerBackground: () => <BlurredHeaderBackground />,
          title: 'Define stories settings',
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
            color: 'white',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="HistoryScreen"
        options={{
          headerBackground: () => <BlurredHeaderBackground />,

          title: 'Your History',
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerTitleStyle: { fontSize: 30, color: '#FEF9C3' },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
