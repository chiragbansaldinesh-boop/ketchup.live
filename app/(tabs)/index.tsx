import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Crown, Lock, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, spacing, borderRadius, typography, shadows, gradients } from '@/constants/theme';
import EmptyState from '@/components/ui/EmptyState';
import { OnlineIndicator } from '@/components/ui/Badge';

interface Like {
  id: string;
  name: string;
  age: number;
  photo: string;
  venue?: string;
  timestamp: string;
  isNew?: boolean;
  isOnline?: boolean;
}

interface Match {
  id: string;
  name: string;
  photo: string;
  isOnline?: boolean;
  lastMessage?: string;
  venue?: string;
}

const mockLikes: Like[] = [
  {
    id: '1',
    name: 'Olivia',
    age: 25,
    photo: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400',
    venue: 'Blue Bottle Coffee',
    timestamp: '2 hours ago',
    isNew: true,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Sophia',
    age: 27,
    photo: 'https://images.pexels.com/photos/1758845/pexels-photo-1758845.jpeg?auto=compress&cs=tinysrgb&w=400',
    venue: 'The Rusty Anchor',
    timestamp: '5 hours ago',
    isNew: true,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Isabella',
    age: 24,
    photo: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=400',
    timestamp: 'Yesterday',
    isNew: false,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Mia',
    age: 26,
    photo: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=400',
    venue: 'Central Park Cafe',
    timestamp: '2 days ago',
    isNew: false,
    isOnline: false,
  },
];

const mockMatches: Match[] = [
  {
    id: '1',
    name: 'Emma',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: true,
    lastMessage: 'Hey! Nice to match with you',
    venue: 'Blue Bottle Coffee',
  },
  {
    id: '2',
    name: 'Sophie',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: false,
    venue: 'Sunset Bistro',
  },
  {
    id: '3',
    name: 'Alex',
    photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: true,
  },
];

export default function LikesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [isPremium] = useState(false);

  const newLikesCount = mockLikes.filter(l => l.isNew).length;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Likes</Text>
        {newLikesCount > 0 && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>{newLikesCount} new</Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {mockMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New Matches</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.matchesRow}
            >
              {mockMatches.map((match) => (
                <TouchableOpacity
                  key={match.id}
                  style={styles.matchCard}
                  onPress={() => router.push('/(tabs)/chat')}
                >
                  <View style={styles.matchImageContainer}>
                    <Image source={{ uri: match.photo }} style={styles.matchImage} />
                    {match.isOnline && (
                      <View style={styles.matchOnlineIndicator}>
                        <OnlineIndicator size={12} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.matchName} numberOfLines={1}>{match.name}</Text>
                  {match.venue && (
                    <View style={styles.matchVenueRow}>
                      <MapPin size={10} color={colors.text.tertiary} />
                      <Text style={styles.matchVenue} numberOfLines={1}>{match.venue}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>People who like you</Text>
            {!isPremium && (
              <TouchableOpacity
                style={styles.unlockButton}
                onPress={() => router.push('/settings/subscription')}
              >
                <Crown size={14} color={colors.accent.gold} />
                <Text style={styles.unlockText}>See all</Text>
              </TouchableOpacity>
            )}
          </View>

          {mockLikes.length === 0 ? (
            <EmptyState type="likes" />
          ) : (
            <View style={styles.likesGrid}>
              {mockLikes.map((like, index) => (
                <TouchableOpacity
                  key={like.id}
                  style={styles.likeCard}
                  activeOpacity={isPremium ? 0.7 : 1}
                >
                  <Image source={{ uri: like.photo }} style={styles.likeImage} />

                  {!isPremium && index > 0 && (
                    <BlurView intensity={30} style={styles.blurOverlay}>
                      <View style={styles.lockContainer}>
                        <Lock size={20} color={colors.text.inverse} />
                      </View>
                    </BlurView>
                  )}

                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.likeGradient}
                  />

                  <View style={styles.likeInfo}>
                    <View style={styles.likeNameRow}>
                      <Text style={styles.likeName}>{like.name}, {like.age}</Text>
                      {like.isOnline && (
                        <View style={styles.likeOnlineIndicator}>
                          <OnlineIndicator size={10} />
                        </View>
                      )}
                    </View>
                    {like.venue && (
                      <View style={styles.likeVenueRow}>
                        <MapPin size={12} color={colors.text.inverse} />
                        <Text style={styles.likeVenue}>{like.venue}</Text>
                      </View>
                    )}
                    <Text style={styles.likeTime}>{like.timestamp}</Text>
                  </View>

                  {like.isNew && (
                    <View style={styles.newIndicator}>
                      <Heart size={14} color={colors.text.inverse} fill={colors.text.inverse} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {!isPremium && mockLikes.length > 0 && (
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => router.push('/settings/subscription')}
          >
            <LinearGradient
              colors={gradients.primary as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumGradient}
            >
              <Crown size={24} color={colors.text.inverse} />
              <View style={styles.premiumTextContainer}>
                <Text style={styles.premiumTitle}>See who likes you</Text>
                <Text style={styles.premiumSubtitle}>Upgrade to Premium to see all your admirers</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  newBadge: {
    marginLeft: spacing.md,
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  newBadgeText: {
    ...typography.smallMedium,
    color: colors.text.inverse,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  section: {
    paddingTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.warning.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  unlockText: {
    ...typography.captionMedium,
    color: colors.warning.dark,
  },
  matchesRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  matchCard: {
    alignItems: 'center',
    width: 80,
  },
  matchImageContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  matchImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  matchOnlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  matchName: {
    ...typography.captionMedium,
    color: colors.text.primary,
    textAlign: 'center',
  },
  matchVenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  matchVenue: {
    ...typography.small,
    color: colors.text.tertiary,
    maxWidth: 60,
  },
  likesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  likeCard: {
    width: '47%',
    aspectRatio: 0.75,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.md,
  },
  likeImage: {
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  likeInfo: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
  likeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  likeName: {
    ...typography.bodySemibold,
    color: colors.text.inverse,
  },
  likeOnlineIndicator: {
    marginLeft: spacing.xs,
  },
  likeVenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  likeVenue: {
    ...typography.small,
    color: 'rgba(255,255,255,0.8)',
  },
  likeTime: {
    ...typography.small,
    color: 'rgba(255,255,255,0.6)',
    marginTop: spacing.xs,
  },
  newIndicator: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    ...typography.bodySemibold,
    color: colors.text.inverse,
  },
  premiumSubtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  bottomPadding: {
    height: spacing.huge,
  },
});
