import React, {useState, useEffect, useRef} from 'react';
import {Animated, TouchableOpacity, View, Text} from 'react-native';
import {useSseEventSource} from '../api/SseEventSource';

export const YourComponent = () => {
  const [storyImg, setStoryImg] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [previousImage, setPreviousImage] = useState('');
  const fadeOutPreviousImage = useRef(new Animated.Value(1)).current;
  const fadeInCurrentImage = useRef(new Animated.Value(0)).current;

  const prompt =
    'Burstner 2018 year futuristic caravan in winter time in mountains --ar 9:16';

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
      <View className=" mx-auto my-auto relative  ">
        <Animated.View>
          {currentImage && (
            <Animated.Image
              source={{uri: currentImage}}
              style={{
                opacity: fadeInCurrentImage,
                position: 'absolute',
                width: 200,
                height: 200,
              }}
            />
          )}

          {previousImage && (
            <Animated.Image
              source={{uri: previousImage}}
              style={{
                opacity: fadeOutPreviousImage,
                position: 'absolute',
                width: 200,
                height: 200,
              }}
            />
          )}
        </Animated.View>
      </View>
    </>
  );
};
