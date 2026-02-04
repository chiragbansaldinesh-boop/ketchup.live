export type QuestionLevel = 'icebreaker' | 'casual' | 'deeper' | 'serious';

export type ConversationTone = 'playful' | 'witty' | 'genuine' | 'flirty' | 'thoughtful';

export interface AISuggestion {
  id: string;
  text: string;
  level: QuestionLevel;
  tone: ConversationTone;
  category: string;
}

export interface AIConversationContext {
  matchName: string;
  matchInterests?: string[];
  matchBio?: string;
  conversationHistory: string[];
  userPreferences: AIUserPreferences;
}

export interface AIUserPreferences {
  preferredTone: ConversationTone;
  autoSuggest: boolean;
  suggestionCount: number;
}

export interface AICompatibilityInsight {
  score: number;
  strengths: string[];
  conversationStarters: string[];
  sharedInterests: string[];
}

export interface AIResponse {
  suggestions: AISuggestion[];
  context?: string;
}

export const DEFAULT_AI_PREFERENCES: AIUserPreferences = {
  preferredTone: 'genuine',
  autoSuggest: true,
  suggestionCount: 3,
};
