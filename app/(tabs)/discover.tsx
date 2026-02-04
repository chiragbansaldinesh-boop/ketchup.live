import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, X, Star, MapPin, BadgeCheck, Filter, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import ActionButtons from '@/components/ui/ActionButtons';
import EmptyState from '@/components/ui/EmptyState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2;

interface ProfilePrompt {
  question: string;
  answer: string;
}

interface Profile {
  id: string;
  name: string;
  age: number;
  photos: string[];
  distance: string;
  bio?: string;
  occupation?: string;
  isVerified: boolean;
  prompts: ProfilePrompt[];
}

const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 26,
    photos: [
      'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    distance: '2 miles',
    bio: 'Adventure seeker, coffee enthusiast, and amateur photographer. Looking for someone to explore the city with.',
    occupation: 'Product Designer',
    isVerified: true,
    prompts: [
      { question: 'My simple pleasures', answer: 'Sunday morning coffee, vinyl records, and long walks with no destination in mind.' },
      { question: 'A life goal of mine', answer: 'To visit every national park in the country and document each one through photography.' },
    ],
  },
  {
    id: '2',
    name: 'Emma',
    age: 24,
    photos: [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    distance: '4 miles',
    occupation: 'Marketing Manager',
    isVerified: true,
    prompts: [
      { question: 'The way to win me over is', answer: 'Good conversation over good food. Bonus points if you can make me laugh.' },
      { question: 'I geek out on', answer: 'True crime podcasts, cooking shows, and planning elaborate dinner parties.' },
    ],
  },
  {
    id: '3',
    name: 'Jessica',
    age: 28,
    photos: [
      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    distance: '1 mile',
    bio: 'Yoga instructor by day, book lover by night. Looking for genuine connections.',
    occupation: 'Yoga Instructor',
    isVerified: false,
    prompts: [
      { question: 'Dating me is like', answer: 'Getting a new best friend who also happens to be great at giving massages.' },
    ],
  },
];

export default function DiscoverScreen() {
  const [profiles] = useState<Profile[]>(MOCK_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const currentProfile = profiles[currentIndex];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleNextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentPhotoIndex(0);
      setLikedItems(new Set());
    }
  };

  const handleLike = () => {
    handleNextProfile();
  };

  const handlePass = () => {
    handleNextProfile();
  };

  const handleSuperLike = () => {
    handleNextProfile();
  };

  const handleLikeItem = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleNextPhoto = () => {
    if (currentProfile && currentPhotoIndex < currentProfile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (!currentProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={22} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <EmptyState
          type="discover"
          actionLabel="Adjust Filters"
          onAction={() => {}}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={22} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
          />
        }
      >
        <View style={styles.photoSection}>
          <Image
            source={{ uri: currentProfile.photos[currentPhotoIndex] }}
            style={styles.photo}
          />

          <View style={styles.photoNavigation}>
            {currentProfile.photos.length > 1 && (
              <>
                <TouchableOpacity
                  style={[styles.navButton, styles.navButtonLeft]}
                  onPress={handlePrevPhoto}
                  disabled={currentPhotoIndex === 0}
                >
                  {currentPhotoIndex > 0 && (
                    <ChevronLeft size={28} color={colors.text.inverse} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navButton, styles.navButtonRight]}
                  onPress={handleNextPhoto}
                  disabled={currentPhotoIndex === currentProfile.photos.length - 1}
                >
                  {currentPhotoIndex < currentProfile.photos.length - 1 && (
                    <ChevronRight size={28} color={colors.text.inverse} />
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.photoDots}>
            {currentProfile.photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentPhotoIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          />

          <View style={styles.photoInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{currentProfile.name}, {currentProfile.age}</Text>
              {currentProfile.isVerified && (
                <BadgeCheck size={22} color={colors.accent.mint} fill={colors.accent.mint} />
              )}
            </View>
            {currentProfile.occupation && (
              <Text style={styles.occupation}>{currentProfile.occupation}</Text>
            )}
            <View style={styles.distanceRow}>
              <MapPin size={14} color={colors.text.inverse} />
              <Text style={styles.distance}>{currentProfile.distance} away</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.photoLikeButton,
              likedItems.has(`photo-${currentPhotoIndex}`) && styles.photoLikeButtonActive,
            ]}
            onPress={() => handleLikeItem(`photo-${currentPhotoIndex}`)}
          >
            <Heart
              size={20}
              color={likedItems.has(`photo-${currentPhotoIndex}`) ? colors.text.inverse : colors.primary.main}
              fill={likedItems.has(`photo-${currentPhotoIndex}`) ? colors.primary.main : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        {currentProfile.bio && (
          <View style={styles.bioSection}>
            <Text style={styles.bioText}>{currentProfile.bio}</Text>
          </View>
        )}

        {currentProfile.prompts.map((prompt, index) => (
          <View key={index} style={styles.promptCard}>
            <Text style={styles.promptQuestion}>{prompt.question}</Text>
            <Text style={styles.promptAnswer}>{prompt.answer}</Text>
            <TouchableOpacity
              style={[
                styles.promptLikeButton,
                likedItems.has(`prompt-${index}`) && styles.promptLikeButtonActive,
              ]}
              onPress={() => handleLikeItem(`prompt-${index}`)}
            >
              <Heart
                size={18}
                color={likedItems.has(`prompt-${index}`) ? colors.text.inverse : colors.primary.main}
                fill={likedItems.has(`prompt-${index}`) ? colors.primary.main : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        ))}

        {currentProfile.photos.length > 1 && currentProfile.photos.slice(1).map((photo, index) => (
          <View key={`additional-photo-${index}`} style={styles.additionalPhotoContainer}>
            <Image source={{ uri: photo }} style={styles.additionalPhoto} />
            <TouchableOpacity
              style={[
                styles.additionalPhotoLike,
                likedItems.has(`additional-photo-${index}`) && styles.additionalPhotoLikeActive,
              ]}
              onPress={() => handleLikeItem(`additional-photo-${index}`)}
            >
              <Heart
                size={18}
                color={likedItems.has(`additional-photo-${index}`) ? colors.text.inverse : colors.primary.main}
                fill={likedItems.has(`additional-photo-${index}`) ? colors.primary.main : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <ActionButtons
        onPass={handlePass}
        onLike={handleLike}
        onSuperLike={handleSuperLike}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  photoSection: {
    width: CARD_WIDTH,
    height: SCREEN_WIDTH * 1.2,
    alignSelf: 'center',
    marginTop: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.background.tertiary,
    ...shadows.lg,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoNavigation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    width: '35%',
    height: '100%',
    justifyContent: 'center',
  },
  navButtonLeft: {
    alignItems: 'flex-start',
    paddingLeft: spacing.md,
  },
  navButtonRight: {
    alignItems: 'flex-end',
    paddingRight: spacing.md,
  },
  photoDots: {
    position: 'absolute',
    top: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: colors.text.inverse,
    width: 24,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  photoInfo: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.xl,
    right: 60,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.h2,
    color: colors.text.inverse,
  },
  occupation: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  distance: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  photoLikeButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  photoLikeButtonActive: {
    backgroundColor: colors.primary.main,
  },
  bioSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  bioText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 24,
  },
  promptCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.secondary.light,
    borderRadius: borderRadius.lg,
    position: 'relative',
  },
  promptQuestion: {
    ...typography.captionMedium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptAnswer: {
    ...typography.h4,
    color: colors.text.primary,
    paddingRight: spacing.xxxl,
    lineHeight: 28,
  },
  promptLikeButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  promptLikeButtonActive: {
    backgroundColor: colors.primary.main,
  },
  additionalPhotoContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.md,
  },
  additionalPhoto: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  additionalPhotoLike: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  additionalPhotoLikeActive: {
    backgroundColor: colors.primary.main,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
