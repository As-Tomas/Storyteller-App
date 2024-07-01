import { useState, useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import Voice from '@react-native-voice/voice';

const useVoiceRecognitionCheck = () => {
    const [voiceAvailable, setvoiceAvailable] = useState<null | boolean>(null);

    // Check if Google Speech Recognizing Engine is available
    useEffect(() => {
      if (voiceAvailable === null) {
        const checkSpeechRecognitionServices = async () => {
          try {
            const isAvailable = await Voice.isAvailable();
            const result = await Voice.getSpeechRecognitionServices() as string[];
  
            if (isAvailable || result.length === 0 ) {
              Alert.alert(
                'Google Speech Recognizing Engine not found',
                'Your device does not have any speech recognition services installed. Please install the Google Search App to use the voice recognition feature within the app.',
                [
                  {
                    text: 'Install Google Search App',
                    onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.googlequicksearchbox&hl=en'),
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ],
              );
            }         
            setvoiceAvailable(Boolean(isAvailable));
          } catch (error) {
            //todo: log devices info to sentry
            console.error('Voice recognition services check error:', error);
          }
        };
        checkSpeechRecognitionServices();
      }
    }, [voiceAvailable]);

return voiceAvailable;
};

export default useVoiceRecognitionCheck;
