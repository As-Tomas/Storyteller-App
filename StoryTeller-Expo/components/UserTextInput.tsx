import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface UserTextInputProps {
  setUserInputText: (text: string) => void;
  setup: 'parent' | 'child' | string;
  fetchResponse?: (text: string) => void;
  resetScreenState?: () => void;
}

const UserTextInput: React.FC<UserTextInputProps> = ({ setUserInputText, setup, fetchResponse, resetScreenState }) => {
  const [isInputFieldVisible, setInputFieldIsVisible] = useState(setup === 'parent');
  const [text, setText] = useState('');

  const handleClickSendBtn = useCallback(() => {
    if (fetchResponse) {
      fetchResponse(text);
    }
    setUserInputText(text);
    setText('');
    setInputFieldIsVisible(false);
  }, [text, setUserInputText, fetchResponse]);

  const resetScreen = () => {
    setInputFieldIsVisible(true);
    if (resetScreenState) {
      resetScreenState();
    } 
  };
 
  const handleTextInput = (text: string) => {
    setText(text);
    setUserInputText(text);
  };

  return (
    <View style={styles.container}>
      {isInputFieldVisible ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={handleTextInput}
            value={text}
            placeholder="Type here..."
            placeholderTextColor="#fff"
            multiline={true}
            numberOfLines={3}
            onSubmitEditing={handleClickSendBtn}
          />
          {setup !== 'parent' && (
            <TouchableOpacity onPress={handleClickSendBtn} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity onPress={ resetScreen } style={styles.openInputButton}>
          <Text style={styles.openInputButtonText}>Tap to type...</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: wp(80),
    height: hp(10),
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  sendButtonText: {
    color: '#fff',
  },
  openInputButton: {
    padding: 10,
  },
  openInputButtonText: {
    color: '#fff',
  },
});

export default UserTextInput;
