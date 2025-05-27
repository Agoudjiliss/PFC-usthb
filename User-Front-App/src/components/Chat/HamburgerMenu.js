import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

export const HamburgerMenu = ({ onPress, style }) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <View style={styles.line} />
    <View style={styles.line} />
    <View style={styles.line} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: '#333333',
  },
});