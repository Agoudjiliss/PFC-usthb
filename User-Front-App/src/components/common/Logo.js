import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Logo = () => (
  <View style={styles.logoContainer}>
    <View style={styles.logo}>
      <View style={styles.logoLines}>
        <View style={[styles.line, styles.line1]} />
        <View style={[styles.line, styles.line2]} />
        <View style={[styles.line, styles.line3]} />
        <View style={[styles.line, styles.line4]} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  logoLines: {
    width: 50,
    height: 30,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#4a90e2',
    borderRadius: 1,
  },
  line1: { width: 20, top: 0, left: 0 },
  line2: { width: 30, top: 8, left: 5 },
  line3: { width: 25, top: 16, left: 10 },
  line4: { width: 15, top: 24, left: 15 },
});