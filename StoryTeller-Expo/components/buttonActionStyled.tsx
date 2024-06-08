import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

interface ButtonProps {
  text: string;
  onPress: () => void;
}

export default function ButtonActionStyled({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <LinearGradient colors={['#eab515', '#F3A467', '#e1851e']} style={styles.gradient}>
        <Text style={styles.text}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    // paddingVertical: 12,
    borderRadius: 24,
    width: 200,
    height: 48,
    borderWidth: 1,
    borderColor: '#F3A467',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
