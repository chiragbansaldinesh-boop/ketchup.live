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
import { Send, MapPin, MoreVertical, Shield, TriangleAlert as AlertTriangle, ArrowLeft, Check, CheckCheck, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import BlockUserModal from '@/components/BlockUserModal';
import { privacyService } from '@/services/privacyService';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import EmptyState from '@/components/ui/EmptyState';
import { OnlineIndicator } from '@/components/ui/Badge';
import AIChatAssistant from '@/components/AIChatAssistant';

interface Chat {
  id: string;
  name: string;
  photo: string;
  venue: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  matchedAt?: string;
  isOnline?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  read?: boolean;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Emma',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    venue: 'Blue Bottle Coffee',
    lastMessage: 'That sounds like a great idea!',
    timestamp: '2 min',
    unread: true,
    matchedAt: 'Blue Bottle Coffee',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Alex',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    venue: 'The Rusty Anchor',
    lastMessage: "Let's grab coffee sometime!",
    timestamp: '1 hr',
    unread: false,
    matchedAt: 'The Rusty Anchor',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Sophie',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    venue: 'Central Park Cafe',
    lastMessage: 'Thanks for the coffee recommendation!',
    timestamp: 'Yesterday',
    unread: false,
    matchedAt: 'Central Park Cafe',
    isOnline: true,
  },
];

const icebreakers = [
  "What's your favorite spot here?",
  "Any recommendations?",
  "Come here often?",
  "Great vibe, right?",
];

export default function ChatScreen() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! Nice to meet you at the cafe',
      sender: 'other',
      timestamp: '2:30 PM',
    },
    {
      id: '2',
      text: 'Hi! Yeah, great place. Do you come here often?',
      sender: 'me',
      timestamp: '2:32 PM',
      read: true,
    },
    {
      id: '3',
      text: 'Pretty regularly! The coffee is amazing',
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
        read: false,
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
      read: false,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAISuggestion = (text: string) => {
    setMessage(text);
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
            <Shield size={20} color={colors.error.main} />
            <Text style={styles.menuText}>Block User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleReportUser}
          >
            <AlertTriangle size={20} color={colors.warning.main} />
            <Text style={styles.menuText}>Report User</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );

  if (selectedChat) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.conversationHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedChat(null)}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerProfile}>
            <View style={styles.headerAvatarContainer}>
              <Image source={{ uri: selectedChat.photo }} style={styles.headerPhoto} />
              {selectedChat.isOnline && (
                <View style={styles.headerOnlineIndicator}>
                  <OnlineIndicator size={14} />
                </View>
              )}
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerName}>{selectedChat.name}</Text>
              <View style={styles.headerVenue}>
                <MapPin size={12} color={colors.text.tertiary} />
                <Text style={styles.headerVenueText}>{selectedChat.matchedAt || selectedChat.venue}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.aiToggleButton, showAIAssistant && styles.aiToggleButtonActive]}
            onPress={() => setShowAIAssistant(!showAIAssistant)}
          >
            <Sparkles size={18} color={showAIAssistant ? colors.text.inverse : colors.primary.main} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowChatMenu(true)}
          >
            <MoreVertical size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {isUserBlocked ? (
          <View style={styles.blockedContainer}>
            <View style={styles.blockedIconContainer}>
              <Shield size={32} color={colors.error.main} />
            </View>
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
              contentContainerStyle={styles.messagesContent}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageContainer,
                    item.sender === 'me' ? styles.myMessage : styles.otherMessage,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      item.sender === 'me' ? styles.myBubble : styles.otherBubble,
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
                  </View>
                  <View style={[
                    styles.messageFooter,
                    item.sender === 'me' ? styles.myFooter : styles.otherFooter,
                  ]}>
                    <Text style={styles.messageTime}>{item.timestamp}</Text>
                    {item.sender === 'me' && (
                      item.read ? (
                        <CheckCheck size={14} color={colors.accent.mint} />
                      ) : (
                        <Check size={14} color={colors.text.tertiary} />
                      )
                    )}
                  </View>
                </View>
              )}
            />

            {showAIAssistant ? (
              <AIChatAssistant
                matchName={selectedChat.name}
                matchInterests={[]}
                messageCount={messages.length}
                onSelectSuggestion={handleAISuggestion}
              />
            ) : (
              <View style={styles.icebreakerSection}>
                <Text style={styles.icebreakerLabel}>Quick replies</Text>
                <FlatList
                  horizontal
                  data={icebreakers}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.icebreakerList}
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
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                placeholderTextColor={colors.text.tertiary}
                multiline
              />
              <TouchableOpacity
                style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!message.trim()}
              >
                <Send size={20} color={colors.text.inverse} />
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>
          {mockChats.filter(c => c.unread).length} unread
        </Text>
      </View>

      {mockChats.length === 0 ? (
        <EmptyState type="chat" />
      ) : (
        <FlatList
          data={mockChats}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => handleChatSelect(item)}
              activeOpacity={0.7}
            >
              <View style={styles.avatarContainer}>
                <Image source={{ uri: item.photo }} style={styles.avatar} />
                {item.isOnline && (
                  <View style={styles.onlineIndicatorWrapper}>
                    <OnlineIndicator size={14} />
                  </View>
                )}
              </View>
              <View style={styles.chatContent}>
                <View style={styles.chatTopRow}>
                  <Text style={styles.chatName}>{item.name}</Text>
                  <Text style={[styles.chatTime, item.unread && styles.chatTimeUnread]}>
                    {item.timestamp}
                  </Text>
                </View>
                <View style={styles.venueContainer}>
                  <MapPin size={12} color={colors.text.tertiary} />
                  <Text style={styles.venueText}>{item.matchedAt || item.venue}</Text>
                </View>
                <Text
                  style={[styles.lastMessage, item.unread && styles.lastMessageUnread]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
              </View>
              {item.unread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  chatsList: {
    paddingVertical: spacing.sm,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicatorWrapper: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  chatContent: {
    flex: 1,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chatName: {
    ...typography.bodySemibold,
    color: colors.text.primary,
  },
  chatTime: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  chatTimeUnread: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  venueText: {
    ...typography.small,
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
  },
  lastMessage: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  lastMessageUnread: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary.main,
    marginLeft: spacing.sm,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  headerAvatarContainer: {
    position: 'relative',
  },
  headerPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  headerOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  headerTextContainer: {
    marginLeft: spacing.md,
  },
  headerName: {
    ...typography.bodySemibold,
    color: colors.text.primary,
  },
  headerVenue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerVenueText: {
    ...typography.small,
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
  },
  aiToggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  aiToggleButtonActive: {
    backgroundColor: colors.primary.main,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  messagesContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  messageContainer: {
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  myBubble: {
    backgroundColor: colors.primary.main,
    borderBottomRightRadius: spacing.xs,
  },
  otherBubble: {
    backgroundColor: colors.background.primary,
    borderBottomLeftRadius: spacing.xs,
    ...shadows.sm,
  },
  messageText: {
    ...typography.body,
    lineHeight: 22,
  },
  myMessageText: {
    color: colors.text.inverse,
  },
  otherMessageText: {
    color: colors.text.primary,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  myFooter: {
    justifyContent: 'flex-end',
  },
  otherFooter: {
    justifyContent: 'flex-start',
  },
  messageTime: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  icebreakerSection: {
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  icebreakerLabel: {
    ...typography.small,
    color: colors.text.tertiary,
    marginLeft: spacing.lg,
    marginBottom: spacing.sm,
  },
  icebreakerList: {
    paddingHorizontal: spacing.lg,
  },
  icebreakerButton: {
    backgroundColor: colors.secondary.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  icebreakerText: {
    ...typography.captionMedium,
    color: colors.primary.main,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    alignItems: 'flex-end',
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    maxHeight: 100,
    marginRight: spacing.md,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  sendButtonDisabled: {
    backgroundColor: colors.text.tertiary,
  },
  blockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  blockedIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  blockedTitle: {
    ...typography.h3,
    color: colors.error.main,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  blockedText: {
    ...typography.body,
    color: colors.text.secondary,
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menu: {
    position: 'absolute',
    top: 100,
    right: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.lg,
    minWidth: 180,
  },
  menuContent: {
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
});
