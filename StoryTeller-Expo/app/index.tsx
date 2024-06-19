import { router } from 'expo-router';
import { Image, ImageBackground, TouchableOpacity, StyleSheet, Platform, View, Text, Button } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { useSettingsStore } from '../utils/Store/settingsStore';
import { useEffect } from 'react';
import ButtonActionStyled from '@/components/ButtonActionStyled';
import { AntDesign } from '@expo/vector-icons';

export default function Index() {
  const { setRecentStory } = useSettingsStore((state) => ({
    setRecentStory: state.setRecentStory,
  }));

  useEffect(() => {
    setRecentStory('');
  }, []);

  return (
    <ImageBackground source={require('@/assets/images/boy_with_book.png')} className="flex-1 ">
      <View className=" flex-1 justify-between">
        <View className="flex items-center justify-center ">
          <Text className="text-yellow-100 font-bold tracking-widest py-6" style={{ fontSize: wp(10) }}>
            Storyteller
          </Text>
          <Text className="text-yellow-100 leading-6 mx-10 text-center" style={{ fontSize: wp(4.5) }}>
            Create unique inspirational, motivated stories for your child based on their favorite characters
          </Text>
        </View>
        <View className="flex items-center mb-8">
          <ButtonActionStyled text="I’m child" onPress={() => router.push('ChildScreen')} />
          <ButtonActionStyled text="I’m parent" onPress={() => router.push('ParentScreen')} />
          <ButtonActionStyled text="Library" onPress={() => router.push('LibraryScreen')} />

          <TouchableOpacity
            onPress={() => router.push('HistoryScreen')}
            className="flex flex-row m-2 py-2 rounded-full items-center justify-center "
            style={{ width: wp(55) }}>
            <Text className="text-yellow-100 font-semibold " style={{ fontSize: wp(5) }}>
              View history
            </Text>

            <AntDesign
              name="arrowright"
              size={24}
              color="#FEF9C3"
              style={{ marginLeft: 8, marginRight: 8, marginTop: 'auto', marginBottom: 'auto' }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
