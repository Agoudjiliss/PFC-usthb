import { API_ENDPOINTS, apiCall } from '../config/api';

export const conversationService = {
  // Get all conversations for the user
  async getConversations(userId) {
    try {
      const conversations = await apiCall(`${API_ENDPOINTS.GET_CONVERSATIONS}?userId=${userId}`);
      return conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  // Create a new conversation
  async createConversation(userId, title = 'New Chat') {
    try {
      const newConversation = await apiCall(API_ENDPOINTS.CREATE_CONVERSATION, {
        method: 'POST',
        body: JSON.stringify({
          userId,
          title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  // Get messages for a specific conversation
  async getMessages(conversationId) {
    try {
      const messages = await apiCall(API_ENDPOINTS.GET_MESSAGES(conversationId));
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  // Send a message
  async sendMessage(conversationId, message) {
    try {
      const savedMessage = await apiCall(API_ENDPOINTS.SEND_MESSAGE(conversationId), {
        method: 'POST',
        body: JSON.stringify(message),
      });
      return savedMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Update conversation title
  async updateConversationTitle(conversationId, title) {
    try {
      const updatedConversation = await apiCall(API_ENDPOINTS.UPDATE_CONVERSATION(conversationId), {
        method: 'PATCH',
        body: JSON.stringify({
          title,
          updatedAt: new Date().toISOString(),
        }),
      });
      return updatedConversation;
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  },

  // Delete a conversation
  async deleteConversation(conversationId) {
    try {
      await apiCall(API_ENDPOINTS.DELETE_CONVERSATION(conversationId), {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
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
};