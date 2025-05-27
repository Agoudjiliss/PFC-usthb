import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export const CustomInput = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  isPassword, 
  onTogglePassword 
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#999999"
        />
        {isPassword && (
          <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIcon}>
            <Text style={styles.eyeText}>👁</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.inputUnderline} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    padding: 0,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  eyeIcon: {
    padding: 5,
  },
  eyeText: {
    fontSize: 16,
    color: '#999999',
  },
});