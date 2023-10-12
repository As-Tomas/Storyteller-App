import {View, Text, ImageBackground, Image} from 'react-native';
import React from 'react';

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={require('../../assets/img/boy_with_book.png')}
      className="flex-1 ">

      <View className=" flex-1 justify-between">
        
      <View className="flex items-center justify-center ">
        <Text className="text-yellow-100 font-bold text-4xl py-7">
          Storyteller
        </Text>
        <Text className="text-yellow-100 text-base  mx-10 text-center">
          Create unique inspirational, motivated stories for your child based on
          their favorite characters
        </Text>
      </View>
      <View className="flex items-center mb-8">
    <View className="bg-[#F3A467] m-2 py-2 rounded-full w-52 flex items-center justify-center">
        <Text className="text-yellow-100 text-lg font-semibold">I’m child</Text>
    </View>

        <View className="bg-[#F3A467] m-2 py-2 rounded-full w-52 flex items-center justify-center">
            <Text className="text-yellow-100 text-lg font-semibold">I’m parent</Text>
        </View>
        <View className="flex flex-row pt-5 " >
            <Text className="text-white text-lg font-semibold  ">View history</Text>
            <Image source={require('../../assets/elements/arrow_forward.png')} className=" mx-2 my-auto"/>
        </View>
      </View>
        </View>  
    </ImageBackground>
  );
}
