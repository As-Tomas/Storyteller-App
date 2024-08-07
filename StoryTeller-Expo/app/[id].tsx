import { View, Text, ScrollView } from 'react-native';
import React, { useCallback, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useHistoryStore } from '@/utils/Store/historyStore';
import PlaybackControls from '@/components/navigation/PlaybackControls';
import ImageStoryView from '@/components/ImageStoryView';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Tts from 'react-native-tts';
import ErrorHandler from '@/components/ErrorHandler';
import { useLibraryStoryStore } from '@/utils/Store/libraryPrevStory';
import TTSAudioComponent from '@/components/navigation/TTSAudioComponent';

const HistoryRecord = () => {
  const [speaking, setSpeaking] = useState(false);
  const { id: index } = useLocalSearchParams<{ id: string }>();
  const history = useHistoryStore((state) => state.history);

  const { libStory } = useLibraryStoryStore((state) => ({
    libStory: state.libStory,
  }));

  const [isVisible, setIsVisible] = useState(true);

  const recordId = index ? parseInt(index, 10) : undefined;

  let record;
  // library items id starts from 100 000 so we load from state
  if (recordId && recordId >= 99999) {
    record = libStory;
  } else {
    record = recordId !== undefined ? history[recordId] : undefined;
  }

  if (!record) {
    return <ErrorHandler label="Record not found" />;
  }

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY + scrollViewHeight >= contentHeight) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const { title, story, image, audioData } = record;
  const dateSaved = 'dateSaved' in record ? record.dateSaved : undefined;

  // Split the story into paragraphs
  const paragraphs = story.split('\n');

  // Find the middle paragraph
  const midPoint = Math.floor(paragraphs.length / 2);

  // Join the paragraphs back together
  const firstHalf = paragraphs.slice(0, midPoint).join('\n');
  const secondHalf = paragraphs.slice(midPoint).join('\n');
  // todo: use this for TTS for free tier users
  // const startTextToSpeach = (recentStory: string) => {
  //   setSpeaking(true);
  //   Tts.speak(recentStory, {
  //     iosVoiceId: '',
  //     rate: 0.5,
  //     androidParams: {
  //       KEY_PARAM_PAN: -1,
  //       KEY_PARAM_VOLUME: 0.5,
  //       KEY_PARAM_STREAM: 'STREAM_MUSIC',
  //     },
  //   });
  // };

  // const stopSpeaking = () => {
  //   Tts.stop();
  //   setSpeaking(false);
  // };

  // const beginSpeaking = () => {
  //   startTextToSpeach(story);
  // };

  // const pauseSpeaking = () => {
  //   Tts.pause(); //Todo: not implemented jet
  //   setSpeaking(false);
  // };

  // // Stop TTS when screen loses focus
  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       Tts.stop();
  //     };
  //   }, []),
  // );

  return (
    <View className="flex-1">
      <LinearGradient className="flex-1 left-0 top-0 right-0 bottom-0" colors={['#2e304e', '#213f6a', '#301e51']}>
        <ScrollView style={{ height: hp('80%') }} onScroll={handleScroll} scrollEventThrottle={16}>
          <Text
            className="text-yellow-100 mx-auto pt-12 pb-7 text-center"
            style={{ fontSize: wp(7) }}
            numberOfLines={2}>
            {title}
          </Text>

          <Text
            className="text-yellow-100 mx-2 pb-8 text-justify"
            style={{ fontSize: wp(4.5), textShadowColor: 'black', textShadowRadius: 5 }}>
            {firstHalf}
          </Text>

          {image ? <ImageStoryView image={image} /> : null}

          <Text
            className="text-yellow-100 mx-2 pb-32 pt-8 text-justify"
            style={{ fontSize: wp(4.5), textShadowColor: 'black', textShadowRadius: 5 }}>
            {secondHalf}
          </Text>

          <Text
            className="text-yellow-100 mx-auto pb-10 text-center"
            style={{ fontSize: wp(4), textShadowColor: 'black', textShadowRadius: 5 }}>
            {dateSaved && new Date(dateSaved).toLocaleString()}
          </Text>
        </ScrollView>

        <TTSAudioComponent recentStory={story} audio_inBase64={audioData} />

        {/* <PlaybackControls
          speaking={speaking}
          recentStory={story}
          stopSpeaking={stopSpeaking}
          pauseSpeaking={pauseSpeaking}
          beginSpeaking={beginSpeaking}
        /> */}
      </LinearGradient>
    </View>
  );
};

export default HistoryRecord;
