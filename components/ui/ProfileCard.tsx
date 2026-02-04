import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MapPin, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2;

interface ProfilePrompt {
  question: string;
  answer: string;
}

interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  photos: string[];
  distance?: string;
  bio?: string;
  prompts?: ProfilePrompt[];
  isVerified?: boolean;
  occupation?: string;
  onLike?: () => void;
  onLikePrompt?: (promptIndex: number) => void;
  onLikePhoto?: (photoIndex: number) => void;
}

export default function ProfileCard({
  name,
  age,
  photos,
  distance,
  bio,
  prompts = [],
  isVerified = false,
  occupation,
  onLike,
  onLikePrompt,
  onLikePhoto,
}: ProfileCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleNextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.photoSection}>
        <Image
          source={{ uri: photos[currentPhotoIndex] || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600' }}
          style={styles.photo}
        />

        <View style={styles.photoNavigation}>
          {photos.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeft]}
                onPress={handlePrevPhoto}
                disabled={currentPhotoIndex === 0}
              >
                <ChevronLeft size={24} color={colors.text.inverse} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonRight]}
                onPress={handleNextPhoto}
                disabled={currentPhotoIndex === photos.length - 1}
              >
                <ChevronRight size={24} color={colors.text.inverse} />
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.photoDots}>
          {photos.map((_, index) => (
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
            <Text style={styles.name}>{name}, {age}</Text>
            {isVerified && (
              <BadgeCheck size={22} color={colors.accent.mint} fill={colors.accent.mint} />
            )}
          </View>
          {occupation && (
            <Text style={styles.occupation}>{occupation}</Text>
          )}
          {distance && (
            <View style={styles.distanceRow}>
              <MapPin size={14} color={colors.text.inverse} />
              <Text style={styles.distance}>{distance} away</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.photoLikeButton}
          onPress={() => onLikePhoto?.(currentPhotoIndex)}
        >
          <Heart size={20} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      {bio && (
        <View style={styles.bioSection}>
          <Text style={styles.bioText}>{bio}</Text>
        </View>
      )}

      {prompts.map((prompt, index) => (
        <View key={index} style={styles.promptCard}>
          <Text style={styles.promptQuestion}>{prompt.question}</Text>
          <Text style={styles.promptAnswer}>{prompt.answer}</Text>
          <TouchableOpacity
            style={styles.promptLikeButton}
            onPress={() => onLikePrompt?.(index)}
          >
            <Heart size={18} color={colors.primary.main} />
          </TouchableOpacity>
        </View>
      ))}

      {photos.length > 1 && photos.slice(1).map((photo, index) => (
        <View key={`photo-${index + 1}`} style={styles.additionalPhotoContainer}>
          <Image source={{ uri: photo }} style={styles.additionalPhoto} />
          <TouchableOpacity
            style={styles.additionalPhotoLike}
            onPress={() => onLikePhoto?.(index + 1)}
          >
            <Heart size={18} color={colors.primary.main} />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollContent: {
    paddingBottom: 100,
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
    width: '30%',
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
    width: 20,
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
    right: spacing.xl,
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
  bottomPadding: {
    height: spacing.huge,
  },
});
