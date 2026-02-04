import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Heart, MapPin, Camera, CreditCard as Edit3, LogOut, Trophy, Crown, ChevronRight, BadgeCheck, Plus, Briefcase, GraduationCap, Ruler } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabaseAuthService } from '@/services/supabaseAuthService';
import { supabaseDatabaseService } from '@/services/supabaseDatabaseService';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';

export default function Profile() {
  const [isOnline, setIsOnline] = useState(true);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = await supabaseAuthService.getCurrentUser();
              if (user) {
                await supabaseDatabaseService.updateUserOnlineStatus(user.id, false);
              }
            } catch (error) {
              console.error('Error during logout:', error);
            }
            router.replace('/auth/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const userProfile = {
    name: "Alex",
    age: 28,
    bio: "Coffee enthusiast, dog lover, and weekend adventurer. Always up for trying new places!",
    occupation: "Product Designer",
    education: "Stanford University",
    height: "5'10\"",
    interests: ["Coffee", "Travel", "Photography", "Dogs", "Music", "Hiking"],
    photos: [
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600",
      null,
      null,
      null,
    ],
    prompts: [
      { question: "My simple pleasures", answer: "Sunday brunch with friends" },
      { question: "I geek out on", answer: "Photography and vintage cameras" },
    ],
    currentVenue: "Brew & Beans Cafe",
    totalMatches: 47,
    venuesVisited: 23,
    isVerified: true,
  };

  const profileCompletion = 75;

  const stats = [
    { label: "Matches", value: userProfile.totalMatches, icon: Heart },
    { label: "Venues", value: userProfile.venuesVisited, icon: MapPin },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Settings size={22} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <Text style={styles.completionTitle}>Profile Completion</Text>
            <Text style={styles.completionPercent}>{profileCompletion}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={colors.gradients.primary as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${profileCompletion}%` }]}
            />
          </View>
          <Text style={styles.completionHint}>Add more photos to increase visibility</Text>
        </View>

        <View style={styles.mainProfileSection}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: userProfile.photos[0] || '' }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editPhotoButton}>
              <Camera size={16} color={colors.text.inverse} />
            </TouchableOpacity>
            {userProfile.isVerified && (
              <View style={styles.verifiedBadge}>
                <BadgeCheck size={20} color={colors.accent.mint} fill={colors.accent.mint} />
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{userProfile.name}, {userProfile.age}</Text>
              <TouchableOpacity style={styles.editButton}>
                <Edit3 size={18} color={colors.primary.main} />
              </TouchableOpacity>
            </View>

            <View style={styles.detailsRow}>
              {userProfile.occupation && (
                <View style={styles.detailItem}>
                  <Briefcase size={14} color={colors.text.tertiary} />
                  <Text style={styles.detailText}>{userProfile.occupation}</Text>
                </View>
              )}
              {userProfile.education && (
                <View style={styles.detailItem}>
                  <GraduationCap size={14} color={colors.text.tertiary} />
                  <Text style={styles.detailText}>{userProfile.education}</Text>
                </View>
              )}
              {userProfile.height && (
                <View style={styles.detailItem}>
                  <Ruler size={14} color={colors.text.tertiary} />
                  <Text style={styles.detailText}>{userProfile.height}</Text>
                </View>
              )}
            </View>

            <View style={styles.statusRow}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success.main : colors.text.tertiary }]} />
                <Text style={styles.statusText}>
                  {isOnline ? 'Visible to others' : 'Hidden'}
                </Text>
              </View>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: colors.border.medium, true: colors.primary.light }}
                thumbColor={colors.background.primary}
              />
            </View>

            {isOnline && userProfile.currentVenue && (
              <View style={styles.currentVenue}>
                <MapPin size={14} color={colors.primary.main} />
                <Text style={styles.venueText}>At {userProfile.currentVenue}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <stat.icon size={22} color={colors.primary.main} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <Text style={styles.sectionSubtitle}>{userProfile.photos.filter(p => p).length}/6</Text>
          </View>
          <View style={styles.photoGrid}>
            {userProfile.photos.map((photo, index) => (
              <TouchableOpacity key={index} style={styles.photoSlot}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.gridPhoto} />
                ) : (
                  <View style={styles.emptyPhotoSlot}>
                    <Plus size={24} color={colors.text.tertiary} />
                  </View>
                )}
                {index === 0 && photo && (
                  <View style={styles.mainPhotoBadge}>
                    <Text style={styles.mainPhotoText}>Main</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Prompts</Text>
            <TouchableOpacity>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          {userProfile.prompts.map((prompt, index) => (
            <View key={index} style={styles.promptCard}>
              <Text style={styles.promptQuestion}>{prompt.question}</Text>
              <Text style={styles.promptAnswer}>{prompt.answer}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addPromptButton}>
            <Plus size={18} color={colors.primary.main} />
            <Text style={styles.addPromptText}>Add a prompt</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <TouchableOpacity>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.interestsContainer}>
            {userProfile.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/rewards')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: colors.warning.light }]}>
              <Trophy size={20} color={colors.warning.dark} />
            </View>
            <Text style={styles.menuText}>Rewards & Points</Text>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/settings/subscription')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: colors.secondary.light }]}>
              <Crown size={20} color={colors.primary.main} />
            </View>
            <Text style={styles.menuText}>Premium Subscription</Text>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/settings')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: colors.background.tertiary }]}>
              <Settings size={20} color={colors.text.secondary} />
            </View>
            <Text style={styles.menuText}>Settings & Privacy</Text>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: colors.secondary.light }]}>
              <LogOut size={20} color={colors.error.main} />
            </View>
            <Text style={[styles.menuText, { color: colors.error.main }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  completionTitle: {
    ...typography.bodySemibold,
    color: colors.text.primary,
  },
  completionPercent: {
    ...typography.bodySemibold,
    color: colors.primary.main,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  completionHint: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  mainProfileSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background.tertiary,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: colors.primary.main,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 2,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.h2,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  editButton: {
    padding: spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  statusText: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
  },
  currentVenue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  venueText: {
    ...typography.captionMedium,
    color: colors.primary.main,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  statValue: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  editLink: {
    ...typography.captionMedium,
    color: colors.primary.main,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoSlot: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  gridPhoto: {
    width: '100%',
    height: '100%',
  },
  emptyPhotoSlot: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
  },
  mainPhotoBadge: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    backgroundColor: colors.text.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  mainPhotoText: {
    ...typography.small,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  promptCard: {
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  promptQuestion: {
    ...typography.captionMedium,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  promptAnswer: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  addPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.secondary.light,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  addPromptText: {
    ...typography.bodyMedium,
    color: colors.primary.main,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestTag: {
    backgroundColor: colors.secondary.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  interestText: {
    ...typography.captionMedium,
    color: colors.primary.main,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    flex: 1,
  },
  logoutItem: {
    backgroundColor: colors.background.primary,
  },
  bottomPadding: {
    height: spacing.huge,
  },
});
