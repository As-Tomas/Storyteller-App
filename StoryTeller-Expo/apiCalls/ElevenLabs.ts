import axios from 'axios';

const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS;

const VOICE_ID = 'ThT5KcBeYPX3keUQqHPh'; // 21m00Tcm4TlvDq8ikWAM
const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;

export const getTTSAudio = async (text: string): Promise<ArrayBuffer> => {
  try {
    const response = await axios.post(
      apiUrl,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true,
        },
      },
      {
        headers: {
          Accept: 'application/json',
          'xi-api-key': apiKey,
        },
        responseType: 'arraybuffer',
      },
    );

    return response.data;
    console.log('response', response)
  } catch (error) {
    console.error('Error fetching TTS audio:', error);
    if (error.response && error.response.status === 429) {
      console.log('exceeded rate limit');
    }
    throw error;
  }
};

export const getVoices = async () => {
  try {
    const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: {
        Accept: 'application/json',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const voices = response.data.voices;
    if (Array.isArray(voices)) {
      for (const voice of voices) {
        const name = voice.name || 'N/A';
        const voice_id = voice.voice_id || 'N/A';
        const category = voice.category || 'N/A';
        const useCase = voice.labels && voice.labels['use case'] ? voice.labels['use case'] : 'N/A';

        console.log(`Name: ${name}`);
        console.log(`Voice ID: ${voice_id}`);
        console.log(`Category: ${category}`);
        console.log(`Use Case: ${useCase}`);
        console.log('-----------------------------------');
      }
    } else {
      console.error('Voices data is not an array:', voices);
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw error;
  }
};
