import React, { useCallback, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { getTTSAudio, getVoices } from '@/apiCalls/ElevenLabs';
import { fromByteArray } from 'base64-js';
import { useHistoryStore } from '@/utils/Store/historyStore';
import PlaybackControls from '@/components/navigation/PlaybackControls';
import { useFocusEffect } from 'expo-router';

interface TTSAudioComponentProps {
  recentStory: string;
}

const TTSAudioComponent: React.FC<TTSAudioComponentProps> = ({ recentStory }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { addHistoryItem, history } = useHistoryStore();

  const handlePlayTTS = async () => {
    try {
      // Check if the audio data is already in the history
      const matchingHistoryItem = history.find((item) => item.story === recentStory);

      if (!matchingHistoryItem) {
        console.log('No matching history item found. Skipping TTS.');
        return;
      }

      let data = matchingHistoryItem.audioData;

      // If no audio data is found, fetch new audio data
      if (!data) {
        data = await getTTSAudio(recentStory);

        // Update the history item with the new audio data
        addHistoryItem(matchingHistoryItem.story, matchingHistoryItem.image, matchingHistoryItem.title, data);
      }

      const base64String = fromByteArray(new Uint8Array(data));
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: `data:audio/mp3;base64,${base64String}` });
      setSound(soundObject);
      await soundObject.playAsync();
      setIsPlaying(true);
      soundObject.setOnPlaybackStatusUpdate((status) => {
        if (!status.isPlaying) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing TTS audio:', error);
    }
  };

  const handleStopTTS = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const handlePauseTTS = async () => {
    if (sound && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        handleStopTTS();
      };
    }, [sound]),
  );

  return (
    <PlaybackControls 
      speaking={isPlaying} 
      recentStory={recentStory} 
      stopSpeaking={handleStopTTS} 
      pauseSpeaking={handlePauseTTS} 
      beginSpeaking={handlePlayTTS}
    />
  );
};

export default TTSAudioComponent;
