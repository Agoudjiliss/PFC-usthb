import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Logo } from '../components/common/Logo';
import { CustomInput } from '../components/common/CustomInput';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { LinkText } from '../components/common/LinkText';
import { Checkbox } from '../components/common/CheckBox';
import { useAuth } from '../context/AuthContext';

export const SignupScreen = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await register({
        email: email.trim(),
        username: fullName.trim(),
        password: password,
      });
      
      if (!result.success) {
        Alert.alert('Registration Failed', result.error);
      }
      // Success is handled by the AuthContext (user state change)
    } catch (error) {
      Alert.alert('Registration Error', 'An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsPress = () => {
    Alert.alert(
      'Terms and Conditions',
      'By using USTHB Chat, you agree to our terms of service and privacy policy. This application is designed to assist with entrepreneurship and startup guidance.',
      [{ text: 'OK' }]
    );
  };

  const handleBackToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Logo />
        
        <Text style={styles.title}>
          Créer votre compte USTHB Chat
        </Text>

        <View style={styles.formContainer}>
          <CustomInput
            label="Adresse e-mail"
            placeholder="nom@exemple.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <CustomInput
            label="Nom complet"
            placeholder="Votre nom complet"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
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

          <CustomInput
            label="Confirmer votre mot de passe"
            placeholder="••••••••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            isPassword={true}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <Checkbox
            checked={acceptTerms}
            onPress={() => setAcceptTerms(!acceptTerms)}
            style={styles.checkbox}
          >
            J'accepte les{' '}
            <Text style={styles.termsLink} onPress={handleTermsPress}>
              termes et les conditions d'utilisation
            </Text>
          </Checkbox>

          <PrimaryButton
            title={isLoading ? "Inscription..." : "S'inscrire"}
            onPress={handleSignup}
            style={[styles.signupButton, isLoading && styles.buttonDisabled]}
            disabled={isLoading}
          />

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4a90e2" />
              <Text style={styles.loadingText}>Création du compte...</Text>
            </View>
          )}

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Vous possédez déjà un compte ? </Text>
            <LinkText onPress={handleBackToLogin} style={styles.loginLink}>
              Se connecter
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
  checkbox: {
    marginBottom: 30,
  },
  termsLink: {
    color: '#4a90e2',
    textDecorationLine: 'underline',
  },
  signupButton: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
  },
  loginLink: {
    textDecorationLine: 'underline',
  },
});