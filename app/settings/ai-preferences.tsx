import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, MessageCircle, Brain, Zap, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { ConversationTone, DEFAULT_AI_PREFERENCES } from '@/types/ai';
import { getQuestionLevelInfo, QUESTION_LEVELS } from '@/services/aiConversationService';

const TONE_OPTIONS: { value: ConversationTone; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'genuine', label: 'Genuine', description: 'Authentic and sincere responses', icon: <Heart size={20} color={colors.primary.main} /> },
  { value: 'playful', label: 'Playful', description: 'Fun and lighthearted suggestions', icon: <Zap size={20} color={colors.accent.gold} /> },
  { value: 'witty', label: 'Witty', description: 'Clever and sharp conversation', icon: <Brain size={20} color={colors.accent.mint} /> },
  { value: 'flirty', label: 'Flirty', description: 'Charming and romantic tone', icon: <Heart size={20} color={colors.accent.rose} /> },
  { value: 'thoughtful', label: 'Thoughtful', description: 'Deep and meaningful exchanges', icon: <MessageCircle size={20} color={colors.secondary.main} /> },
];

export default function AIPreferencesScreen() {
  const [preferences, setPreferences] = useState(DEFAULT_AI_PREFERENCES);
  const [showCompatibility, setShowCompatibility] = useState(true);

  const handleToneSelect = (tone: ConversationTone) => {
    setPreferences(prev => ({ ...prev, preferredTone: tone }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Preferences</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Sparkles size={32} color={colors.text.inverse} />
          </View>
          <Text style={styles.heroTitle}>Your AI Assistant</Text>
          <Text style={styles.heroSubtitle}>
            Customize how AI helps you with conversations and finding matches
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Features</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto-suggest messages</Text>
              <Text style={styles.settingDescription}>
                Get AI suggestions while chatting
              </Text>
            </View>
            <Switch
              value={preferences.autoSuggest}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, autoSuggest: value }))}
              trackColor={{ false: colors.background.tertiary, true: colors.primary.light }}
              thumbColor={preferences.autoSuggest ? colors.primary.main : colors.text.tertiary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Show compatibility</Text>
              <Text style={styles.settingDescription}>
                Display AI compatibility scores on profiles
              </Text>
            </View>
            <Switch
              value={showCompatibility}
              onValueChange={setShowCompatibility}
              trackColor={{ false: colors.background.tertiary, true: colors.primary.light }}
              thumbColor={showCompatibility ? colors.primary.main : colors.text.tertiary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conversation Tone</Text>
          <Text style={styles.sectionSubtitle}>
            Choose your preferred style for AI suggestions
          </Text>

          {TONE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.toneOption,
                preferences.preferredTone === option.value && styles.toneOptionActive,
              ]}
              onPress={() => handleToneSelect(option.value)}
            >
              <View style={styles.toneIcon}>{option.icon}</View>
              <View style={styles.toneInfo}>
                <Text style={[
                  styles.toneLabel,
                  preferences.preferredTone === option.value && styles.toneLabelActive,
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.toneDescription}>{option.description}</Text>
              </View>
              <View style={[
                styles.radioOuter,
                preferences.preferredTone === option.value && styles.radioOuterActive,
              ]}>
                {preferences.preferredTone === option.value && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Question Levels</Text>
          <Text style={styles.sectionSubtitle}>
            AI automatically progresses through these levels as your conversation deepens
          </Text>

          {QUESTION_LEVELS.map((level, index) => {
            const info = getQuestionLevelInfo(level);
            return (
              <View key={level} style={styles.levelItem}>
                <View style={styles.levelNumber}>
                  <Text style={styles.levelNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.levelInfo}>
                  <View style={styles.levelHeader}>
                    <Text style={styles.levelEmoji}>{info.emoji}</Text>
                    <Text style={styles.levelTitle}>{info.title}</Text>
                  </View>
                  <Text style={styles.levelDescription}>{info.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.infoCard}>
          <Sparkles size={20} color={colors.primary.main} />
          <Text style={styles.infoText}>
            Your AI assistant learns from your preferences to provide better suggestions over time.
          </Text>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.huge,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  heroTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
  settingLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  settingDescription: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  toneOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.sm,
  },
  toneOptionActive: {
    backgroundColor: colors.primary.main + '15',
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  toneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  toneInfo: {
    flex: 1,
  },
  toneLabel: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  toneLabelActive: {
    color: colors.primary.main,
  },
  toneDescription: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: colors.primary.main,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.main,
  },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  levelNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  levelNumberText: {
    ...typography.smallMedium,
    color: colors.text.inverse,
  },
  levelInfo: {
    flex: 1,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  levelEmoji: {
    fontSize: 16,
  },
  levelTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  levelDescription: {
    ...typography.caption,
    color: colors.text.tertiary,
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.secondary.light,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
});
