import axios from 'axios';

const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS;

const VOICE_ID = '21m00Tcm4TlvDq8ikWAM';
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
  } catch (error) {
    console.error('Error fetching TTS audio:', error);
    throw error;
  }
};
