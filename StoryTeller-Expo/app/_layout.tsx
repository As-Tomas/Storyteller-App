import { Stack } from "expo-router";
import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// import { View, ActivityIndicator } from 'react-native';

// import { readData } from '../components/readWriteData';
// import DataContext from "@/components/DataContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  // const [settings, setSettings] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadSettings = async () => {
  //     const loadedSettings = await readData('settingsData');
  //     setSettings(loadedSettings);
  //     setLoading(false);
  //   };

  //   loadSettings();
  // }, []);


  // if (loading) {
  //   return <ActivityIndicator size="large" color="#0000ff" />;
  // }


  return (
    // <DataContext.Provider value={{ settings }}>

    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="ChildScreen" options={{ headerShown: false }}/>
      {/* <Stack.Screen name="ParentScreen" options={{ headerShown: false }}/> */}
    </Stack>
    // </DataContext.Provider>
  );
}
