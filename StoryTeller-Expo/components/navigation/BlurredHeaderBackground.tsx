import React from 'react';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';

//! Todo: Bug (white scr) fix for android cos Experimental
const BlurredHeaderBackground = () => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 30 : 100}
        tint={Platform.OS === 'ios' ? 'light' : 'dark'}
        experimentalBlurMethod={Platform.OS === 'ios' ? 'dimezisBlurView' : 'none'}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   borderBottomWidth: 1, borderBlockColor: '#d2d2d2',
  },
});

export default BlurredHeaderBackground;
