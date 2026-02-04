import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Sparkles, Heart, MessageCircle, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { calculateCompatibility } from '@/services/aiConversationService';

interface AICompatibilityCardProps {
  userInterests: string[];
  matchInterests: string[];
  matchName: string;
}

export default function AICompatibilityCard({
  userInterests,
  matchInterests,
  matchName,
}: AICompatibilityCardProps) {
  const compatibility = useMemo(() => {
    return calculateCompatibility(userInterests, matchInterests);
  }, [userInterests, matchInterests]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success.main;
    if (score >= 60) return colors.accent.gold;
    if (score >= 40) return colors.primary.main;
    return colors.text.tertiary;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Great Potential';
    if (score >= 40) return 'Good Connection';
    return 'Worth Exploring';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.main + '15', colors.accent.gold + '10']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.header}>
        <View style={styles.aiIconContainer}>
          <Sparkles size={16} color={colors.text.inverse} />
        </View>
        <Text style={styles.headerTitle}>AI Compatibility</Text>
      </View>

      <View style={styles.scoreSection}>
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreNumber, { color: getScoreColor(compatibility.score) }]}>
            {compatibility.score}
          </Text>
          <Text style={styles.scorePercent}>%</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreLabel}>{getScoreLabel(compatibility.score)}</Text>
          <Text style={styles.scoreSubtitle}>with {matchName}</Text>
        </View>
      </View>

      {compatibility.sharedInterests.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={14} color={colors.primary.main} />
            <Text style={styles.sectionTitle}>Shared Interests</Text>
          </View>
          <View style={styles.tagsContainer}>
            {compatibility.sharedInterests.slice(0, 4).map((interest, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MessageCircle size={14} color={colors.accent.mint} />
          <Text style={styles.sectionTitle}>Conversation Starters</Text>
        </View>
        <View style={styles.startersContainer}>
          {compatibility.conversationStarters.map((starter, index) => (
            <View key={index} style={styles.starterItem}>
              <Star size={12} color={colors.accent.gold} fill={colors.accent.gold} />
              <Text style={styles.starterText}>{starter}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.strengthsSection}>
        {compatibility.strengths.slice(0, 2).map((strength, index) => (
          <View key={index} style={styles.strengthBadge}>
            <Text style={styles.strengthText}>{strength}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.primary,
    overflow: 'hidden',
    ...shadows.md,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  aiIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.captionMedium,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '700',
  },
  scorePercent: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreLabel: {
    ...typography.bodySemibold,
    color: colors.text.primary,
  },
  scoreSubtitle: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.small,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.primary.main + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  tagText: {
    ...typography.small,
    color: colors.primary.main,
    fontWeight: '500',
  },
  startersContainer: {
    gap: spacing.xs,
  },
  starterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  starterText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
  },
  strengthsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  strengthBadge: {
    backgroundColor: colors.accent.mint + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  strengthText: {
    ...typography.small,
    color: colors.accent.mint,
    fontWeight: '500',
  },
});
