import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatService } from './ChatService';

const CHAT_HISTORY_KEY = 'chat_history';
const MAX_CONVERSATIONS = 50; // Keep only last 50 conversations

export const conversationHistoryService = {
  // Save conversation to local storage
  async saveConversation(conversation) {
    try {
      const existingHistory = await this.getLocalHistory();
      const updatedHistory = existingHistory.filter(c => c.id !== conversation.id);
      updatedHistory.unshift(conversation); // Add to beginning
      
      // Keep only max conversations
      const limitedHistory = updatedHistory.slice(0, MAX_CONVERSATIONS);
      
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(limitedHistory));
      console.log('Conversation saved to local storage:', conversation.title);
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  },

  // Get local chat history
  async getLocalHistory() {
    try {
      const historyStr = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      return historyStr ? JSON.parse(historyStr) : [];
    } catch (error) {
      console.error('Error getting local history:', error);
      return [];
    }
  },

  // Sync with backend (try backend first, fallback to local)
  async getConversations(userId) {
    try {
      // Try to get from backend first
      const backendResult = await chatService.getChatHistory();
      if (backendResult.success && backendResult.conversations) {
        // Save to local storage as backup
        await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(backendResult.conversations));
        console.log('Conversations synced from backend');
        return backendResult.conversations;
      }
    } catch (error) {
      console.log('Backend not available, using local storage:', error.message);
    }

    // Fallback to local storage
    const localHistory = await this.getLocalHistory();
    console.log('Using local conversation history');
    return localHistory;
  },

  // Create a new conversation
  async createConversation(userId, title = 'New Chat') {
    const newConversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Try to save to backend
      // Note: You might want to implement this endpoint in your backend
      console.log('Created new conversation:', newConversation.title);
    } catch (error) {
      console.log('Could not save to backend:', error.message);
    }

    // Always save locally
    await this.saveConversation(newConversation);
    return newConversation;
  },

  // Add message to conversation
  async addMessageToConversation(conversationId, message) {
    try {
      const history = await this.getLocalHistory();
      const updatedHistory = history.map(conversation => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            messages: [...conversation.messages, message],
            updatedAt: new Date().toISOString(),
          };
        }
        return conversation;
      });

      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedHistory));
      console.log('Message added to conversation:', conversationId);
      
      // Find and return the updated conversation
      return updatedHistory.find(c => c.id === conversationId);
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      throw error;
    }
  },

  // Get messages for a specific conversation
  async getMessages(conversationId) {
    try {
      const history = await this.getLocalHistory();
      const conversation = history.find(c => c.id === conversationId);
      return conversation ? conversation.messages : [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  },

  // Update conversation title
  async updateConversationTitle(conversationId, title) {
    try {
      const history = await this.getLocalHistory();
      const updatedHistory = history.map(conversation => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            title,
            updatedAt: new Date().toISOString(),
          };
        }
        return conversation;
      });

      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedHistory));
      console.log('Conversation title updated:', title);
      
      return updatedHistory.find(c => c.id === conversationId);
    } catch (error) {
      console.error('Error updating conversation title:', error);
      throw error;
    }
  },

  // Delete a conversation
  async deleteConversation(conversationId) {
    try {
      const history = await this.getLocalHistory();
      const updatedHistory = history.filter(c => c.id !== conversationId);
      
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedHistory));
      console.log('Conversation deleted:', conversationId);
      
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  // Clear all conversations
  async clearAllConversations() {
    try {
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
      console.log('All conversations cleared');
    } catch (error) {
      console.error('Error clearing conversations:', error);
      throw error;
    }
  },

  // Generate conversation title from first message
  generateTitle(firstMessage) {
    if (!firstMessage) return 'New Chat';
    
    // Clean and truncate the message for title
    const cleanMessage = firstMessage.replace(/[^\w\s]/gi, '').trim();
    const words = cleanMessage.split(' ').slice(0, 4); // First 4 words
    
    if (words.length === 0) return 'New Chat';
    
    let title = words.join(' ');
    if (title.length > 30) {
      title = title.substring(0, 27) + '...';
    }
    
    return title || 'New Chat';
  },

  // Export conversations (for backup)
  async exportConversations() {
    try {
      const history = await this.getLocalHistory();
      return JSON.stringify(history, null, 2);
    } catch (error) {
      console.error('Error exporting conversations:', error);
      return null;
    }
  },

  // Import conversations (from backup)
  async importConversations(conversationsJson) {
    try {
      const conversations = JSON.parse(conversationsJson);
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(conversations));
      console.log('Conversations imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing conversations:', error);
      return false;
    }
  },
};