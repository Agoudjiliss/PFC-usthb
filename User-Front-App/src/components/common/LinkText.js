import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const LinkText = ({ children, onPress, style }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={[styles.linkText, style]}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  linkText: {
    color: '#4a90e2',
    fontSize: 14,
  },
});