import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export const ChatInput = ({ onSendMessage, placeholder = "Type a message...", disabled = false }) => {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const inputRef = useRef(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      setInputHeight(40); // Reset height after sending
      inputRef.current?.blur(); // Remove focus
    }
  };

  const handleContentSizeChange = (event) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.min(Math.max(height, 40), 120); // Min 40px, max 120px
    setInputHeight(newHeight);
  };

  const isDisabled = !message.trim() || disabled;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { height: inputHeight }]}
          placeholder={placeholder}
          placeholderTextColor="#bdc3c7"
          value={message}
          onChangeText={setMessage}
          onContentSizeChange={handleContentSizeChange}
          multiline
          maxLength={2000}
          scrollEnabled={inputHeight >= 120}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={handleSend}
          editable={!disabled}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            isDisabled && styles.sendButtonDisabled
          ]} 
          onPress={handleSend}
          disabled={isDisabled}
        >
          <Text style={[styles.sendIcon, isDisabled && styles.sendIconDisabled]}>
            ➤
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    paddingVertical: 8,
    textAlignVertical: 'top',
    fontWeight: '400',
    lineHeight: 22,
  },
  sendButton: {
    backgroundColor: '#4a90e2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  sendIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 1,
  },
  sendIconDisabled: {
    color: '#95a5a6',
  },
});
