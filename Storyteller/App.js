import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import AppNavigation from './src/navigation';
import { apiCall, chatgptApiCall } from './src/api/openAI';

//Todo Ability to cancel request to api while loading
//Todo change UI for back btn to be more visible
//Todo change TTS speed
//Todo uncoment FlipperOkhttpInterceptor making SSE not working android/app/src/debug/java/com/<projectname>/ReactNativeFlipper.java


function App() {

  useEffect(()=>{
    // chatgptApiCall('tell me a fairy tale about redhead')
  })

  return (
    <AppNavigation/>
  );
}

export default App;