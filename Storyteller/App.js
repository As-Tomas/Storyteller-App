import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import AppNavigation from './src/navigation';
import { apiCall, chatgptApiCall } from './src/api/openAI';



function App() {

  useEffect(()=>{
    // chatgptApiCall('tell me a fairy tale about redhead')
  })

  return (
    <AppNavigation/>
  );
}

export default App;