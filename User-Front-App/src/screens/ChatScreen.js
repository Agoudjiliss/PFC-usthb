// src/screens/ChatScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Alert, 
  FlatList,
  TouchableOpacity,
  Dimensions 
} from 'react-native';

// Components
import { HamburgerMenu } from '../components/Chat/HamburgerMenu';
import { ChatInput } from '../components/Chat/ChatInput';
import { InfoCard } from '../components/Chat/InfoCard';
import { MessageBubble } from '../components/Chat/MessageBubble';
import { TypingIndicator } from '../components/Chat/TypingIndicator';
import { Sidebar } from '../components/Sidebar';

// Context and Services
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/ChatService';
import { conversationHistoryService } from '../services/conversationHistoryService';
import { checkBackendHealth } from '../config/api';

const { width } = Dimensions.get('window');

export const ChatScreen = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [networkStatus, setNetworkStatus] = useState('checking'); // 'online', 'offline', 'checking'
  const [lastHealthCheck, setLastHealthCheck] = useState(null);
  const flatListRef = useRef(null);

  const userId = user?.username || 'user';

  // Load conversation history and check network health on component mount
  useEffect(() => {
    initializeChat();
  }, []);

  // Periodic health check every 30 seconds
  useEffect(() => {
    const healthCheckInterval = setInterval(() => {
      performHealthCheck();
    }, 30000); // 30 seconds

    return () => clearInterval(healthCheckInterval);
  }, []);

  const initializeChat = async () => {
    try {
      // Initial health check
      await performHealthCheck();
      
      // Load conversation history
      await loadConversationHistory();
      
      console.log('Chat initialized successfully');
    } catch (error) {
      console.error('Chat initialization error:', error);
    }
  };

  const performHealthCheck = async () => {
    try {
      setNetworkStatus('checking');
      const healthResult = await checkBackendHealth();
      
      if (healthResult.healthy) {
        setNetworkStatus('online');
        setLastHealthCheck(new Date());
        console.log('Backend health check: HEALTHY');
      } else {
        setNetworkStatus('offline');
        console.log('Backend health check: UNHEALTHY');
      }
    } catch (error) {
      setNetworkStatus('offline');
      console.log('Backend health check failed:', error.message);
    }
  };

  const loadConversationHistory = async () => {
    try {
      const conversationList = await conversationHistoryService.getConversations(userId);
      setConversations(conversationList);
      console.log(`Loaded ${conversationList.length} conversations`);
    } catch (error) {
      console.error('Error loading conversation history:', error);
      // Load from local storage as fallback
      const localConversations = await conversationHistoryService.getLocalHistory();
      setConversations(localConversations);
    }
  };

  const handleSidebarToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleSidebarNavigate = async (action, data) => {
    switch (action) {
      case 'newchat':
        handleNewChat();
        break;
      case 'conversation':
        await loadConversation(data);
        break;
      case 'clear':
        Alert.alert(
          'Effacer les conversations',
          'Êtes-vous sûr de vouloir supprimer toutes les conversations ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Effacer', style: 'destructive', onPress: handleClearAllConversations }
          ]
        );
        break;
      case 'faq':
        Alert.alert(
          'Support USTHB Bot', 
          'Pour toute question sur l\'utilisation ou pour signaler un problème, contactez l\'équipe Innovation Hub USTHB.\n\nEmail: innovation.hub@usthb.dz'
        );
        break;
      case 'network':
        showNetworkInfo();
        break;
      case 'logout':
        Alert.alert(
          'Déconnexion',
          'Êtes-vous sûr de vouloir vous déconnecter ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Déconnecter', style: 'destructive', onPress: handleLogout }
          ]
        );
        break;
      default:
        console.log('Sidebar action:', action);
    }
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    console.log('New chat started');
  };

  const loadConversation = async (conversation) => {
    try {
      console.log('Loading conversation:', conversation.title);
      setCurrentConversationId(conversation.id);
      setMessages(conversation.messages || []);
    } catch (error) {
      console.error('Error loading conversation:', error);
      Alert.alert('Erreur', 'Impossible de charger la conversation');
    }
  };

  const handleClearAllConversations = async () => {
    try {
      await conversationHistoryService.clearAllConversations();
      setMessages([]);
      setCurrentConversationId(null);
      setConversations([]);
      console.log('All conversations cleared');
    } catch (error) {
      console.error('Error clearing conversations:', error);
      Alert.alert('Erreur', 'Impossible d\'effacer les conversations');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const generateConversationTitle = (firstMessage) => {
    if (!firstMessage) return 'Nouvelle conversation USTHB';
    
    const cleanMessage = firstMessage.replace(/[^\w\s]/gi, '').trim();
    const words = cleanMessage.split(' ').slice(0, 4);
    
    if (words.length === 0) return 'Nouvelle conversation USTHB';
    
    let title = words.join(' ');
    if (title.length > 30) {
      title = title.substring(0, 27) + '...';
    }
    
    return title || 'Nouvelle conversation USTHB';
  };

  const saveConversation = async (conversationId, updatedMessages, isNewConversation = false) => {
    try {
      const conversationTitle = isNewConversation ? 
        generateConversationTitle(updatedMessages[0]?.text) : 
        conversations.find(c => c.id === conversationId)?.title || 'Chat USTHB';

      const conversation = {
        id: conversationId,
        title: conversationTitle,
        messages: updatedMessages,
        userId: userId,
        createdAt: isNewConversation ? new Date().toISOString() : 
          conversations.find(c => c.id === conversationId)?.createdAt,
        updatedAt: new Date().toISOString(),
      };

      // Save locally
      await conversationHistoryService.saveConversation(conversation);

      // Update conversations list
      const updatedConversations = conversations.filter(c => c.id !== conversationId);
      updatedConversations.unshift(conversation);
      const limitedConversations = updatedConversations.slice(0, 50);
      setConversations(limitedConversations);

      console.log('Conversation saved:', conversationTitle);
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const handleSendMessage = async (messageText) => {
    if (isLoading) return;

    // Check network status before sending
    if (networkStatus === 'offline') {
      Alert.alert(
        'Service indisponible',
        'Le service USTHB Bot n\'est pas disponible. Vérifiez votre connexion et l\'état du serveur.',
        [
          { text: 'OK' },
          { 
            text: 'Vérifier la connexion', 
            onPress: performHealthCheck 
          }
        ]
      );
      return;
    }

    const timestamp = new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Generate conversation ID if this is a new chat
    const conversationId = currentConversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const isNewConversation = !currentConversationId;

    if (isNewConversation) {
      setCurrentConversationId(conversationId);
    }

    // Create user message
    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: timestamp,
      createdAt: new Date().toISOString(),
    };

    // Add user message immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setIsTyping(true);

    try {
      console.log('Sending message to USTHB Bot...');
      
      // Send message to backend (Spring Boot -> Rasa)
      const response = await chatService.sendMessage(messageText, conversationId);
      
      if (response.success) {
        // Update network status to online if message was successful
        if (networkStatus !== 'online') {
          setNetworkStatus('online');
          setLastHealthCheck(new Date());
        }

        // Extract bot response
        const botResponseText = response.data.responses?.[0]?.text || 
                              response.data.response || 
                              "Désolé, je n'ai pas pu traiter votre demande.";
        
        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: botResponseText,
          isUser: false,
          timestamp: new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          createdAt: new Date().toISOString(),
        };

        // Add bot response
        const finalMessages = [...updatedMessages, botMessage];
        setMessages(finalMessages);
        
        // Save conversation
        await saveConversation(conversationId, finalMessages, isNewConversation);

        console.log('Message sent successfully to USTHB Bot');
      } else {
        throw new Error('Failed to get response from bot');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update network status if this looks like a network issue
      if (error.message.includes('Network') || error.message.includes('timeout') || error.message.includes('fetch')) {
        setNetworkStatus('offline');
      }
      
      // Remove the user message if sending failed
      setMessages(messages);
      
      // Show error with retry and health check options
      Alert.alert(
        'Erreur de connexion', 
        'Erreur lors de l\'envoi du message. Vérifiez votre connexion et réessayez.',
        [
          { text: 'OK' },
          { text: 'Vérifier la connexion', onPress: performHealthCheck },
          { text: 'Réessayer', onPress: () => handleSendMessage(messageText) }
        ]
      );
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const infoCards = [
    {
      icon: '💡',
      title: 'Exemples',
      descriptions: [
        'Comment créer une startup en Algérie ?',
        'Quelles aides financières pour les jeunes entrepreneurs ?',
        'Comment rédiger un business plan efficace ?'
      ],
      iconBgColor: '#fff3e0',
      iconColor: '#f57f17'
    },
    {
      icon: '🎯',
      title: 'Capacités',
      descriptions: [
        'Conseils sur la création et gestion de startups',
        'Informations sur le financement et la législation algérienne',
        'Accompagnement dans l\'élaboration de business plans'
      ],
      iconBgColor: '#e8f5e8',
      iconColor: '#2e7d32'
    },
    {
      icon: '⚠️',
      title: 'Limites',
      descriptions: [
        'Ne remplace pas un conseil juridique professionnel',
        'Peut fournir des réponses incomplètes ou approximatives',
        'Les informations peuvent ne pas être à jour'
      ],
      iconBgColor: '#fce4ec',
      iconColor: '#c2185b'
    }
  ];

  const renderMessage = ({ item }) => (
    <MessageBubble
      message={item.text}
      isUser={item.isUser}
      timestamp={item.timestamp}
    />
  );

  const hasMessages = messages.length > 0;

  // Connection Status Component
  const ConnectionStatus = () => {
    const getStatusInfo = () => {
      switch (networkStatus) {
        case 'online':
          return {
            color: '#2e7d32',
            text: 'En ligne',
            icon: '🟢'
          };
        case 'offline':
          return {
            color: '#d32f2f',
            text: 'Hors ligne',
            icon: '🔴'
          };
        case 'checking':
        default:
          return {
            color: '#ff9800',
            text: 'Vérification...',
            icon: '🟡'
          };
      }
    };

    const statusInfo = getStatusInfo();

    return (
      <TouchableOpacity 
        style={styles.connectionStatus} 
        onPress={performHealthCheck}
        activeOpacity={0.7}
      >
        <View style={[
          styles.connectionDot, 
          { backgroundColor: statusInfo.color }
        ]} />
        <Text style={[styles.connectionText, { color: statusInfo.color }]}>
          {statusInfo.text}
        </Text>
      </TouchableOpacity>
    );
  };

  // Network Status Info Modal
  const showNetworkInfo = () => {
    const lastCheckText = lastHealthCheck 
      ? `Dernière vérification: ${lastHealthCheck.toLocaleTimeString('fr-FR')}`
      : 'Aucune vérification récente';

    Alert.alert(
      'État du réseau',
      `Statut: ${networkStatus === 'online' ? 'En ligne' : networkStatus === 'offline' ? 'Hors ligne' : 'Vérification en cours'}\n\n${lastCheckText}\n\nAppuyez sur "Vérifier" pour tester la connexion maintenant.`,
      [
        { text: 'OK' },
        { 
          text: 'Vérifier', 
          onPress: performHealthCheck 
        }
      ]
    );
  };

  // New Chat Button Component
  const NewChatButton = () => (
    <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
      <Text style={styles.newChatButtonText}>+</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HamburgerMenu onPress={handleSidebarToggle} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            Bienvenue, {user?.username || 'Utilisateur'}
          </Text>
          <Text style={styles.headerSubtitle}>
            USTHB Bot - Assistant Entrepreneuriat
          </Text>
          <ConnectionStatus />
        </View>
        <NewChatButton />
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {!hasMessages ? (
          // Welcome Content
          <ScrollView style={styles.welcomeScrollView} contentContainerStyle={styles.welcomeContainer}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>
                Bienvenue sur <Text style={styles.usthbHighlight}>USTHB</Text> Bot
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Votre assistant intelligent pour l'entrepreneuriat en Algérie
              </Text>
              <Text style={styles.welcomeDescription}>
                Posez vos questions sur la création d'entreprise, le financement, 
                les démarches administratives et l'Innovation Hub USTHB.
              </Text>
              {networkStatus === 'offline' && (
                <View style={styles.networkWarning}>
                  <Text style={styles.networkWarningText}>
                    ⚠️ Service temporairement indisponible
                  </Text>
                  <TouchableOpacity onPress={performHealthCheck} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Réessayer la connexion</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.infoGrid}>
              {infoCards.map((card, index) => (
                <InfoCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  descriptions={card.descriptions}
                  iconBgColor={card.iconBgColor}
                  iconColor={card.iconColor}
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          // Messages List
          <View style={styles.messagesContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            />
            {isTyping && <TypingIndicator />}
          </View>
        )}
      </View>

      {/* Chat Input */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder={hasMessages ? 
          "Tapez votre message..." : 
          "Posez votre question sur l'entrepreneuriat en Algérie..."
        }
      />

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onNavigate={handleSidebarNavigate}
        currentConversationId={currentConversationId}
        userId={userId}
        conversations={conversations}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4a90e2',
    fontWeight: '500',
    marginBottom: 4,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  newChatButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '300',
    marginTop: -2,
  },
  contentArea: {
    flex: 1,
  },
  welcomeScrollView: {
    flex: 1,
  },
  welcomeContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  usthbHighlight: {
    color: '#667eea',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#4a90e2',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  welcomeDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  networkWarning: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
    alignItems: 'center',
  },
  networkWarningText: {
    fontSize: 14,
    color: '#f57f17',
    fontWeight: '600',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoGrid: {
    gap: 20,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 0,
  },
  messagesContent: {
    paddingVertical: 20,
  },
});