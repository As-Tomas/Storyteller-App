import React from 'react';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface PlaybackControlsProps {
  speaking: boolean;
  recentStory: string;
  stopSpeaking: () => void;
  pauseSpeaking: () => void;
  beginSpeaking: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  speaking,
  recentStory,
  stopSpeaking,
  pauseSpeaking,
  beginSpeaking,
}) => {
  return (
    <>
      {speaking && (
        <View className="flex flex-row space-x-2 p-1 absolute bottom-16 left-10  px-3 rounded-3xl"
        style={{ backgroundColor: 'rgba(107, 114, 128, 0.7)' }}
        >
          <FontAwesome name="stop-circle" size={30} color="#FEF9C3" onPress={stopSpeaking} />
          <FontAwesome name="pause-circle" size={30} color="#FEF9C3" onPress={pauseSpeaking} />
        </View>
      )}
      {!speaking && recentStory !== '' && (
        <View className="flex flex-row space-x-2 p-1 absolute bottom-16 left-10 px-3 rounded-3xl"        
        style={{ backgroundColor: 'rgba(107, 114, 128, 0.7)' }}
        >
          <FontAwesome name="play-circle" size={30} color="#FEF9C3" onPress={beginSpeaking} />
        </View>
      )}
    </>
  );
};

export default PlaybackControls;