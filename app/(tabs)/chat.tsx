import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { Send, MapPin, Gamepad as GamepadIcon, MoveVertical as MoreVertical, Shield, TriangleAlert as AlertTriangle, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import BlockUserModal from '@/components/BlockUserModal';
import { privacyService } from '@/services/privacyService';

interface Chat {
  id: string;
  name: string;
  photo: string;
  venue: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  matchedAt?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Emma',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    venue: 'Blue Bottle Coffee',
    lastMessage: 'That sounds like a great idea! 😊',
    timestamp: '2 min ago',
    unread: true,
    matchedAt: 'Blue Bottle Coffee',
  },
  {
    id: '2',
    name: 'Alex',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    venue: 'The Rusty Anchor',
    lastMessage: 'Let\'s play a game! 🎮',
    timestamp: '1 hour ago',
    unread: false,
    matchedAt: 'The Rusty Anchor',
  },
  {
    id: '3',
    name: 'Sophie',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    venue: 'Central Park Café',
    lastMessage: 'Thanks for the coffee recommendation!',
    timestamp: 'Yesterday',
    unread: false,
    matchedAt: 'Central Park Café',
  },
];

const icebreakers = [
  "What's your favorite thing about this place?",
  "Any good menu recommendations?",
  "Come here often?",
  "What brings you here today?",
];

export default function ChatScreen() {
  // TODO: Replace with actual user ID from authentication
  const currentUserId = 'current-user-id';
  
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! Nice to meet you at the café',
      sender: 'other',
      timestamp: '2:30 PM',
    },
    {
      id: '2',
      text: 'Hi! Yeah, great place. Do you come here often?',
      sender: 'me',
      timestamp: '2:32 PM',
    },
    {
      id: '3',
      text: 'Pretty regularly! The coffee is amazing ☕',
      sender: 'other',
      timestamp: '2:33 PM',
    },
  ]);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const sendIcebreaker = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const checkBlockStatus = async (userId: string) => {
    try {
      const blocked = await privacyService.isUserBlocked(userId);
      setIsUserBlocked(blocked);
    } catch (error) {
      console.error('Error checking block status:', error);
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    checkBlockStatus(chat.id);
  };

  const handleUserBlocked = () => {
    setIsUserBlocked(true);
    setShowBlockModal(false);
    setShowChatMenu(false);
  };

  const handleReportUser = () => {
    setShowChatMenu(false);
    Alert.alert(
      'Report User',
      'This will report the user to our safety team for review.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Report', 
          style: 'destructive',
          onPress: () => {
            // Handle report submission
            Alert.alert('Report Submitted', 'Thank you for reporting. Our team will review this.');
          }
        },
      ]
    );
  };

  const ChatMenu = () => (
    <View style={styles.menuOverlay}>
      <TouchableOpacity 
        style={styles.menuBackdrop} 
        onPress={() => setShowChatMenu(false)}
      />
      <BlurView intensity={80} style={styles.menu}>
        <View style={styles.menuContent}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              setShowChatMenu(false);
              setShowBlockModal(true);
            }}
          >
            <Shield size={20} color="#DC2626" />
            <Text style={styles.menuText}>Block User</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleReportUser}
          >
            <AlertTriangle size={20} color="#F59E0B" />
            <Text style={styles.menuText}>Report User</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );

  if (selectedChat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedChat(null)}
          >
            <ArrowLeft size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Image source={{ uri: selectedChat.photo }} style={styles.headerPhoto} />
            <View>
              <Text style={styles.headerName}>{selectedChat.name}</Text>
              <View style={styles.headerVenue}>
                <MapPin size={12} color="#6B7280" />
                <Text style={styles.headerVenueText}>Met at {selectedChat.matchedAt || selectedChat.venue}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setShowChatMenu(true)}
          >
            <MoreVertical size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {isUserBlocked ? (
          <View style={styles.blockedContainer}>
            <Shield size={32} color="#DC2626" />
            <Text style={styles.blockedTitle}>User Blocked</Text>
            <Text style={styles.blockedText}>
              You have blocked this user. They cannot see your profile or send you messages.
            </Text>
          </View>
        ) : (
          <>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender === 'me' ? styles.myMessage : styles.otherMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === 'me' ? styles.myMessageText : styles.otherMessageText,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  item.sender === 'me' ? styles.myMessageTime : styles.otherMessageTime,
                ]}
              >
                {item.timestamp}
              </Text>
            </View>
          )}
        />

        <View style={styles.icebreakerContainer}>
          <FlatList
            horizontal
            data={icebreakers}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.icebreakerButton}
                onPress={() => sendIcebreaker(item)}
              >
                <Text style={styles.icebreakerText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
          </>
        )}

        {showChatMenu && <ChatMenu />}
        
        <BlockUserModal
          visible={showBlockModal}
          onClose={() => setShowBlockModal(false)}
          userId={selectedChat.id}
          userName={selectedChat.name}
          venue={selectedChat.venue}
          onUserBlocked={handleUserBlocked}
        />
      </SafeAreaView>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainHeader}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>
              {mockChats.filter(c => c.unread).length} new conversations
            </Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <FlatList
          data={mockChats}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => handleChatSelect(item)}
            >
              <Image source={{ uri: item.photo }} style={styles.avatar} />
              <View style={styles.chatContent}>
                <View style={styles.chatMeta}>
                  <Text style={styles.chatName}>{item.name}</Text>
                  <Text style={styles.chatTime}>{item.timestamp}</Text>
                </View>
                <View style={styles.venueContainer}>
                  <MapPin size={12} color="#6B7280" />
                  <Text style={styles.venueText}>Met at {item.matchedAt || item.venue}</Text>
                </View>
                <Text style={[styles.lastMessage, item.unread && styles.unreadMessage]}>
                  {item.lastMessage}
                </Text>
              </View>
              {item.unread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  safeArea: {
    flex: 1,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(225,6,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  headerContent: {
    alignItems: 'center',
  },
  chatsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFDF9',
    marginBottom: 12,
    borderRadius: 24,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.05)',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  chatContent: {
    flex: 1,
  },
  chatMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  chatTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
  },
  unreadMessage: {
    color: '#1A1A1A',
    fontWeight: '500',
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D50000',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  headerVenue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerVenueText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(225,6,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '75%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessageText: {
    backgroundColor: '#E10600',
    color: '#FFFDF9',
  },
  otherMessageText: {
    backgroundColor: 'rgba(225,6,0,0.08)',
    color: '#1A1A1A',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  myMessageTime: {
    color: '#9CA3AF',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#9CA3AF',
    textAlign: 'left',
  },
  icebreakerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  icebreakerButton: {
    backgroundColor: 'rgba(225,6,0,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 12,
  },
  icebreakerText: {
    fontSize: 14,
    color: '#E10600',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(225,6,0,0.05)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E10600',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  blockedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  blockedText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    position: 'absolute',
    top: 120,
    right: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: 'rgba(225,6,0,0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
    minWidth: 160,
  },
  menuContent: {
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginLeft: 12,
  },
});