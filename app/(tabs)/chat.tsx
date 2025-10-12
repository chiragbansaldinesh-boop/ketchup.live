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
} from 'react-native';
import { Send, MapPin, Gamepad as GamepadIcon, MoveVertical as MoreVertical, Shield, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import BlockUserModal from '@/components/BlockUserModal';
import { privacyService } from '@/services/privacyService';
import { ScrollView } from 'react-native';

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
    <View style={styles.chatMenuOverlay}>
      <TouchableOpacity 
        style={styles.chatMenuBackdrop} 
        onPress={() => setShowChatMenu(false)}
      />
      <View style={styles.chatMenu}>
        <TouchableOpacity 
          style={styles.chatMenuItem}
          onPress={() => {
            setShowChatMenu(false);
            setShowBlockModal(true);
          }}
        >
          <Shield size={20} color="#DC2626" />
          <Text style={styles.chatMenuText}>Block User</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.chatMenuItem}
          onPress={handleReportUser}
        >
          <AlertTriangle size={20} color="#F59E0B" />
          <Text style={styles.chatMenuText}>Report User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (selectedChat) {
    return (
      <View style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedChat(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Image source={{ uri: selectedChat.photo }} style={styles.chatHeaderPhoto} />
            <View>
              <Text style={styles.chatHeaderName}>{selectedChat.name}</Text>
              <View style={styles.chatHeaderVenue}>
                <MapPin size={12} color="#6B7280" />
                <Text style={styles.chatHeaderVenueText}>Met at {selectedChat.matchedAt || selectedChat.venue}</Text>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>
          {mockChats.filter(c => c.unread).length} new conversations
        </Text>
      </View>

      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    color: '#374151',
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
    color: '#374151',
    fontWeight: '500',
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E53935',
    alignSelf: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    fontSize: 16,
    color: '#E53935',
    fontWeight: '500',
    marginRight: 16,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  chatHeaderVenue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  chatHeaderVenueText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
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
    backgroundColor: '#E53935',
    color: '#FFFFFF',
  },
  otherMessageText: {
    backgroundColor: '#FFFFFF',
    color: '#374151',
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  icebreakerButton: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  icebreakerText: {
    fontSize: 14,
    color: '#E53935',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E53935',
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
  chatMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  chatMenuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  chatMenu: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 160,
  },
  chatMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  chatMenuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
  },
});