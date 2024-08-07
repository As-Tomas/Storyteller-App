import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CildScreen from '../screens/CildScreen';
import ParentScreen from '../screens/ParentScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import StoryScreen from '../screens/StoryScreen';
import HistoryScreen from '../screens/HistoryScreen';

import DataContext from '../components/DataContext';
import { readData } from '../components/readWriteData';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const [userSettings, setUserSettings] = useState(null);       

  // if (!data) {
  //   return null; // or a loading spinner
  // }

  useEffect(() => {
    (async () => {     
      const storedData = await readData('userData');
      console.log('storedData1', storedData);
      setUserSettings(storedData);
    })();
  }, []);

  const updateUserSettings = (newData) => {
    setUserSettings(newData);
  };

  return (
    <NavigationContainer>
      <DataContext.Provider value={{ userSettings, update: updateUserSettings }}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Welcome">
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Story" component={StoryScreen} />
        <Stack.Screen name="Cild" component={CildScreen} />
        <Stack.Screen name="Parent" component={ParentScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      </Stack.Navigator>
      </DataContext.Provider>
    </NavigationContainer>
  );
}

export default AppNavigation;
