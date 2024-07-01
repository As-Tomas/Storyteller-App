import React, { useCallback, useState } from 'react';
import { Audio } from 'expo-av';
import { getTTSAudio } from '@/apiCalls/ElevenLabs';
import { fromByteArray } from 'base64-js';
import { useHistoryStore } from '@/utils/Store/historyStore';
import PlaybackControls from '@/components/navigation/PlaybackControls';
import { useFocusEffect } from 'expo-router';

interface TTSAudioComponentProps {
  recentStory: string;
  audio_inBase64?: string;
}

const TTSAudioComponent: React.FC<TTSAudioComponentProps> = ({ recentStory, audio_inBase64 }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { addHistoryItem, history } = useHistoryStore();

  const handlePlayTTS = async () => {
    try {
      let data: ArrayBuffer | undefined;
      let base64String: string | undefined;

      if (!audio_inBase64) {
        console.log('0');
        // Check if the audio data is already in the history
        const matchingHistoryItem = history.find((item) => item.story === recentStory);
        if (matchingHistoryItem?.audioData) {
          console.log('1');

          base64String = matchingHistoryItem.audioData;
          // If no audio data is found, fetch new audio data
        } else if (matchingHistoryItem && !matchingHistoryItem?.audioData) {
          console.log('2');
          data = await getTTSAudio(recentStory);
          base64String = fromByteArray(new Uint8Array(data));
          await addHistoryItem(
            matchingHistoryItem.story,
            matchingHistoryItem.image,
            matchingHistoryItem.title,
            base64String,
          );
        }

        // If audio data is passed in as a prop, use that instead
      } else if (audio_inBase64) {
        console.log('3');
        base64String = audio_inBase64;
        // if audio data is already in the history, use that
      }

      if (!base64String) {
        throw new Error('base64String is not audio string, or library item without premade sound');
      }

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
