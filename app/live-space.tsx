import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { X, Heart, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import FloatingAvatar from '@/components/FloatingAvatar';
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
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 20;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          handleCloseProfile();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleAvatarPress = (person: Person) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPerson(person);
    setCurrentPromptIndex(0);
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

  const handleNextPrompt = () => {
    if (selectedPerson && currentPromptIndex < selectedPerson.photos.length + selectedPerson.prompts.length) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    }
  };

  const handleSendSpark = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleCloseProfile();
  };

  const renderProfileContent = () => {
    if (!selectedPerson) return null;

    const totalFrames = selectedPerson.photos.length + selectedPerson.prompts.length + 1;

    if (currentPromptIndex < selectedPerson.photos.length) {
      return (
        <Image
          source={{ uri: selectedPerson.photos[currentPromptIndex] }}
          style={styles.profilePhoto}
          resizeMode="cover"
        />
      );
    } else if (currentPromptIndex < selectedPerson.photos.length + selectedPerson.prompts.length) {
      const promptIndex = currentPromptIndex - selectedPerson.photos.length;
      const prompt = selectedPerson.prompts[promptIndex];
      return (
        <View style={styles.promptFrame}>
          <Text style={styles.promptQuestion}>{prompt.question}</Text>
          <Text style={styles.promptAnswer}>{prompt.answer}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.finalFrame}>
          <View style={styles.interestsDisplay}>
            {selectedPerson.interests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestChipText}>{interest}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.sparkButton} onPress={handleSendSpark}>
            <Sparkles size={24} color="#FFFDF9" fill="#FFFDF9" />
            <Text style={styles.sparkButtonText}>Send Spark 🔥</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.venueTitle}>You're at Vince Café</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>

        <View style={styles.canvas}>
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
      </SafeAreaView>

      <Modal
        visible={!!selectedPerson}
        animationType="none"
        transparent
        onRequestClose={handleCloseProfile}
      >
        <Animated.View
          style={[
            styles.profileModal,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.profileHandle} />
          <TouchableOpacity style={styles.profileContent} onPress={handleNextPrompt} activeOpacity={0.9}>
            {renderProfileContent()}
            {selectedPerson && (
              <View style={styles.profileOverlay}>
                <View style={styles.progressBars}>
                  {Array.from({ length: selectedPerson.photos.length + selectedPerson.prompts.length + 1 }).map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.progressBar,
                        index <= currentPromptIndex && styles.progressBarActive,
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {selectedPerson.name}, {selectedPerson.age}
                  </Text>
                  <TouchableOpacity style={styles.closeButton} onPress={handleCloseProfile}>
                    <X size={24} color="#FFFDF9" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Modal>
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
  canvas: {
    flex: 1,
    position: 'relative',
  },
  profileModal: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 100,
    overflow: 'hidden',
  },
  profileHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,253,249,0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  profileContent: {
    flex: 1,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  promptFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#E10600',
  },
  promptQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,253,249,0.8)',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  promptAnswer: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFDF9',
    textAlign: 'center',
    lineHeight: 44,
  },
  finalFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#FFFDF9',
  },
  interestsDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  interestChip: {
    backgroundColor: 'rgba(225,6,0,0.08)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    margin: 6,
  },
  interestChipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E10600',
  },
  sparkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E10600',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: 'rgba(225,6,0,0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  sparkButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFDF9',
    marginLeft: 12,
  },
  profileOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  progressBars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,253,249,0.3)',
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: '#FFFDF9',
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFDF9',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,253,249,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
