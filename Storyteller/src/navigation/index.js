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
  const [data, setData] = useState(null);       

  // if (!data) {
  //   return null; // or a loading spinner
  // }

  useEffect(() => {
    (async () => {
      // Check for internet connectivity
      // const netInfo = await NetInfo.fetch();
      // if (!netInfo.isConnected) {
      //   console.log('No internet connection');
      //   Alert.alert(
      //     'No internet connection',
      //     'Please check your internet connection and try again.',
      //   );

      //   return;
      // }

      const storedData = await readData('userData');
      console.log('storedData1', storedData);
      setData(storedData);
    })();
  }, []);

  const updateData = (newData) => {
    setData(newData);
  };

  return (
    <NavigationContainer>
      <DataContext.Provider value={{ data, update: updateData }}>
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
