import { View, Animated, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  image: string;
}

const ImageStoryView: React.FC<Props> = ({ image }) => {
  const fadeInCurrentImage = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (image) {
      fadeInCurrentImage.setValue(0); // Reset the animation value
      // Animate images
      Animated.timing(fadeInCurrentImage, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [image, fadeInCurrentImage]);

  return (
    <View style={styles.container}>
      {image ? (
        <Animated.Image
          source={{ uri: image }}
          style={[
            styles.image,
            {
              opacity: fadeInCurrentImage,
            },
          ]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(100), // Ensure full width for centering
    height: hp(85),
    shadowColor: '#90ebf1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 14,
  },
  image: {
    width: wp(85),
    height: hp(85),
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 4,
  },
});

export default ImageStoryView;