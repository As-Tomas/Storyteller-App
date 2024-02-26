import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

export default function UserTextInput({setUserInputText}) {
  const [isInputVisible, setInputVisible] = useState(false);
  const [text, setText] = useState('');

  const handleSendPress = () => {
    console.log('Sending:', text);
    setUserInputText(text);    
    //  reset the text input and hide it after sending
    setText('');
    setInputVisible(false);
  };

  return (
    <View style={styles.container}>
      {isInputVisible ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setText}
            value={text}
            placeholder="Type here..."
            multiline={true}
            numberOfLines={3}
          />
          <TouchableOpacity onPress={handleSendPress} style={styles.sendButton}>
            {/* Replace "Send" with an icon using an icon library if preferred */}
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setInputVisible(true)} style={styles.openInputButton}>
          <Text style={styles.openInputButton}>Tap to type...</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

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
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,    
    color: '#fff'
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
    color: '#fff'
  },
});
