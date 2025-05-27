import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const InfoCard = ({ icon, title, descriptions, iconBgColor, iconColor }) => (
  <View style={styles.container}>
    <View style={[styles.icon, { backgroundColor: iconBgColor }]}>
      <Text style={[styles.iconText, { color: iconColor }]}>{icon}</Text>
    </View>
    <Text style={styles.title}>{title}</Text>
    {descriptions.map((desc, index) => (
      <Text key={index} style={styles.description}>"{desc}"</Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
});