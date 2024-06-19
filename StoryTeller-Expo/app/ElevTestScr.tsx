import React, { useEffect, useState } from 'react';
import { View, Button, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { getTTSAudio, getVoices } from '@/apiCalls/ElevenLabs';
import { fromByteArray } from 'base64-js';

const TTSAudioComponent: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const handlePlayTTS = async () => {
    try {
      const audioData = await getTTSAudio(text);
      const base64String = fromByteArray(new Uint8Array(audioData));
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: `data:audio/mp3;base64,${base64String}` });
      setSound(soundObject);
      await soundObject.playAsync();
    } catch (error) {
      console.error('Error playing TTS audio:', error);
    }
  };


  return (
    <View style={styles.container} className=" w-4/5">
      <TextInput
        style={styles.input}
        placeholder="Enter text"
        value={text}
        onChangeText={setText}
        className=" text-white"
      />
      <TouchableOpacity onPress={handlePlayTTS} className=" h-5 bg-slate-400">
        <Text className="text-white">Play TTS</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={getVoices} className=" h-5 mt-4 bg-slate-400">
        <Text className="text-white">Get voices</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
});

export default TTSAudioComponent;
