import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { BadgeCheck, Crown, Zap, Clock } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

type BadgeVariant = 'verified' | 'premium' | 'active' | 'new' | 'hot' | 'distance';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const badgeConfig = {
  verified: {
    icon: BadgeCheck,
    backgroundColor: colors.accent.mint,
    textColor: colors.text.inverse,
    label: 'Verified',
  },
  premium: {
    icon: Crown,
    backgroundColor: colors.accent.gold,
    textColor: colors.text.primary,
    label: 'Premium',
  },
  active: {
    icon: Zap,
    backgroundColor: colors.success.main,
    textColor: colors.text.inverse,
    label: 'Active Now',
  },
  new: {
    icon: null,
    backgroundColor: colors.primary.main,
    textColor: colors.text.inverse,
    label: 'New',
  },
  hot: {
    icon: Zap,
    backgroundColor: colors.primary.main,
    textColor: colors.text.inverse,
    label: 'Hot',
  },
  distance: {
    icon: null,
    backgroundColor: colors.background.tertiary,
    textColor: colors.text.secondary,
    label: '',
  },
};

export default function Badge({ variant, label, size = 'md', style }: BadgeProps) {
  const config = badgeConfig[variant];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.backgroundColor },
        isSmall && styles.containerSmall,
        style,
      ]}
    >
      {Icon && (
        <Icon
          size={isSmall ? 10 : 12}
          color={config.textColor}
          fill={variant === 'verified' || variant === 'premium' ? config.textColor : undefined}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: config.textColor },
          isSmall && styles.labelSmall,
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
}

export function OnlineIndicator({ size = 12 }: { size?: number }) {
  return (
    <View style={[styles.onlineIndicator, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.onlineInner, { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }]} />
    </View>
  );
}

export function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <View style={styles.notificationBadge}>
      <Text style={styles.notificationText}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  containerSmall: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
  },
  label: {
    ...typography.smallMedium,
  },
  labelSmall: {
    fontSize: 10,
  },
  onlineIndicator: {
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  onlineInner: {
    backgroundColor: colors.success.main,
  },
  notificationBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  notificationText: {
    ...typography.small,
    fontWeight: '700',
    color: colors.text.inverse,
    fontSize: 10,
  },
});
