import {
  QuestionLevel,
  ConversationTone,
  AISuggestion,
  AIConversationContext,
  AICompatibilityInsight,
} from '@/types/ai';

const QUESTION_BANK: Record<QuestionLevel, AISuggestion[]> = {
  icebreaker: [
    { id: 'ice1', text: "What's the best thing that happened to you today?", level: 'icebreaker', tone: 'genuine', category: 'daily' },
    { id: 'ice2', text: "If you could teleport anywhere right now, where would you go?", level: 'icebreaker', tone: 'playful', category: 'imagination' },
    { id: 'ice3', text: "What's your go-to comfort food after a long day?", level: 'icebreaker', tone: 'genuine', category: 'food' },
    { id: 'ice4', text: "Are you more of a morning person or night owl?", level: 'icebreaker', tone: 'witty', category: 'lifestyle' },
    { id: 'ice5', text: "What song has been stuck in your head lately?", level: 'icebreaker', tone: 'playful', category: 'music' },
    { id: 'ice6', text: "Coffee, tea, or something stronger?", level: 'icebreaker', tone: 'flirty', category: 'preferences' },
    { id: 'ice7', text: "What's the last show you couldn't stop watching?", level: 'icebreaker', tone: 'genuine', category: 'entertainment' },
    { id: 'ice8', text: "If your pet could talk, what would they say about you?", level: 'icebreaker', tone: 'witty', category: 'fun' },
  ],
  casual: [
    { id: 'cas1', text: "What's something you're really looking forward to?", level: 'casual', tone: 'genuine', category: 'future' },
    { id: 'cas2', text: "Tell me about your ideal weekend - lazy or adventure-packed?", level: 'casual', tone: 'thoughtful', category: 'lifestyle' },
    { id: 'cas3', text: "What's a skill you've always wanted to learn?", level: 'casual', tone: 'genuine', category: 'growth' },
    { id: 'cas4', text: "What's the most spontaneous thing you've ever done?", level: 'casual', tone: 'playful', category: 'adventure' },
    { id: 'cas5', text: "If you won the lottery tomorrow, what's the first thing you'd do?", level: 'casual', tone: 'witty', category: 'dreams' },
    { id: 'cas6', text: "What's your hidden talent that would surprise most people?", level: 'casual', tone: 'flirty', category: 'personal' },
    { id: 'cas7', text: "What's the best trip you've ever taken?", level: 'casual', tone: 'genuine', category: 'travel' },
    { id: 'cas8', text: "What do you do to unwind after a stressful day?", level: 'casual', tone: 'thoughtful', category: 'wellness' },
  ],
  deeper: [
    { id: 'deep1', text: "What's something you've changed your mind about recently?", level: 'deeper', tone: 'thoughtful', category: 'growth' },
    { id: 'deep2', text: "What does your ideal relationship look like?", level: 'deeper', tone: 'genuine', category: 'relationships' },
    { id: 'deep3', text: "What's a goal you're actively working towards?", level: 'deeper', tone: 'genuine', category: 'ambition' },
    { id: 'deep4', text: "What's the most valuable lesson life has taught you?", level: 'deeper', tone: 'thoughtful', category: 'wisdom' },
    { id: 'deep5', text: "If you could have dinner with anyone, living or dead, who would it be?", level: 'deeper', tone: 'genuine', category: 'values' },
    { id: 'deep6', text: "What makes you feel most alive?", level: 'deeper', tone: 'genuine', category: 'passion' },
    { id: 'deep7', text: "What's something you're proud of that others might not know about?", level: 'deeper', tone: 'thoughtful', category: 'personal' },
    { id: 'deep8', text: "How do you know when you really trust someone?", level: 'deeper', tone: 'genuine', category: 'trust' },
  ],
  serious: [
    { id: 'ser1', text: "What do you value most in a partner?", level: 'serious', tone: 'genuine', category: 'relationships' },
    { id: 'ser2', text: "Where do you see yourself in five years?", level: 'serious', tone: 'thoughtful', category: 'future' },
    { id: 'ser3', text: "What does commitment mean to you?", level: 'serious', tone: 'genuine', category: 'relationships' },
    { id: 'ser4', text: "How do you handle disagreements in a relationship?", level: 'serious', tone: 'thoughtful', category: 'communication' },
    { id: 'ser5', text: "What's your love language?", level: 'serious', tone: 'genuine', category: 'relationships' },
    { id: 'ser6', text: "What role does family play in your life?", level: 'serious', tone: 'thoughtful', category: 'family' },
    { id: 'ser7', text: "What are your non-negotiables in a relationship?", level: 'serious', tone: 'genuine', category: 'boundaries' },
    { id: 'ser8', text: "How do you balance independence and togetherness?", level: 'serious', tone: 'thoughtful', category: 'balance' },
  ],
};

const RESPONSE_TEMPLATES: Record<ConversationTone, string[]> = {
  playful: [
    "That's amazing! ",
    "Okay, I love that! ",
    "You're full of surprises! ",
    "Ha! That's great ",
  ],
  witty: [
    "Well played! ",
    "I see what you did there ",
    "Touche! ",
    "Clever! ",
  ],
  genuine: [
    "I really appreciate you sharing that ",
    "That's really interesting! ",
    "I love hearing about that ",
    "That says a lot about you ",
  ],
  flirty: [
    "I like the way you think ",
    "You're making this too easy ",
    "Okay, you've got my attention ",
    "Tell me more... ",
  ],
  thoughtful: [
    "That's a really thoughtful perspective ",
    "I've been thinking about that too ",
    "That resonates with me ",
    "What a great way to look at it ",
  ],
};

export function getQuestionsByLevel(level: QuestionLevel): AISuggestion[] {
  return QUESTION_BANK[level];
}

export function getRandomSuggestions(
  level: QuestionLevel,
  count: number = 3,
  excludeIds: string[] = []
): AISuggestion[] {
  const available = QUESTION_BANK[level].filter(q => !excludeIds.includes(q.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getSuggestionsByTone(
  tone: ConversationTone,
  count: number = 3
): AISuggestion[] {
  const allQuestions = Object.values(QUESTION_BANK).flat();
  const filtered = allQuestions.filter(q => q.tone === tone);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getContextualSuggestions(
  context: AIConversationContext,
  count: number = 3
): AISuggestion[] {
  const messageCount = context.conversationHistory.length;

  let level: QuestionLevel;
  if (messageCount < 5) {
    level = 'icebreaker';
  } else if (messageCount < 15) {
    level = 'casual';
  } else if (messageCount < 30) {
    level = 'deeper';
  } else {
    level = 'serious';
  }

  let suggestions = getRandomSuggestions(level, count * 2);

  if (context.matchInterests && context.matchInterests.length > 0) {
    const interestKeywords = context.matchInterests.join(' ').toLowerCase();
    suggestions = suggestions.sort((a, b) => {
      const aRelevance = interestKeywords.includes(a.category) ? 1 : 0;
      const bRelevance = interestKeywords.includes(b.category) ? 1 : 0;
      return bRelevance - aRelevance;
    });
  }

  const preferredTone = context.userPreferences.preferredTone;
  suggestions = suggestions.sort((a, b) => {
    const aMatch = a.tone === preferredTone ? 1 : 0;
    const bMatch = b.tone === preferredTone ? 1 : 0;
    return bMatch - aMatch;
  });

  return suggestions.slice(0, count);
}

export function generateResponseSuggestion(
  lastMessage: string,
  tone: ConversationTone
): string {
  const templates = RESPONSE_TEMPLATES[tone];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  return randomTemplate;
}

export function calculateCompatibility(
  userInterests: string[],
  matchInterests: string[],
  userBio?: string,
  matchBio?: string
): AICompatibilityInsight {
  const sharedInterests = userInterests.filter(i =>
    matchInterests.some(m => m.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(m.toLowerCase()))
  );

  const interestScore = sharedInterests.length > 0
    ? Math.min((sharedInterests.length / Math.max(userInterests.length, matchInterests.length)) * 100, 100)
    : 30;

  const baseScore = 50;
  const score = Math.round((baseScore + interestScore) / 2);

  const strengths: string[] = [];
  if (sharedInterests.length >= 3) {
    strengths.push('Strong shared interests');
  }
  if (sharedInterests.length >= 1) {
    strengths.push('Common ground to build on');
  }
  strengths.push('Potential for meaningful connection');

  const conversationStarters = sharedInterests.length > 0
    ? sharedInterests.slice(0, 2).map(i => `Ask about their interest in ${i}`)
    : ['Start with a fun icebreaker', 'Ask about their day'];

  return {
    score,
    strengths,
    conversationStarters,
    sharedInterests,
  };
}

export function getQuestionLevelInfo(level: QuestionLevel): { title: string; description: string; emoji: string } {
  const info = {
    icebreaker: {
      title: 'Icebreakers',
      description: 'Light, fun questions to get the conversation started',
      emoji: '🧊',
    },
    casual: {
      title: 'Getting to Know You',
      description: 'Casual questions to learn more about each other',
      emoji: '☕',
    },
    deeper: {
      title: 'Going Deeper',
      description: 'More meaningful questions to build connection',
      emoji: '💭',
    },
    serious: {
      title: 'Relationship Ready',
      description: 'Important questions about values and future',
      emoji: '💝',
    },
  };
  return info[level];
}

export const QUESTION_LEVELS: QuestionLevel[] = ['icebreaker', 'casual', 'deeper', 'serious'];
