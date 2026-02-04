import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, MapPin, Users, Search } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

type EmptyStateType = 'likes' | 'matches' | 'chat' | 'venues' | 'discover' | 'search';

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const emptyStateConfig = {
  likes: {
    icon: Heart,
    title: 'No likes yet',
    subtitle: 'Keep exploring and connecting with people nearby. Your first like could be just around the corner!',
    iconColor: colors.primary.light,
  },
  matches: {
    icon: Users,
    title: 'No matches yet',
    subtitle: 'When you and someone else like each other, you\'ll see them here.',
    iconColor: colors.accent.rose,
  },
  chat: {
    icon: MessageCircle,
    title: 'No conversations',
    subtitle: 'When you match with someone, you can start chatting here.',
    iconColor: colors.accent.mint,
  },
  venues: {
    icon: MapPin,
    title: 'No venues nearby',
    subtitle: 'Looks like there aren\'t any popular spots in your area right now. Check back later!',
    iconColor: colors.primary.main,
  },
  discover: {
    icon: Search,
    title: 'No one nearby',
    subtitle: 'Try expanding your distance preferences or check back later when more people are around.',
    iconColor: colors.accent.gold,
  },
  search: {
    icon: Search,
    title: 'No results found',
    subtitle: 'Try adjusting your search or filters to find what you\'re looking for.',
    iconColor: colors.text.tertiary,
  },
};

export default function EmptyState({
  type,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon size={48} color={config.iconColor} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{title || config.title}</Text>
      <Text style={styles.subtitle}>{subtitle || config.subtitle}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.huge,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionButton: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.full,
  },
  actionButtonText: {
    ...typography.bodySemibold,
    color: colors.text.inverse,
  },
});
