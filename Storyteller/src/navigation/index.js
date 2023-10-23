import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CildScreen from '../screens/CildScreen';
import ParentScreen from '../screens/ParentScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import StoryScreen from '../screens/StoryScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Welcome">
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Story" component={StoryScreen} />
        <Stack.Screen name="Cild" component={CildScreen} />
        <Stack.Screen name="Parent" component={ParentScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
