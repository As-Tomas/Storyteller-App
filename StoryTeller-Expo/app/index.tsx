import { router } from 'expo-router';
import { Image,  ImageBackground, TouchableOpacity, StyleSheet, Platform, View, Text, Button } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Index() {

  

  return (
    <ImageBackground
      source={require('@/assets/images/boy_with_book.png')}
      className="flex-1 ">
      <View className=" flex-1 justify-between">
        <View className="flex items-center justify-center ">
          <Text
            className="text-yellow-100 font-bold tracking-widest py-6"
            style={{fontSize: wp(10)}}
            >
            Storyteller
          </Text>
          <Text
            className="text-yellow-100 leading-6 mx-10 text-center"
            style={{fontSize: wp(4.5)}}
            >
            Create unique inspirational, motivated stories for your child based
            on their favorite characters
          </Text>
        </View>
        <View className="flex items-center mb-8">
          <TouchableOpacity
            onPress={() => router.push('ChildScreen')}
            className="bg-[#F3A467] m-2 py-2 rounded-full flex items-center justify-center"
            style={{width: wp(55)}}
            >
            <Text
              className="text-yellow-100 font-semibold"
              style={{fontSize: wp(5)}}
              >
              I’m child
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={() => router.push('ParentScreen')}
            className="bg-[#F3A467] m-2 py-2 rounded-full flex items-center justify-center"
            style={{width: wp(55)}}
            >
            <Text
              className="text-yellow-100 font-semibold"
              style={{fontSize: wp(5)}}
              >
              I’m parent
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={() => navigation.navigate('History')}
            className="flex flex-row m-2 py-2 rounded-full items-center justify-center "
            style={{width: wp(55)}}
            >
            <Text
              className="text-white font-semibold "
              style={{fontSize: wp(5)}}
              >
              View history
            </Text>
            <Image
              source={require('@/assets/elements/arrow_forward.png')}
              className=" mx-2 my-auto"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
