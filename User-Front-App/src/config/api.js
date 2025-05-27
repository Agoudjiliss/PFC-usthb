// src/config/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Get API URL based on environment and platform
 * Matches the USTHB-Bot backend architecture with Spring Boot on port 8080
 */
const getApiUrl = () => {
  // Use environment variable if available
  if (process.env.EXPO_PUBLIC_API_URL) {
    console.log('Using environment API URL:', process.env.EXPO_PUBLIC_API_URL);
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // Platform-specific URLs for development
  if (__DEV__) {
    let devUrl;
    
    if (Platform.OS === 'android') {
      // Android Emulator maps 10.0.2.2 to host's localhost
      devUrl = 'http://10.0.2.2:8080/api';
    } else {
      // Web or other platforms
      devUrl = 'http://localhost:8080/api';
    }
    
    console.log(`Using ${Platform.OS} development URL:`, devUrl);
    return devUrl;
  }
  
  // Production environment - update with your production URL
  const prodUrl = 'https://your-production-api.com/api';
  console.log('Using production URL:', prodUrl);
  return prodUrl;
};

const API_BASE_URL = getApiUrl();

console.log('API Configuration initialized:', {
  baseUrl: API_BASE_URL,
  platform: Platform.OS,
  isDev: __DEV__
});

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000, // 30 seconds for chat responses
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second base delay
  MAX_RETRY_DELAY: 10000, // Maximum 10 seconds delay
  
  ENDPOINTS: {
    // Authentication endpoints (Spring Boot)
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    
    // Chat endpoints (Spring Boot orchestrates Rasa)
    CHAT: {
      SEND: '/chat/send',
      HISTORY: '/chat/history',
      CONVERSATION: '/chat/conversation',
      DELETE_CONVERSATION: '/chat/conversation',
      CLEAR_HISTORY: '/chat/clear'
    },
    
    // Health and system endpoints
    HEALTH: '/health/status',
    VERSION: '/version',
    
  },
  
  // HTTP Status codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  }
};

/**
 * Create authenticated request with JWT token
 */
export const createAuthenticatedRequest = async (endpoint, options = {}) => {
  try {
    // Get stored user data with token
    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    // Add Authorization header if user has token
    if (user?.token) {
      headers.Authorization = `Bearer ${user.token}`;
    }

    return apiCall(endpoint, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error('Auth request error:', error);
    throw error;
  }
};

/**
 * Network health checker
 */
export const checkBackendHealth = async () => {
  try {
    console.log('Checking backend health...');
    
    const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
      method: 'GET',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    const isHealthy = response.ok;
    console.log(`Backend health check: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
    
    if (isHealthy) {
      try {
        const data = await response.json();
        console.log('Health data:', data);
        return { healthy: true, data };
      } catch (e) {
        return { healthy: true, data: null };
      }
    }
    
    return { healthy: false, status: response.status };
  } catch (error) {
    console.log('Backend health check failed:', error.message);
    return { healthy: false, error: error.message };
  }
};

/**
 * Get platform-specific network configuration info
 */
export const getNetworkInfo = () => {
  const info = {
    apiUrl: API_BASE_URL,
    isDevelopment: __DEV__,
    platform: Platform.OS,
    platformVersion: Platform.Version,
    userAgent: `USTHB-Mobile/${Platform.OS}`,
  };
  
  console.log('Network configuration:', info);
  return info;
};

/**
 * Enhanced API helper with retry logic and proper error handling
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  let lastError;

  for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
    try {
      console.log(`API Call (attempt ${attempt}): ${options.method || 'GET'} ${endpoint}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': `USTHB-Mobile/${Platform.OS}`,
          ...options.headers,
        },
        ...options,
      });

      clearTimeout(timeoutId);

      // Handle different response types
      if (!response.ok) {
        let errorData = {};
        const contentType = response.headers.get('content-type');
        
        try {
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            errorData = { message: await response.text() };
          }
        } catch (e) {
          errorData = { message: `HTTP ${response.status} ${response.statusText}` };
        }

        const error = new Error(
          errorData.message || 
          errorData.error || 
          `API Error: ${response.status} ${response.statusText}`
        );
        error.status = response.status;
        error.data = errorData;
        error.url = url;
        
        // Don't retry for client errors (4xx) except timeout and rate limit
        if (response.status >= 400 && response.status < 500 && 
            response.status !== 408 && response.status !== 429) {
          throw error;
        }
        
        lastError = error;
        
        // Don't retry on the last attempt
        if (attempt === API_CONFIG.RETRY_ATTEMPTS) {
          throw error;
        }
        
        // Calculate exponential backoff delay
        const delay = Math.min(
          API_CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1),
          API_CONFIG.MAX_RETRY_DELAY
        );
        
        console.log(`⚠️ API call failed, retrying in ${delay}ms (attempt ${attempt + 1}/${API_CONFIG.RETRY_ATTEMPTS})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Handle successful response
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      console.log(`API Response (${endpoint}):`, data);
      return data;

    } catch (error) {
      lastError = error;
      
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout - please check your connection');
        timeoutError.isTimeout = true;
        throw timeoutError;
      }
      
      // Don't retry for certain errors or on last attempt
      if (error.status === 401 || error.status === 403 || attempt === API_CONFIG.RETRY_ATTEMPTS) {
        throw error;
      }
      
      console.warn(`⚠️ API Call failed (attempt ${attempt}):`, error.message);
      
      // Calculate exponential backoff delay
      const delay = Math.min(
        API_CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1),
        API_CONFIG.MAX_RETRY_DELAY
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};



// Legacy exports for backward compatibility
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
  REGISTER: `${API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`,
  LOGOUT: `${API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,
  
  // Chat endpoints
  SEND_MESSAGE: `${API_BASE_URL}${API_CONFIG.ENDPOINTS.CHAT.SEND}`,
  GET_CHAT_HISTORY: `${API_BASE_URL}${API_CONFIG.ENDPOINTS.CHAT.HISTORY}`,
  GET_CONVERSATION: (id) => `${API_BASE_URL}${API_CONFIG.ENDPOINTS.CHAT.CONVERSATION}/${id}`,
  DELETE_CONVERSATION: (id) => `${API_BASE_URL}${API_CONFIG.ENDPOINTS.CHAT.DELETE_CONVERSATION}/${id}`,
  
  
  // Health check
  HEALTH_CHECK: `${API_BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`,
  
};

// Export current API URL
export { API_BASE_URL as CURRENT_API_URL };

// Export configuration object
export default API_CONFIG;