/**
 * Authentication Service for USTHB-Bot Mobile App
 * Handles user authentication with Spring Boot backend
 * Includes JWT token management, session validation, and security features
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, apiCall, checkBackendHealth } from '../config/api';

// Storage keys
const USER_STORAGE_KEY = 'user';
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export const authService = {
  /**
   * Login user with Spring Boot backend
   * Endpoint: POST /api/auth/login
   * Expected response: { token, username, email, role }
   */
  async login(credentials) {
    try {
      console.log('Attempting login for user:', credentials.username);
      
      // Validate input
      if (!credentials.username?.trim() || !credentials.password?.trim()) {
        throw new Error('Username and password are required');
      }

      // Check backend health first (optional but recommended)
      const healthCheck = await checkBackendHealth();
      if (!healthCheck.healthy) {
        console.warn('⚠️ Backend health check failed, proceeding anyway...');
      }

      // Make login request
      const response = await apiCall(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({
          username: credentials.username.trim(),
          password: credentials.password,
        }),
      });

      // Validate response
      if (!response || !response.token) {
        throw new Error('Invalid response from server - missing token');
      }

      // Prepare user data for storage
      const userData = {
        token: response.token,
        username: response.username || credentials.username.trim(),
        email: response.email || credentials.email,
        role: response.role || 'USER',
        loginTime: Date.now(),
        tokenExpiry: this.calculateTokenExpiry(response.token),
      };

      // Store user data securely
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      
      console.log('Login successful for user:', userData.username);
      console.log('User role:', userData.role);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error types
      if (error.status === 401) {
        throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
      } else if (error.status === 403) {
        throw new Error('Compte désactivé. Contactez l\'administrateur.');
      } else if (error.status >= 500) {
        throw new Error('Erreur du serveur. Réessayez plus tard.');
      } else if (error.message.includes('timeout') || error.message.includes('Network')) {
        throw new Error('Délai de connexion dépassé. Vérifiez votre connexion internet.');
      }
      
      throw new Error(error.message || 'Échec de la connexion');
    }
  },

  /**
   * Register new user with Spring Boot backend
   * Endpoint: POST /api/auth/register
   * Expected response: { token, username, email, role }
   */
  async register(userData) {
    try {
      console.log('📝 Attempting registration for user:', userData.username);
      
      // Validate input
      this.validateRegistrationData(userData);

      const response = await apiCall(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          username: userData.username.trim(),
          email: userData.email.trim(),
          password: userData.password,
          fullName: userData.fullName?.trim(),
        }),
      });

      // Validate response
      if (!response || !response.token) {
        throw new Error('Invalid response from server - missing token');
      }

      // Prepare user data for storage
      const userDataToStore = {
        token: response.token,
        username: response.username || userData.username.trim(),
        email: response.email || userData.email.trim(),
        role: response.role || 'USER',
        loginTime: Date.now(),
        tokenExpiry: this.calculateTokenExpiry(response.token),
      };

      // Store user data securely
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userDataToStore));
      
      console.log('Registration successful for user:', userDataToStore.username);
      
      return userDataToStore;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error types
      if (error.status === 409) {
        throw new Error('Ce nom d\'utilisateur ou email existe déjà');
      } else if (error.status === 400) {
        throw new Error('Données d\'inscription invalides. Vérifiez vos informations.');
      }
      
      throw new Error(error.message || 'Échec de l\'inscription');
    }
  },

  /**
   * Logout user - clear local data and notify backend
   */
  async logout() {
    try {
      console.log('Logging out user...');
      
      // Try to notify backend about logout (optional)
      try {
        const user = await this.getCurrentUser();
        if (user?.token) {
          await apiCall(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          });
          console.log('Backend logout notification sent');
        }
      } catch (error) {
        console.log('Backend logout notification failed:', error.message);
        // Continue with local logout even if backend fails
      }

      // Clear all local storage
      await AsyncStorage.multiRemove([
        USER_STORAGE_KEY, 
        'conversations', 
        'chat_history',
        'error_logs'
      ]);
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear local storage even if there's an error
      try {
        await AsyncStorage.clear();
      } catch (clearError) {
        console.error('Failed to clear storage:', clearError);
      }
    }
  },

  /**
   * Get current user from local storage with validation
   */
  async getCurrentUser() {
    try {
      const userStr = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (!userStr) {
        return null;
      }

      const userData = JSON.parse(userStr);
      
      // Validate required fields
      if (!userData.token || !userData.username) {
        console.log('Invalid user data, clearing storage');
        await this.logout();
        return null;
      }
      
      // Check if token is expired
      if (this.isTokenExpired(userData)) {
        console.log('Token expired, clearing user data');
        await this.logout();
        return null;
      }
      
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      // Clear corrupted data
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    const isAuth = !!user?.token;
    console.log('Authentication check:', isAuth ? 'AUTHENTICATED' : 'NOT_AUTHENTICATED');
    return isAuth;
  },

  /**
   * Get authorization headers for API calls
   */
  async getAuthHeaders() {
    const user = await this.getCurrentUser();
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (user?.token) {
      headers.Authorization = `Bearer ${user.token}`;
    }

    return headers;
  },

  /**
   * Refresh token if needed (implement if backend supports it)
   */
  async refreshTokenIfNeeded() {
    try {
      const user = await this.getCurrentUser();
      if (!user?.token || !user?.tokenExpiry) {
        return false;
      }

      const timeUntilExpiry = user.tokenExpiry - Date.now();
      
      // If token expires soon, try to refresh
      if (timeUntilExpiry < TOKEN_REFRESH_THRESHOLD) {
        console.log('Token expires soon, attempting refresh...');
        
        try {
          const response = await apiCall(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          });

          if (response?.token) {
            const updatedUser = {
              ...user,
              token: response.token,
              tokenExpiry: this.calculateTokenExpiry(response.token),
              loginTime: Date.now(),
            };
            
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
            console.log('Token refreshed successfully');
            return true;
          }
        } catch (error) {
          console.log('Token refresh failed:', error.message);
          // If refresh fails, user will need to login again
          await this.logout();
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  },

  /**
   * Validate user session and token with backend
   */
  async validateSession() {
    try {
      const user = await this.getCurrentUser();
      if (!user?.token) {
        return false;
      }

      // Try to make an authenticated request to validate the token
      const response = await apiCall(API_CONFIG.ENDPOINTS.AUTH.PROFILE || API_CONFIG.ENDPOINTS.HEALTH, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      console.log('Session validation successful');
      return true;
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        console.log('Session invalid, logging out user');
        await this.logout();
        return false;
      }
      
      // For other errors, assume session is still valid
      console.log('Session validation failed, but assuming valid:', error.message);
      return true;
    }
  },

  /**
   * Get user profile information
   */
  async getUserProfile() {
    try {
      const user = await this.getCurrentUser();
      if (!user) return null;

      return {
        username: user.username,
        email: user.email,
        role: user.role,
        loginTime: user.loginTime,
        tokenExpiry: user.tokenExpiry,
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  },

  /**
 * Validate registration data
 */
validateRegistrationData(userData) {
  if (!userData.username?.trim()) {
    throw new Error('Le nom d\'utilisateur est requis');
  }

  if (!userData.email?.trim()) {
    throw new Error('L\'adresse email est requise');
  }

  if (!userData.password?.trim()) {
    throw new Error('Le mot de passe est requis');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email.trim())) {
    throw new Error('Adresse email invalide');
  }

  // Password strength validation
  if (userData.password.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
  }

  // Username validation
  if (userData.username.trim().length < 3) {
    throw new Error('Le nom d\'utilisateur doit contenir au moins 3 caractères');
  }
},

/**
 * Calculate token expiry time
 */
calculateTokenExpiry(token) {
  try {
    // If JWT token, decode payload to get exp claim
    const payload = this.decodeJWTPayload(token);
    if (payload?.exp) {
      return payload.exp * 1000; // Convert to milliseconds
    }
  } catch (error) {
    console.log('Could not decode JWT token, using default expiry');
  }
  
  // Default to 24 hours from now
  return Date.now() + SESSION_TIMEOUT;
},

/**
 * Decode JWT payload (without verification)
 */
decodeJWTPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
},

/**
 * Check if token is expired
 */
isTokenExpired(userData) {
  if (!userData.tokenExpiry) {
    // If no expiry time, check login time
    const timeSinceLogin = Date.now() - (userData.loginTime || 0);
    return timeSinceLogin > SESSION_TIMEOUT;
  }
  
  return Date.now() >= userData.tokenExpiry;
},

  /**
   * Clean up expired sessions (call periodically)
   */
  async cleanupExpiredSessions() {
    try {
      const user = await this.getCurrentUser();
      if (user && this.isTokenExpired(user)) {
        console.log('Cleaning up expired session');
        await this.logout();
      }
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  },
};

// Auto-cleanup expired sessions on module load
authService.cleanupExpiredSessions().catch(console.error);

export default authService;