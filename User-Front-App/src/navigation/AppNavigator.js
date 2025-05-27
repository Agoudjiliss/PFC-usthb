import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { ChatScreen } from '../screens/ChatScreen';

export const AppNavigator = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'signup'

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  // If authenticated, show chat screen
  if (isAuthenticated) {
    return <ChatScreen onLogout={logout} />;
  }

  // If not authenticated, show auth screens
  const navigateToSignup = () => setCurrentScreen('signup');
  const navigateToLogin = () => setCurrentScreen('login');

  if (currentScreen === 'signup') {
    return (
      <SignupScreen 
        onNavigateToLogin={navigateToLogin}
      />
    );
  }

  return (
    <LoginScreen 
      onNavigateToSignup={navigateToSignup}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
});