import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Sparkles, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import {
  getContextualSuggestions,
  getQuestionLevelInfo,
  QUESTION_LEVELS,
} from '@/services/aiConversationService';
import {
  AISuggestion,
  QuestionLevel,
  DEFAULT_AI_PREFERENCES,
} from '@/types/ai';

interface AIChatAssistantProps {
  matchName: string;
  matchInterests?: string[];
  messageCount: number;
  onSelectSuggestion: (text: string) => void;
}

export default function AIChatAssistant({
  matchName,
  matchInterests = [],
  messageCount,
  onSelectSuggestion,
}: AIChatAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [currentLevel, setCurrentLevel] = useState<QuestionLevel>('icebreaker');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const rotateAnim = useState(new Animated.Value(0))[0];

  const loadSuggestions = () => {
    const context = {
      matchName,
      matchInterests,
      conversationHistory: Array(messageCount).fill(''),
      userPreferences: DEFAULT_AI_PREFERENCES,
    };

    const newSuggestions = getContextualSuggestions(context, 3);
    setSuggestions(newSuggestions);

    if (messageCount < 5) setCurrentLevel('icebreaker');
    else if (messageCount < 15) setCurrentLevel('casual');
    else if (messageCount < 30) setCurrentLevel('deeper');
    else setCurrentLevel('serious');
  };

  useEffect(() => {
    loadSuggestions();
  }, [messageCount, matchName]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
      loadSuggestions();
      setIsRefreshing(false);
    });
  };

  const handleSelectLevel = (level: QuestionLevel) => {
    setCurrentLevel(level);
    const context = {
      matchName,
      matchInterests,
      conversationHistory: Array(
        level === 'icebreaker' ? 0 :
        level === 'casual' ? 10 :
        level === 'deeper' ? 20 : 35
      ).fill(''),
      userPreferences: DEFAULT_AI_PREFERENCES,
    };
    setSuggestions(getContextualSuggestions(context, 3));
  };

  const levelInfo = getQuestionLevelInfo(currentLevel);
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <View style={styles.aiIconContainer}>
            <Sparkles size={16} color={colors.text.inverse} />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <Text style={styles.headerSubtitle}>
              {levelInfo.emoji} {levelInfo.title}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <RefreshCw size={16} color={colors.primary.main} />
            </Animated.View>
          </TouchableOpacity>
          {isExpanded ? (
            <ChevronUp size={20} color={colors.text.tertiary} />
          ) : (
            <ChevronDown size={20} color={colors.text.tertiary} />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.levelSelector}
          >
            {QUESTION_LEVELS.map((level) => {
              const info = getQuestionLevelInfo(level);
              const isActive = level === currentLevel;
              return (
                <TouchableOpacity
                  key={level}
                  style={[styles.levelButton, isActive && styles.levelButtonActive]}
                  onPress={() => handleSelectLevel(level)}
                >
                  <Text style={styles.levelEmoji}>{info.emoji}</Text>
                  <Text style={[styles.levelText, isActive && styles.levelTextActive]}>
                    {info.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.levelDescription}>{levelInfo.description}</Text>

          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                style={styles.suggestionCard}
                onPress={() => onSelectSuggestion(suggestion.text)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionText}>{suggestion.text}</Text>
                <View style={styles.suggestionMeta}>
                  <View style={[styles.toneBadge, getToneBadgeStyle(suggestion.tone)]}>
                    <Text style={styles.toneText}>{suggestion.tone}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function getToneBadgeStyle(tone: string) {
  const toneColors: Record<string, { backgroundColor: string }> = {
    playful: { backgroundColor: colors.accent.gold + '30' },
    witty: { backgroundColor: colors.accent.mint + '30' },
    genuine: { backgroundColor: colors.primary.light + '30' },
    flirty: { backgroundColor: colors.accent.rose + '30' },
    thoughtful: { backgroundColor: colors.secondary.main + '30' },
  };
  return toneColors[tone] || { backgroundColor: colors.background.tertiary };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.captionMedium,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: spacing.md,
  },
  levelSelector: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  levelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    gap: spacing.xs,
  },
  levelButtonActive: {
    backgroundColor: colors.primary.main,
  },
  levelEmoji: {
    fontSize: 14,
  },
  levelText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  levelTextActive: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  levelDescription: {
    ...typography.small,
    color: colors.text.tertiary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  suggestionsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  suggestionCard: {
    backgroundColor: colors.secondary.light,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  suggestionText: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  suggestionMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  toneBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  toneText: {
    ...typography.small,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
});
