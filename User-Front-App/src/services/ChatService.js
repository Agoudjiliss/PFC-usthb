/**
 * Chat Service for USTHB-Bot Mobile App
 * Handles communication between mobile app and Spring Boot backend
 * Backend orchestrates communication with Rasa NLP service
 */

import { API_CONFIG, createAuthenticatedRequest, checkBackendHealth } from '../config/api';
import { authService } from './authservice';

export const chatService = {
  /**
   * Send message to USTHB Bot via Spring Boot backend
   * Backend routes the message to Rasa and returns the response
   */
  async sendMessage(message, conversationId = null) {
    try {
      console.log('Sending message to USTHB Bot:', message);
  
      // Ensure user is authenticated
      const isAuth = await authService.isAuthenticated();
      if (!isAuth) {
        throw new Error('User not authenticated');
      }
  
      // Prepare request payload
      const payload = {
        message: message.trim(),
        senderId: conversationId || `user_${Date.now()}`,
        sessionId: conversationId,
      };
  
      const response = await createAuthenticatedRequest(
        API_CONFIG.ENDPOINTS.CHAT.SEND,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );
  
      console.log('Received response from USTHB Bot');
      
      return {
        success: true,
        data: this.parseResponse(response),
        conversationId: response.sessionId || conversationId,
      };
    } catch (error) {
      console.error('Send message error:', error);
      // No fallback - just throw the error
      throw error;
    }
  },

  /**
   * Parse response from Spring Boot backend
   */
  parseResponse(response) {
    let responseText = '';
    
    if (response.responses && Array.isArray(response.responses)) {
      // Rasa format via backend
      responseText = response.responses
        .map(r => r.text || r.message || '')
        .filter(text => text.trim())
        .join('\n');
    } else if (response.response) {
      responseText = response.response;
    } else if (response.message) {
      responseText = response.message;
    } else if (typeof response === 'string') {
      responseText = response;
    }

    return {
      responses: [{ 
        text: responseText || "Désolé, je n'ai pas pu traiter votre demande." 
      }],
      sessionId: response.sessionId,
    };
  },

  /**
   * Get chat history from Spring Boot backend
   */
  async getChatHistory() {
    try {
      console.log('Fetching chat history');

      const response = await createAuthenticatedRequest(
        API_CONFIG.ENDPOINTS.CHAT.HISTORY,
        { method: 'GET' }
      );

      console.log('Chat history retrieved');
      
      return {
        success: true,
        conversations: this.transformHistoryResponse(response),
      };
    } catch (error) {
      console.error('Get chat history error:', error);
      return { success: false, conversations: [] };
    }
  },

  /**
   * Transform backend history response to mobile app format
   */
  transformHistoryResponse(response) {
    if (!response) return [];

    let conversations = [];
    
    if (Array.isArray(response)) {
      conversations = response;
    } else if (response.conversations) {
      conversations = response.conversations;
    } else if (response.data) {
      conversations = Array.isArray(response.data) ? response.data : [response.data];
    }

    return conversations.map(conv => ({
      id: conv.id || conv.sessionId || `conv_${Date.now()}`,
      title: conv.title || this.generateConversationTitle(conv.messages?.[0]?.text),
      messages: this.transformMessages(conv.messages || []),
      userId: conv.userId,
      createdAt: conv.createdAt || new Date().toISOString(),
      updatedAt: conv.updatedAt || new Date().toISOString(),
    }));
  },

  /**
   * Transform backend messages to mobile app format
   */
  transformMessages(messages) {
    if (!Array.isArray(messages)) return [];

    return messages.map(msg => ({
      id: msg.id || Date.now().toString(),
      text: msg.text || msg.message || msg.content,
      isUser: msg.sender === 'user' || msg.isUser || false,
      timestamp: msg.timestamp || msg.createdAt,
      createdAt: msg.createdAt || new Date().toISOString(),
    }));
  },

  /**
   * Get specific conversation from backend
   */
  async getConversation(conversationId) {
    try {
      console.log('Fetching conversation:', conversationId);

      const response = await createAuthenticatedRequest(
        `${API_CONFIG.ENDPOINTS.CHAT.CONVERSATION}/${conversationId}`,
        { method: 'GET' }
      );

      const conversation = this.transformHistoryResponse([response])[0];
      return {
        success: true,
        data: conversation,
      };
    } catch (error) {
      console.error('Get conversation error:', error);
      throw error;
    }
  },

  /**
   * Delete conversation via backend
   */
  async deleteConversation(conversationId) {
    try {
      console.log('Deleting conversation:', conversationId);

      await createAuthenticatedRequest(
        `${API_CONFIG.ENDPOINTS.CHAT.DELETE_CONVERSATION}/${conversationId}`,
        { method: 'DELETE' }
      );

      console.log('Conversation deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Delete conversation error:', error);
      throw error;
    }
  },

  /**
   * Generate conversation title from first message
   */
  generateConversationTitle(firstMessage) {
    if (!firstMessage) return 'Nouvelle conversation';
    
    const cleanMessage = firstMessage.replace(/[^\w\s]/gi, '').trim();
    const words = cleanMessage.split(' ').slice(0, 4);
    
    if (words.length === 0) return 'Nouvelle conversation';
    
    let title = words.join(' ');
    if (title.length > 30) {
      title = title.substring(0, 27) + '...';
    }
    
    return title || 'Nouvelle conversation';
  },

  /**
   * Check if chat service is available
   */
  async isServiceAvailable() {
    try {
      const healthCheck = await checkBackendHealth();
      return healthCheck.healthy;
    } catch (error) {
      return false;
    }
  },
};