import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Logo } from '../components/common/Logo';
import { CustomInput } from '../components/common/CustomInput';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { LinkText } from '../components/common/LinkText';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = ({ onNavigateToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login({ username: username.trim(), password });
      
      if (!result.success) {
        Alert.alert('Login Failed', result.error);
      }
      // Success is handled by the AuthContext (user state change)
    } catch (error) {
      Alert.alert('Login Error', 'An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password', 
      'Please contact your administrator to reset your password.',
      [{ text: 'OK' }]
    );
  };

  const handleCreateAccount = () => {
    if (onNavigateToSignup) {
      onNavigateToSignup();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Logo />
        
        <Text style={styles.title}>
          Merci d'entrer vos informations de connexion
        </Text>

        <View style={styles.formContainer}>
          <CustomInput
            label="Nom d'utilisateur"
            placeholder="nom.utilisateur"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <CustomInput
            label="Mot de passe"
            placeholder="••••••••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            isPassword={true}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <View style={styles.forgotPasswordContainer}>
            <LinkText onPress={handleForgotPassword}>
              Mot de passe oublié ?
            </LinkText>
          </View>

          <PrimaryButton
            title={isLoading ? "Connexion..." : "Se connecter"}
            onPress={handleLogin}
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
            disabled={isLoading}
          />

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4a90e2" />
              <Text style={styles.loadingText}>Connexion en cours...</Text>
            </View>
          )}

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Vous n'avez pas de compte ? </Text>
            <LinkText onPress={handleCreateAccount} style={styles.signupLink}>
              Créer un compte
            </LinkText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 40,
    lineHeight: 22,
    fontWeight: '400',
  },
  formContainer: {
    flex: 1,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  signupLink: {
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#4a90e2',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#666666',
  },
});