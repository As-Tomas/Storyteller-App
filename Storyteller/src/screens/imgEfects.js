import React, {useState, useEffect, useRef} from 'react';
import {
  Animated,
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import {useSseEventSource} from '../api/SseEventSource';

export const YourComponent = () => {
  const [storyImg, setStoryImg] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [previousImage, setPreviousImage] = useState('');
  const fadeOutPreviousImage = useRef(new Animated.Value(1)).current;
  const fadeInCurrentImage = useRef(new Animated.Value(0)).current;

  const prompt =
    'Burstner 2018 year futuristic caravan in winter time in mountains --ar 9:16';

  const changeImages = () => {
    console.log('firskkt');
    if (storyImg !== currentImage) {
      setPreviousImage(currentImage);
      setCurrentImage(storyImg);

      // Reset the animation values
      fadeOutPreviousImage.setValue(1);
      fadeInCurrentImage.setValue(0);
    }
  };

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

  // const fadeAnim = useRef(new Animated.Value(1)).current;

  // const fadeIn = () => {
  //     // Will change fadeAnim value to 1 in 5 seconds
  //     Animated.timing(fadeAnim, {
  //       toValue: 1,
  //       duration: 5000,
  //       useNativeDriver: true,
  //     }).start();
  //   };

  //   const fadeOut = () => {
  //     // Will change fadeAnim value to 0 in 3 seconds
  //     Animated.timing(fadeAnim, {
  //       toValue: 0,
  //       duration: 3000,
  //       useNativeDriver: true,
  //     }).start();
  //   };

  return (
    <>
      <View className=" mx-auto my-auto relative     ">
        <Animated.View>
          {/* <Animated.Image
                     source={{ uri: previousImage }}
                     style={{ opacity: fadeAnim, width: 100, height: 100 }}
                     /> */}

          {/* <Animated.Image source={{ uri: storyImg }} style={{ opacity: fadeAnim, width: 100, height: 100 }} /> */}

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

          <TouchableOpacity
            className="w-20 h-20 absolute top-20"
            onPress={changeImages}>
            <Text className=" text-white text-xl mx-auto my-auto">
              Change Images
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
};
