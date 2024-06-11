import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated, Button, StyleSheet } from 'react-native';

interface FadingButtonProps {
  text: string;
  onPress: () => void;
}
//! This component creates issueas with touches of screen, find problem beafore use
const FadingButton: React.FC<FadingButtonProps> = ({ text, onPress }) => {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleUserInteraction = () => {
    setIsButtonVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setIsButtonVisible(false));
    }, 3000);
  };

  return (
    <TouchableWithoutFeedback onPress={handleUserInteraction}>
      <View style={styles.container}>
        {isButtonVisible && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Button title={text} onPress={onPress} />
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FadingButton;
