import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { X, Sparkles } from 'lucide-react-native';
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

interface ProfileStoryViewerProps {
  person: Person;
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

export default function ProfileStoryViewer({
  person,
  visible,
  onClose,
  slideAnim,
}: ProfileStoryViewerProps) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  
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
          onClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleNextFrame = () => {
    const totalFrames = person.photos.length + person.prompts.length + 1;
    if (currentFrameIndex < totalFrames - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1);
    }
  };

  const handleSendSpark = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  const renderCurrentFrame = () => {
    const totalFrames = person.photos.length + person.prompts.length + 1;

    if (currentFrameIndex < person.photos.length) {
      // Photo frames
      return (
        <Image
          source={{ uri: person.photos[currentFrameIndex] }}
          style={styles.framePhoto}
          resizeMode="cover"
        />
      );
    } else if (currentFrameIndex < person.photos.length + person.prompts.length) {
      // Prompt frames
      const promptIndex = currentFrameIndex - person.photos.length;
      const prompt = person.prompts[promptIndex];
      return (
        <View style={styles.promptFrame}>
          <Text style={styles.promptQuestion}>{prompt.question}</Text>
          <Text style={styles.promptAnswer}>{prompt.answer}</Text>
        </View>
      );
    } else {
      // Final frame - interests and spark button
      return (
        <View style={styles.finalFrame}>
          <View style={styles.interestsDisplay}>
            {person.interests.map((interest, index) => (
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
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />
        <TouchableOpacity 
          style={styles.content} 
          onPress={handleNextFrame} 
          activeOpacity={0.9}
        >
          {renderCurrentFrame()}
          
          <View style={styles.overlay}>
            <View style={styles.progressBars}>
              {Array.from({ 
                length: person.photos.length + person.prompts.length + 1 
              }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressBar,
                    index <= currentFrameIndex && styles.progressBarActive,
                  ]}
                />
              ))}
            </View>
            
            <View style={styles.header}>
              <Text style={styles.personName}>
                {person.name}, {person.age}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#FFFDF9" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 100,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,253,249,0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  framePhoto: {
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
  overlay: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personName: {
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