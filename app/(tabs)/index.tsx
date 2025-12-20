import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { X, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import FloatingAvatar from '@/components/FloatingAvatar';
import ProfileStoryViewer from '@/components/ProfileStoryViewer';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Person {
  id: string;
  name: string;
  age: number;
  photo: string;
  photos: string[];
  interests: string[];
  prompts: Array<{ question: string; answer: string }>;
  isActive: boolean;
  position: { x: number; y: number };
}

const mockPeople: Person[] = [
  {
    id: '1',
    name: 'Emma',
    age: 26,
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    photos: [
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    interests: ['Coffee', 'Art', 'Travel'],
    prompts: [
      { question: 'My perfect Sunday', answer: 'Coffee, art galleries, and sunset at the beach' },
      { question: 'I\'m looking for', answer: 'Someone who loves spontaneous adventures' },
    ],
    isActive: true,
    position: { x: 80, y: 180 },
  },
  {
    id: '2',
    name: 'Alex',
    age: 28,
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    photos: [
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    interests: ['Music', 'Food', 'Hiking'],
    prompts: [
      { question: 'A random fact I love', answer: 'Honey never spoils!' },
    ],
    isActive: true,
    position: { x: 250, y: 220 },
  },
  {
    id: '3',
    name: 'Sophie',
    age: 24,
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    photos: [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    interests: ['Books', 'Yoga', 'Photography'],
    prompts: [
      { question: 'Change my mind about', answer: 'Digital books are better than physical books' },
    ],
    isActive: false,
    position: { x: 150, y: 350 },
  },
  {
    id: '4',
    name: 'James',
    age: 29,
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    photos: [
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    interests: ['Tech', 'Fitness', 'Cooking'],
    prompts: [
      { question: 'My simple pleasures', answer: 'Morning coffee and a good workout' },
    ],
    isActive: true,
    position: { x: 290, y: 420 },
  },
];

export default function LiveSpaceScreen() {
  const [people] = useState(mockPeople);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const quickActionsAnim = useRef(new Animated.Value(0)).current;

  // Gesture handling for navigation
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
      },
      onPanResponderMove: (_, gestureState) => {
        // Handle swipe gestures for navigation
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          // Horizontal swipes
          if (gestureState.dx > 50) {
            // Swipe right → Messages
            router.push('/chat');
          } else if (gestureState.dx < -50) {
            // Swipe left → Profile
            router.push('/profile');
          }
        } else {
          // Vertical swipes
          if (gestureState.dy > 50) {
            // Swipe down → Stories
            router.push('/stories');
          } else if (gestureState.dy < -50) {
            // Swipe up → People (venues)
            router.push('/venues');
          }
        }
      },
    })
  ).current;

  const handleAvatarPress = (person: Person) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPerson(person);
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseProfile = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedPerson(null);
    });
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShowQuickActions(true);
    Animated.spring(quickActionsAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const hideQuickActions = () => {
    Animated.timing(quickActionsAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowQuickActions(false);
    });
  };

  const QuickActionsOverlay = () => (
    <Modal
      visible={showQuickActions}
      transparent
      animationType="none"
      onRequestClose={hideQuickActions}
    >
      <TouchableOpacity style={styles.quickActionsOverlay} onPress={hideQuickActions}>
        <Animated.View
          style={[
            styles.quickActionsContainer,
            {
              opacity: quickActionsAnim,
              transform: [
                {
                  scale: quickActionsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <BlurView intensity={80} style={styles.quickActionsBlur}>
            <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/scanner')}>
              <Text style={styles.quickActionText}>Scan QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/settings')}>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/settings/premium')}>
              <Text style={styles.quickActionText}>Go Premium</Text>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.canvas}
          onLongPress={handleLongPress}
          delayLongPress={500}
          activeOpacity={1}
        >
          <View style={styles.header}>
            <Text style={styles.venueTitle}>You're at Vince Café</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>

          <View style={styles.peopleCanvas}>
            {people.map((person) => (
              <FloatingAvatar
                key={person.id}
                id={person.id}
                photo={person.photo}
                name={person.name}
                isActive={person.isActive}
                position={person.position}
                onPress={() => handleAvatarPress(person)}
              />
            ))}
          </View>

          <View style={styles.gestureHints}>
            <Text style={styles.hintText}>Swipe up for People • Down for Stories</Text>
            <Text style={styles.hintText}>Left for Profile • Right for Messages</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>

      {selectedPerson && (
        <ProfileStoryViewer
          person={selectedPerson}
          visible={!!selectedPerson}
          onClose={handleCloseProfile}
          slideAnim={slideAnim}
        />
      )}

      <QuickActionsOverlay />
    </View>
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
  canvas: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venueTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(225,6,0,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E10600',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E10600',
  },
  peopleCanvas: {
    flex: 1,
    position: 'relative',
  },
  gestureHints: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 12,
    color: 'rgba(26,26,26,0.4)',
    fontWeight: '500',
    marginBottom: 4,
  },
  quickActionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: 'rgba(225,6,0,0.12)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
  },
  quickActionsBlur: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    minWidth: 200,
  },
  quickAction: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});