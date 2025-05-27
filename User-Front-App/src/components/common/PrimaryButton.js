import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const PrimaryButton = ({ title, onPress, style }) => (
  <TouchableOpacity style={[styles.primaryButton, style]} onPress={onPress}>
    <Text style={styles.primaryButtonText}>{title}</Text>
    <Text style={styles.arrow}>→</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  arrow: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});