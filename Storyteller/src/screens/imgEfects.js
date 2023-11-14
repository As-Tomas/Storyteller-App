import React, { useState, useEffect, useRef } from 'react';
import { Animated, ImageBackground, TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import {useSseEventSource} from '../api/SseEventSource';

export const YourComponent = () => {
    const [storyImg, setStoryImg] = useState('https://media.discordapp.net/attachments/1135873759962730528/1172990346674839572/tomasb_b04_Burstner_2018_year_caravan_in_vinter_time_in_mountai_b14cada4-1594-4c06-b485-805c07106d7e.png?ex=65625363&is=654fde63&hm=e37cc2baa9ba5a59022c5c0738be74ac7b110bdca32b8f99f5ecbea6c77f4e00&=&width=519&height=925');
    const [currentImage, setCurrentImage] = useState('https://cdn.discordapp.com/attachments/1135873759962730528/1172983609980887060/tomasb_b04_Burstner_2018_year_caravan_in_vinter_time_in_mountai_89864890-c42b-492e-806e-339ff77e7e39.png?ex=65624d1d&is=654fd81d&hm=7c4b1dcf9ee2d8774b806d879d752ac1657a3d0442e0f87131f704052bfbf18b&');
    const [previousImage, setPreviousImage] = useState('https://cdn.discordapp.com/attachments/1135873759962730528/1173632649127018517/tomasb_b04_Burstner_2018_year_caravan_in_vinter_time_in_mountai_904f2699-8c2b-4730-b085-1d0cb8833e30.png?ex=6564a994&is=65523494&hm=58bb84f88e450355db1d01a92c204c026a33c123cc48ab4fecb4c6e8d11ba063&');
    const fadeOutPreviousImage = useRef(new Animated.Value(1)).current;
    const fadeInCurrentImage = useRef(new Animated.Value(1)).current;

    const prompt = "Burstner 2018 year caravan in vinter time in mountains --ar 9:16";

    const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

    const changeImages =  () =>  {
        console.log('firskkt')
        if (storyImg !== currentImage) {
            setPreviousImage(currentImage);
            setCurrentImage(storyImg);
            
        }
    }

    // useEffect(() => {        
    //     const cleanup = useSseEventSource(setStoryImg, prompt);
    //     return cleanup;
      
    //   }, []);


    // Update images
    // useEffect(() => {
    //     if (storyImg !== currentImage) {
    //         setPreviousImage(currentImage);
    //         setCurrentImage(storyImg);
    //     }
    // }, [storyImg]);

    // Animate images
    // useEffect(() => {
        
    //         Animated.timing(fadeOutPreviousImage, {
    //             toValue: 0,
    //             duration: 4000,
    //             useNativeDriver: false,
    //         })
    // }, [currentImage]);

    const fadeAnim = useRef(new Animated.Value(1)).current;

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }).start();
      };
    
      const fadeOut = () => {
        // Will change fadeAnim value to 0 in 3 seconds
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }).start();
      };

      
    return (
        <>
        <View className=" mx-auto my-auto w-72  h-72 bg-slate-700 absolute  top-16 left-4 flex-row items-center justify-center  rounded-3xl ">
      <Text className="text-white text-xl  mx-auto my-auto">Storyteller</Text>

            <Animated.View
            style={{                
                opacity: fadeAnim,
            }}
            >
        
                
                    <Animated.Image
                        source={{ uri: previousImage }}
                        style={{  width: 100, height: 200 }}
                    />
                
                {/* <Animated.Image source={{ uri: storyImg }} style={{ opacity: fadeAnim, width: 100, height: 100 }} /> */}
                

                {/* {currentImage && (
                    <AnimatedImageBackground
                        source={{ uri: currentImage }}
                        style={{ opacity: fadeInCurrentImage, width: '50%', height: '50%' }}
                    />
                )} */}

                <TouchableOpacity className="w-20 h-20 absolute top-20" onPress={fadeOut}>
                    <Text className=" text-white text-xl  mx-auto my-auto">Change Images</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
        </>
    );
};