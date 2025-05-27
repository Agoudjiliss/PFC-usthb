import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  SafeAreaView, 
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { conversationHistoryService } from '../services/conversationHistoryService';

const { width } = Dimensions.get('window');

export const Sidebar = ({ visible, onClose, onNavigate, currentConversationId, userId, conversations: passedConversations }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const footerItems = [
    { id: 'clear', title: 'Clear conversations', icon: '🗑️' },
    { id: 'faq', title: 'Updates & FAQ', icon: '❓' },
    { id: 'logout', title: 'Log out', icon: '🚪' },
  ];

  // Load conversations when sidebar opens or when passed conversations change
  useEffect(() => {
    if (visible) {
      if (passedConversations && passedConversations.length > 0) {
        setConversations(passedConversations);
      } else {
        loadConversations();
      }
    }
  }, [visible, passedConversations]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const conversationList = await conversationHistoryService.getConversations(userId);
      setConversations(conversationList);
    } catch (error) {
      console.error('Error loading conversations:', error);
      Alert.alert('Error', 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadConversations();
    } finally {
      setRefreshing(false);
    }
  };

  const handleConversationPress = (conversation) => {
    console.log('Conversation selected:', conversation.title);
    onNavigate && onNavigate('conversation', conversation);
    onClose();
  };

  const handleNewChat = () => {
    console.log('New chat from sidebar');
    onNavigate && onNavigate('newchat');
    onClose();
  };

  const handleDeleteConversation = (conversationId, conversationTitle) => {
    Alert.alert(
      'Delete Conversation',
      `Are you sure you want to delete "${conversationTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteConversation(conversationId)
        }
      ]
    );
  };

  const deleteConversation = async (conversationId) => {
    try {
      await conversationHistoryService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // If the deleted conversation was the current one, start a new chat
      if (conversationId === currentConversationId) {
        onNavigate && onNavigate('newchat');
      }

      console.log('Conversation deleted successfully');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      Alert.alert('Error', 'Failed to delete conversation');
    }
  };

  const handleFooterItemPress = (item) => {
    console.log('Footer item pressed:', item.title);
    onNavigate && onNavigate(item.id);
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  };

  const exportConversations = async () => {
    try {
      const exportData = await conversationHistoryService.exportConversations();
      if (exportData) {
        // In a real app, you might want to share this data or save it to a file
        Alert.alert(
          'Export Complete',
          'Conversations exported successfully. In a production app, this would be saved to a file or shared.',
          [{ text: 'OK' }]
        );
        console.log('Exported conversations length:', exportData.length);
      }
    } catch (error) {
      console.error('Error exporting conversations:', error);
      Alert.alert('Error', 'Failed to export conversations');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />
        <View style={styles.sidebar}>
          <SafeAreaView style={styles.sidebarContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>USTHB Chat</Text>
                <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                  <Text style={styles.refreshIcon}>↻</Text>
                </TouchableOpacity>
              </View>
              
              {/* New Chat Button */}
              <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
                <Text style={styles.newChatIcon}>➕</Text>
                <Text style={styles.newChatText}>New chat</Text>
              </TouchableOpacity>
            </View>
            
            {/* Conversations List */}
            <View style={styles.content}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Conversations</Text>
                {conversations.length > 0 && (
                  <TouchableOpacity style={styles.exportButton} onPress={exportConversations}>
                    <Text style={styles.exportIcon}>📤</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#4a90e2" />
                  <Text style={styles.loadingText}>Loading conversations...</Text>
                </View>
              ) : (
                <ScrollView 
                  style={styles.conversationsList}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  showsVerticalScrollIndicator={false}
                >
                  {conversations.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyIcon}>💬</Text>
                      <Text style={styles.emptyText}>No conversations yet</Text>
                      <Text style={styles.emptySubtext}>Start a new chat to begin</Text>
                    </View>
                  ) : (
                    conversations.map((conversation) => (
                      <TouchableOpacity
                        key={conversation.id}
                        style={[
                          styles.conversationItem,
                          conversation.id === currentConversationId && styles.activeConversation
                        ]}
                        onPress={() => handleConversationPress(conversation)}
                        onLongPress={() => handleDeleteConversation(conversation.id, conversation.title)}
                      >
                        <View style={styles.conversationContent}>
                          <Text style={styles.conversationTitle} numberOfLines={2}>
                            {conversation.title}
                          </Text>
                          <View style={styles.conversationMeta}>
                            <Text style={styles.conversationDate}>
                              {formatDate(conversation.updatedAt || conversation.createdAt)}
                            </Text>
                            {conversation.messages && (
                              <Text style={styles.messageCount}>
                                {conversation.messages.length} msg{conversation.messages.length !== 1 ? 's' : ''}
                              </Text>
                            )}
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteConversation(conversation.id, conversation.title)}
                        >
                          <Text style={styles.deleteIcon}>🗑️</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              )}
            </View>
            
            {/* Footer */}
            <View style={styles.footer}>
              {footerItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.footerItem}
                  onPress={() => handleFooterItemPress(item)}
                >
                  <Text style={styles.footerIcon}>{item.icon}</Text>
                  <Text style={styles.footerText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'relative',
  },
  overlayTouch: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 320,
    backgroundColor: '#ffffff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  sidebarContent: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 16,
    color: '#4a90e2',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  newChatIcon: {
    fontSize: 16,
    color: '#ffffff',
  },
  newChatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exportButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportIcon: {
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  conversationsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: '#ffffff',
  },
  activeConversation: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
    lineHeight: 18,
  },
  conversationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  messageCount: {
    fontSize: 11,
    color: '#95a5a6',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fafafa',
    paddingVertical: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  footerIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
});