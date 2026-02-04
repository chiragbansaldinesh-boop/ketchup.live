import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { X, Heart, Star, RotateCcw } from 'lucide-react-native';
import { colors, spacing, shadows } from '@/constants/theme';

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onUndo?: () => void;
  showUndo?: boolean;
}

export default function ActionButtons({
  onPass,
  onLike,
  onSuperLike,
  onUndo,
  showUndo = false,
}: ActionButtonsProps) {
  const handlePress = (callback: () => void) => {
    callback();
  };

  return (
    <View style={styles.container}>
      {showUndo && onUndo && (
        <TouchableOpacity
          style={[styles.button, styles.undoButton]}
          onPress={() => handlePress(onUndo)}
          activeOpacity={0.8}
        >
          <RotateCcw size={22} color={colors.accent.gold} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.passButton]}
        onPress={() => handlePress(onPass)}
        activeOpacity={0.8}
      >
        <X size={28} color={colors.text.secondary} strokeWidth={3} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.superLikeButton]}
        onPress={() => handlePress(onSuperLike)}
        activeOpacity={0.8}
      >
        <Star size={26} color={colors.accent.gold} fill={colors.accent.gold} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.likeButton]}
        onPress={() => handlePress(onLike)}
        activeOpacity={0.8}
      >
        <Heart size={28} color={colors.primary.main} fill={colors.primary.main} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    ...shadows.md,
  },
  undoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.accent.gold,
  },
  passButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.border.medium,
  },
  superLikeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.accent.gold,
  },
  likeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.primary.light,
  },
});
