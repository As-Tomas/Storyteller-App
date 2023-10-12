import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

export default function CildScreen() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 bg-fuchsia-800 items-center justify-center relative">
      <TouchableOpacity onPress={()=> navigation.navigate('Welcome')} className="absolute top-6 left-4 flex-row items-center justify-center">
        <Image
          source={require('../../assets/elements/arrow_back.png')}
          style={{width: hp(2), height: hp(2)}}
        />
        <Text className="text-yellow-100"
        tyle={{fontSize: wp(2)}}>Start</Text>
      </TouchableOpacity>

      <Text
        className="text-yellow-100 mx-10 text-center"
        style={{fontSize: wp(9)}}>
        Tell what story you would like to hear?
      </Text>

      <TouchableOpacity className="absolute bottom-12">
        <Image
          className="rounded-full"
          source={require('../../assets/elements/micIcon.png')}
          style={{width: hp(10), height: hp(10)}}
        />
      </TouchableOpacity>
    </View>
  );
}
