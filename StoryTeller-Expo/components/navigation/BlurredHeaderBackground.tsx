import React from 'react';
import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';

const BlurredHeaderBackground = () => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} experimentalBlurMethod='dimezisBlurView'/>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
   
  });
 
  

export default BlurredHeaderBackground;
