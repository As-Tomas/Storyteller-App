import React, {useState, useEffect, useRef} from 'react';
import {Animated, View} from 'react-native';
import {useSseEventSource} from '../apiCalls/SseEventSource';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const MidjourneyImg = ({prompt}) => {
  const [storyImg, setStoryImg] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [previousImage, setPreviousImage] = useState('');
  const fadeOutPreviousImage = useRef(new Animated.Value(1)).current;
  const fadeInCurrentImage = useRef(new Animated.Value(0)).current;

  // call Midjourney API
  useEffect(() => {
    const cleanup = useSseEventSource(setStoryImg, prompt);
    return cleanup;
  }, []);

  // Update images
  useEffect(() => {
    if (storyImg !== currentImage) {
      setPreviousImage(currentImage);
      setCurrentImage(storyImg);
      // Reset the animation values
      fadeOutPreviousImage.setValue(1);
      fadeInCurrentImage.setValue(0);
    }
  }, [storyImg]);

  //Animate images
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeOutPreviousImage, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeInCurrentImage, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentImage]);

  return (
    <>
      <View
        style={{
          position: 'relative',
          width: wp(85),
          height: hp(85),
          shadowColor: '#90ebf1',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 1,
          shadowRadius: 3.84,
          elevation: 14,
        }}>
        <Animated.View>
          {currentImage && (
            <Animated.Image
              source={{uri: currentImage}}
              style={{
                opacity: fadeInCurrentImage,
                position: 'absolute',
                width: wp(85),
                height: hp(85),
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 4,
              }}
            />
          )}

          {previousImage && (
            <Animated.Image
              source={{uri: previousImage}}
              style={{
                opacity: fadeOutPreviousImage,
                position: 'absolute',
                width: wp(85),
                height: hp(85),
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 4,
              }}
            />
          )}
        </Animated.View>
      </View>
    </>
  );
};
