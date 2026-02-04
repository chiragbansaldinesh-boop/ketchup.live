export type QuestionLevel = 'sweet' | 'mild' | 'spicy' | 'hot_sauce';

export type ConversationTone = 'tangy' | 'zesty' | 'sweet' | 'hot' | 'smoky';

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
  preferredTone: 'sweet',
  autoSuggest: true,
  suggestionCount: 3,
};
