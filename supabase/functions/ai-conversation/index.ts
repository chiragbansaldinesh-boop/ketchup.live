import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type QuestionLevel = 'icebreaker' | 'casual' | 'deeper' | 'serious';
type ConversationTone = 'playful' | 'witty' | 'genuine' | 'flirty' | 'thoughtful';

interface AISuggestion {
  id: string;
  text: string;
  level: QuestionLevel;
  tone: ConversationTone;
  category: string;
}

interface RequestBody {
  action: 'get_suggestions' | 'generate_response' | 'get_compatibility';
  messageCount?: number;
  tone?: ConversationTone;
  matchInterests?: string[];
  userInterests?: string[];
  lastMessage?: string;
  count?: number;
}

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

function getLevelFromMessageCount(messageCount: number): QuestionLevel {
  if (messageCount < 5) return 'icebreaker';
  if (messageCount < 15) return 'casual';
  if (messageCount < 30) return 'deeper';
  return 'serious';
}

function getRandomSuggestions(level: QuestionLevel, count: number, tone?: ConversationTone): AISuggestion[] {
  let questions = QUESTION_BANK[level];

  if (tone) {
    const toneFiltered = questions.filter(q => q.tone === tone);
    if (toneFiltered.length >= count) {
      questions = toneFiltered;
    }
  }

  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function calculateCompatibility(userInterests: string[], matchInterests: string[]) {
  const sharedInterests = userInterests.filter(i =>
    matchInterests.some(m =>
      m.toLowerCase().includes(i.toLowerCase()) ||
      i.toLowerCase().includes(m.toLowerCase())
    )
  );

  const interestScore = sharedInterests.length > 0
    ? Math.min((sharedInterests.length / Math.max(userInterests.length, matchInterests.length)) * 100, 100)
    : 30;

  const baseScore = 50;
  const score = Math.round((baseScore + interestScore) / 2);

  const strengths: string[] = [];
  if (sharedInterests.length >= 3) strengths.push('Strong shared interests');
  if (sharedInterests.length >= 1) strengths.push('Common ground to build on');
  strengths.push('Potential for meaningful connection');

  const conversationStarters = sharedInterests.length > 0
    ? sharedInterests.slice(0, 2).map(i => `Ask about their interest in ${i}`)
    : ['Start with a fun icebreaker', 'Ask about their day'];

  return { score, strengths, conversationStarters, sharedInterests };
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const body: RequestBody = await req.json();
    const { action, messageCount = 0, tone, matchInterests = [], userInterests = [], count = 3 } = body;

    let responseData;

    switch (action) {
      case 'get_suggestions': {
        const level = getLevelFromMessageCount(messageCount);
        const suggestions = getRandomSuggestions(level, count, tone);
        responseData = { suggestions, level };
        break;
      }
      case 'get_compatibility': {
        responseData = calculateCompatibility(userInterests, matchInterests);
        break;
      }
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
