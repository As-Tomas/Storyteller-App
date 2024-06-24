import axios from 'axios';

const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS;

const VOICE_ID = 'XB0fDUnXU5powFXDhCwa'; // 21m00Tcm4TlvDq8ikWAM ThT5KcBeYPX3keUQqHPh Charlote XB0fDUnXU5powFXDhCwa Nicole piTKgcLEGmPE4e6mEKli Mini zrHiDhphv9ZnVXBqCLjz 
const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;

export const getTTSAudio = async (text: string): Promise<ArrayBuffer> => {
console.log("🚀 ~ getTTSAudio  elevenlabs~ triggered: ----------------------------------------",)

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

/*
Name: Rachel
 LOG  Voice ID: 21m00Tcm4TlvDq8ikWAM
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Drew
 LOG  Voice ID: 29vD33N1CtxCmqQRPOHJ
 LOG  Category: premade
 LOG  Use Case: news
 LOG  -----------------------------------
 LOG  Name: Clyde
 LOG  Voice ID: 2EiwWnXFnvU5JabPnv8n
 LOG  Category: premade
 LOG  Use Case: video games
 LOG  -----------------------------------
 LOG  Name: Paul
 LOG  Voice ID: 5Q0t7uMcjvnagumLfvZi
 LOG  Category: premade
 LOG  Use Case: news
 LOG  -----------------------------------
 LOG  Name: Domi
 LOG  Voice ID: AZnzlk1XvdvUeBnXmlld
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Dave
 LOG  Voice ID: CYw3kZ02Hs0563khs1Fj
 LOG  Category: premade
 LOG  Use Case: video games
 LOG  -----------------------------------
 LOG  Name: Fin
 LOG  Voice ID: D38z5RcWu1voky8WS1ja
 LOG  Category: premade
 LOG  Use Case: video games
 LOG  -----------------------------------
 LOG  Name: Sarah
 LOG  Voice ID: EXAVITQu4vr4xnSDxMaL
 LOG  Category: premade
 LOG  Use Case: news
 LOG  -----------------------------------
 LOG  Name: Antoni
 LOG  Voice ID: ErXwobaYiN019PkySvjV
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Thomas
 LOG  Voice ID: GBv7mTt0atIp3Br8iCZE
 LOG  Category: premade
 LOG  Use Case: meditation
 LOG  -----------------------------------
 LOG  Name: Charlie
 LOG  Voice ID: IKne3meq5aSn9XLyUdCD
 LOG  Category: premade
 LOG  Use Case: conversational
 LOG  -----------------------------------
 LOG  Name: George
 LOG  Voice ID: JBFqnCBsd6RMkjVDRZzb
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Emily
 LOG  Voice ID: LcfcDJNUP1GQjkzn1xUU
 LOG  Category: premade
 LOG  Use Case: meditation
 LOG  -----------------------------------
 LOG  Name: Elli
 LOG  Voice ID: MF3mGyEYCl7XYWbV9V6O
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Callum
 LOG  Voice ID: N2lVS1w4EtoT3dr4eOWO
 LOG  Category: premade
 LOG  Use Case: characters
 LOG  -----------------------------------
 LOG  Name: Patrick
 LOG  Voice ID: ODq5zmih8GrVes37Dizd
 LOG  Category: premade
 LOG  Use Case: video games
 LOG  -----------------------------------
 LOG  Name: Harry
 LOG  Voice ID: SOYHLrjzK2X1ezoPC6cr
 LOG  Category: premade
 LOG  Use Case: video games
 LOG  -----------------------------------
 LOG  Name: Liam
 LOG  Voice ID: TX3LPaxmHKxFdv7VOQHJ
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Dorothy
 LOG  Voice ID: ThT5KcBeYPX3keUQqHPh
 LOG  Category: premade
 LOG  Use Case: children's stories
 LOG  -----------------------------------
 LOG  Name: Josh
 LOG  Voice ID: TxGEqnHWrfWFTfGW9XjX
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Arnold
 LOG  Voice ID: VR6AewLTigWG4xSOukaG
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Charlotte
 LOG  Voice ID: XB0fDUnXU5powFXDhCwa
 LOG  Category: premade
 LOG  Use Case: characters
 LOG  -----------------------------------
 LOG  Name: Alice
 LOG  Voice ID: Xb7hH8MSUJpSbSDYk0k2
 LOG  Category: premade
 LOG  Use Case: news
 LOG  -----------------------------------
 LOG  Name: Matilda
 LOG  Voice ID: XrExE9yKIg1WjnnlVkGX
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: James
 LOG  Voice ID: ZQe5CZNOzWyzPSCn5a3c
 LOG  Category: premade
 LOG  Use Case: news
 LOG  -----------------------------------
 LOG  Name: Joseph
 LOG  Voice ID: Zlb1dXrM653N07WRdFW3
 LOG  Category: premade
 LOG  Use Case: news
 LOG  -----------------------------------
 LOG  Name: Jeremy
 LOG  Voice ID: bVMeCyTHy58xNoL34h3p
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Michael
 LOG  Voice ID: flq6f7yk4E4fJM5XTYuZ
 LOG  Category: premade
 LOG  Use Case: audiobook
 LOG  -----------------------------------
 LOG  Name: Ethan
 LOG  Voice ID: g5CIjZEefAph4nQFvHAz
 LOG  Category: premade
 LOG  Use Case: ASMR
 LOG  -----------------------------------
 LOG  Name: Chris
 LOG  Voice ID: iP95p4xoKVk53GoZ742B
 LOG  Category: premade
 LOG  Use Case: conversational
 LOG  -----------------------------------
 LOG  Name: Gigi
 LOG  Voice ID: jBpfuIE2acCO8z3wKNLl
 LOG  Category: premade
 LOG  Use Case: animation
 LOG  -----------------------------------
 LOG  Name: Freya
 LOG  Voice ID: jsCqWAovK2LkecY7zXl4
 LOG  Category: premade
 LOG  Use Case: N/A
 LOG  -----------------------------------
 LOG  Name: Brian
 LOG  Voice ID: nPczCjzI2devNBz1zQrb
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Grace
 LOG  Voice ID: oWAxZDx7w5VEj9dCyTzz
 LOG  Category: premade
 LOG  Use Case: audiobook
 LOG  -----------------------------------
 LOG  Name: Daniel
 LOG  Voice ID: onwK4e9ZLuTAKqWW03F9
 LOG  Category: premade
 LOG  Use Case: news
 LOG  -----------------------------------
 LOG  Name: Lily
 LOG  Voice ID: pFZP5JQG7iQjIQuC4Bku
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Serena
 LOG  Voice ID: pMsXgVXv3BLzUgSXRplE
 LOG  Category: premade
 LOG  Use Case: interactive
 LOG  -----------------------------------
 LOG  Name: Adam
 LOG  Voice ID: pNInz6obpgDQGcFmaJgB
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Nicole
 LOG  Voice ID: piTKgcLEGmPE4e6mEKli
 LOG  Category: premade
 LOG  Use Case: audiobook
 LOG  -----------------------------------
 LOG  Name: Bill
 LOG  Voice ID: pqHfZKP75CvOlQylNhV4
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Jessie
 LOG  Voice ID: t0jbNlBVZ17f02VDIeMI
 LOG  Category: premade
 LOG  Use Case: video games
 LOG  -----------------------------------
 LOG  Name: Sam
 LOG  Voice ID: yoZ06aMxZJJ28mfd3POQ
 LOG  Category: premade
 LOG  Use Case: narration
 LOG  -----------------------------------
 LOG  Name: Glinda
 LOG  Voice ID: z9fAnlkpzviPz146aGWa
 LOG  Category: premade
 LOG  Use Case: video games
 LOG  -----------------------------------
 LOG  Name: Giovanni
 LOG  Voice ID: zcAOhNBS3c14rBihAFp1
 LOG  Category: premade
 LOG  Use Case: audiobook
 LOG  -----------------------------------
 LOG  Name: Mimi
 LOG  Voice ID: zrHiDhphv9ZnVXBqCLjz
 LOG  Category: premade
 LOG  Use Case: animation
 LOG  -----------------------------------
 */