import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type QuestionLevel = 'sweet' | 'mild' | 'spicy' | 'hot_sauce';
type ConversationTone = 'tangy' | 'zesty' | 'sweet' | 'hot' | 'smoky';

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
  sweet: [
    { id: 'swt1', text: "What's the best thing that happened to you today?", level: 'sweet', tone: 'sweet', category: 'daily' },
    { id: 'swt2', text: "If you could teleport anywhere right now, where would you go?", level: 'sweet', tone: 'tangy', category: 'imagination' },
    { id: 'swt3', text: "What's your go-to comfort food after a long day?", level: 'sweet', tone: 'sweet', category: 'food' },
    { id: 'swt4', text: "Are you more of a morning person or night owl?", level: 'sweet', tone: 'zesty', category: 'lifestyle' },
    { id: 'swt5', text: "What song has been stuck in your head lately?", level: 'sweet', tone: 'tangy', category: 'music' },
    { id: 'swt6', text: "Coffee, tea, or something stronger?", level: 'sweet', tone: 'hot', category: 'preferences' },
    { id: 'swt7', text: "What's the last show you couldn't stop watching?", level: 'sweet', tone: 'sweet', category: 'entertainment' },
    { id: 'swt8', text: "If your pet could talk, what would they say about you?", level: 'sweet', tone: 'zesty', category: 'fun' },
  ],
  mild: [
    { id: 'mld1', text: "What's something you're really looking forward to?", level: 'mild', tone: 'sweet', category: 'future' },
    { id: 'mld2', text: "Tell me about your ideal weekend - lazy or adventure-packed?", level: 'mild', tone: 'smoky', category: 'lifestyle' },
    { id: 'mld3', text: "What's a skill you've always wanted to learn?", level: 'mild', tone: 'sweet', category: 'growth' },
    { id: 'mld4', text: "What's the most spontaneous thing you've ever done?", level: 'mild', tone: 'tangy', category: 'adventure' },
    { id: 'mld5', text: "If you won the lottery tomorrow, what's the first thing you'd do?", level: 'mild', tone: 'zesty', category: 'dreams' },
    { id: 'mld6', text: "What's your hidden talent that would surprise most people?", level: 'mild', tone: 'hot', category: 'personal' },
    { id: 'mld7', text: "What's the best trip you've ever taken?", level: 'mild', tone: 'sweet', category: 'travel' },
    { id: 'mld8', text: "What do you do to unwind after a stressful day?", level: 'mild', tone: 'smoky', category: 'wellness' },
  ],
  spicy: [
    { id: 'spc1', text: "What's something you've changed your mind about recently?", level: 'spicy', tone: 'smoky', category: 'growth' },
    { id: 'spc2', text: "What does your ideal relationship look like?", level: 'spicy', tone: 'sweet', category: 'relationships' },
    { id: 'spc3', text: "What's a goal you're actively working towards?", level: 'spicy', tone: 'sweet', category: 'ambition' },
    { id: 'spc4', text: "What's the most valuable lesson life has taught you?", level: 'spicy', tone: 'smoky', category: 'wisdom' },
    { id: 'spc5', text: "If you could have dinner with anyone, living or dead, who would it be?", level: 'spicy', tone: 'sweet', category: 'values' },
    { id: 'spc6', text: "What makes you feel most alive?", level: 'spicy', tone: 'sweet', category: 'passion' },
    { id: 'spc7', text: "What's something you're proud of that others might not know about?", level: 'spicy', tone: 'smoky', category: 'personal' },
    { id: 'spc8', text: "How do you know when you really trust someone?", level: 'spicy', tone: 'sweet', category: 'trust' },
  ],
  hot_sauce: [
    { id: 'hot1', text: "What do you value most in a partner?", level: 'hot_sauce', tone: 'sweet', category: 'relationships' },
    { id: 'hot2', text: "Where do you see yourself in five years?", level: 'hot_sauce', tone: 'smoky', category: 'future' },
    { id: 'hot3', text: "What does commitment mean to you?", level: 'hot_sauce', tone: 'sweet', category: 'relationships' },
    { id: 'hot4', text: "How do you handle disagreements in a relationship?", level: 'hot_sauce', tone: 'smoky', category: 'communication' },
    { id: 'hot5', text: "What's your love language?", level: 'hot_sauce', tone: 'sweet', category: 'relationships' },
    { id: 'hot6', text: "What role does family play in your life?", level: 'hot_sauce', tone: 'smoky', category: 'family' },
    { id: 'hot7', text: "What are your non-negotiables in a relationship?", level: 'hot_sauce', tone: 'sweet', category: 'boundaries' },
    { id: 'hot8', text: "How do you balance independence and togetherness?", level: 'hot_sauce', tone: 'smoky', category: 'balance' },
  ],
};

function getLevelFromMessageCount(messageCount: number): QuestionLevel {
  if (messageCount < 5) return 'sweet';
  if (messageCount < 15) return 'mild';
  if (messageCount < 30) return 'spicy';
  return 'hot_sauce';
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
