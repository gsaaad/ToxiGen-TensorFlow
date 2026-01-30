/**
 * Toxic Text Rewriter
 * Transforms toxic text into neutral, constructive alternatives
 */

// Simple profanity list for filtering
const PROFANITY_LIST = ['fuck', 'shit', 'ass', 'damn', 'hell', 'bitch', 'bastard', 'crap', 'dick', 'piss'];

function simpleProfanityFilter(text) {
  let filtered = text;
  PROFANITY_LIST.forEach(word => {
    const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
    filtered = filtered.replace(regex, match => '*'.repeat(match.length));
  });
  return filtered;
}

function checkProfanity(text) {
  const lower = text.toLowerCase();
  return PROFANITY_LIST.some(word => lower.includes(word));
}

// ============================================
// TOXIC PATTERNS & REPLACEMENTS
// ============================================

const TOXIC_PATTERNS = [
  // Direct insults → Constructive feedback
  { pattern: /you('re| are) (an? )?(idiot|stupid|dumb|moron|fool)/gi, replacement: "I think there might be a misunderstanding" },
  { pattern: /you('re| are) (so )?(pathetic|worthless|useless)/gi, replacement: "I feel like we could approach this differently" },
  { pattern: /what('s| is) wrong with you/gi, replacement: "I'm confused by this situation" },
  { pattern: /are you (stupid|dumb|an? idiot)/gi, replacement: "Could you help me understand your perspective" },
  
  // Aggressive commands → Polite requests
  { pattern: /shut (the fuck )?up/gi, replacement: "I'd appreciate if we could pause this discussion" },
  { pattern: /go to hell/gi, replacement: "I need some space from this conversation" },
  { pattern: /get lost/gi, replacement: "I think we should take a break" },
  { pattern: /leave me alone/gi, replacement: "I need some time to myself" },
  { pattern: /go away/gi, replacement: "Could we continue this later" },
  
  // Profanity expressions → Clean alternatives
  { pattern: /what the (hell|fuck|heck)/gi, replacement: "I'm really surprised by" },
  { pattern: /for (fuck|god)('s)? sake/gi, replacement: "I'm feeling frustrated" },
  { pattern: /damn (it|you)/gi, replacement: "this is frustrating" },
  { pattern: /oh my (god|gosh)/gi, replacement: "wow" },
  
  // Threats → Assertive boundaries
  { pattern: /i('ll| will) (kill|hurt|destroy) you/gi, replacement: "I'm very upset about this" },
  { pattern: /you('ll| will) (regret|pay for) this/gi, replacement: "I hope we can resolve this" },
  { pattern: /watch your back/gi, replacement: "I think we need to discuss this seriously" },
  { pattern: /i('ll| will) make you pay/gi, replacement: "I feel this situation needs to be addressed" },
  
  // Hate speech patterns → Inclusive language
  { pattern: /i hate (you|this)/gi, replacement: "I strongly disagree with" },
  { pattern: /you('re| are) the worst/gi, replacement: "I'm disappointed with this situation" },
  { pattern: /nobody likes you/gi, replacement: "I'm sensing some tension here" },
  { pattern: /everyone hates you/gi, replacement: "There seems to be a communication issue" },
  
  // Dismissive language → Respectful disagreement
  { pattern: /i don('t| do not) care/gi, replacement: "I have a different perspective" },
  { pattern: /whatever/gi, replacement: "I see your point, though I disagree" },
  { pattern: /that('s| is) (so )?(stupid|dumb|ridiculous)/gi, replacement: "I have concerns about this approach" },
  { pattern: /you don('t| do not) know anything/gi, replacement: "I'd like to share my understanding" },
  
  // Sarcastic attacks → Direct communication
  { pattern: /oh,? (so )?you('re| are) (so )?smart/gi, replacement: "I value your input" },
  { pattern: /congratulations,? genius/gi, replacement: "Thank you for your contribution" },
  { pattern: /wow,? (how )?original/gi, replacement: "That's an interesting perspective" }
];

// ============================================
// WORD-LEVEL REPLACEMENTS
// ============================================

const WORD_REPLACEMENTS = {
  // Insults
  'idiot': 'person',
  'stupid': 'mistaken',
  'dumb': 'uninformed',
  'moron': 'individual',
  'fool': 'person',
  'loser': 'person',
  'jerk': 'individual',
  'creep': 'person',
  'weirdo': 'unique person',
  'freak': 'different person',
  
  // Profanity
  'damn': 'darn',
  'hell': 'heck',
  'crap': 'stuff',
  'sucks': 'is disappointing',
  'suck': 'disappoint',
  
  // Intensifiers (toxic context)
  'hate': 'strongly dislike',
  'despise': 'disagree with',
  'loathe': 'have concerns about',
  'disgusting': 'concerning',
  'pathetic': 'disappointing',
  'terrible': 'problematic',
  'horrible': 'concerning',
  'awful': 'not ideal',
  'worst': 'challenging',
  
  // Aggressive
  'destroy': 'address',
  'crush': 'overcome',
  'annihilate': 'handle',
  'kill': 'stop',
  'murder': 'end'
};

// ============================================
// CONSTRUCTIVE ALTERNATIVES DATABASE
// ============================================

const DISAGREEMENT_PHRASES = [
  "I see things differently",
  "I respectfully disagree",
  "I have a different perspective on this",
  "I understand your view, but I think...",
  "From my perspective...",
  "I'd like to offer an alternative viewpoint",
  "While I see your point, I believe...",
  "I appreciate your input, though I think..."
];

const FRUSTRATION_PHRASES = [
  "I'm feeling frustrated about this",
  "This situation is challenging for me",
  "I'm finding this difficult",
  "I need some time to process this",
  "I'm having a hard time with this",
  "This is really testing my patience"
];

const CRITICISM_STARTERS = [
  "I've noticed that...",
  "It might be helpful to consider...",
  "One thing I've observed is...",
  "Have you considered...",
  "I wonder if we could...",
  "Perhaps we could explore..."
];

// ============================================
// MAIN REWRITER FUNCTIONS
// ============================================

/**
 * Rewrite toxic text to be more constructive
 */
export function rewriteToxicText(text, options = {}) {
  if (!text || !text.trim()) {
    return { 
      original: text, 
      rewritten: text, 
      changes: [], 
      toxicWordsFound: [],
      suggestions: []
    };
  }

  const { preserveMeaning = true, formalityLevel = 'neutral' } = options;
  
  let rewritten = text;
  const changes = [];
  const toxicWordsFound = [];

  // Step 1: Apply pattern replacements
  TOXIC_PATTERNS.forEach(({ pattern, replacement }) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        changes.push({
          type: 'pattern',
          original: match,
          replacement: replacement,
          reason: 'Toxic pattern detected'
        });
        toxicWordsFound.push(match);
      });
      rewritten = rewritten.replace(pattern, replacement);
    }
  });

  // Step 2: Apply word-level replacements
  Object.entries(WORD_REPLACEMENTS).forEach(([toxic, neutral]) => {
    const regex = new RegExp(`\\b${toxic}\\b`, 'gi');
    const matches = rewritten.match(regex);
    if (matches) {
      matches.forEach(match => {
        if (!toxicWordsFound.includes(match.toLowerCase())) {
          changes.push({
            type: 'word',
            original: match,
            replacement: neutral,
            reason: 'Toxic word replaced'
          });
          toxicWordsFound.push(match.toLowerCase());
        }
      });
      rewritten = rewritten.replace(regex, neutral);
    }
  });

  // Step 3: Filter remaining profanity
  try {
    const filtered = simpleProfanityFilter(rewritten);
    if (filtered !== rewritten) {
      changes.push({
        type: 'profanity',
        original: 'profanity detected',
        replacement: 'filtered',
        reason: 'Profanity removed'
      });
      rewritten = filtered;
    }
  } catch (e) {
    // Filter might throw on some edge cases
  }

  // Step 4: Generate alternative suggestions
  const suggestions = generateSuggestions(text, toxicWordsFound);

  // Step 5: Adjust formality if needed
  if (formalityLevel === 'formal') {
    rewritten = makeFormal(rewritten);
  } else if (formalityLevel === 'casual') {
    rewritten = makeCasual(rewritten);
  }

  return {
    original: text,
    rewritten: rewritten.trim(),
    changes,
    toxicWordsFound: [...new Set(toxicWordsFound)],
    suggestions,
    wasChanged: text !== rewritten
  };
}

/**
 * Generate alternative phrasings
 */
function generateSuggestions(text, toxicWords) {
  const suggestions = [];
  const lowerText = text.toLowerCase();

  // Check for disagreement context
  if (lowerText.includes('disagree') || lowerText.includes('wrong') || lowerText.includes('stupid idea')) {
    suggestions.push({
      type: 'Expressing Disagreement',
      alternatives: DISAGREEMENT_PHRASES.slice(0, 3)
    });
  }

  // Check for frustration context
  if (toxicWords.length > 0 || lowerText.includes('frustrated') || lowerText.includes('angry')) {
    suggestions.push({
      type: 'Expressing Frustration',
      alternatives: FRUSTRATION_PHRASES.slice(0, 3)
    });
  }

  // Check for criticism context
  if (lowerText.includes('you should') || lowerText.includes('you need to') || lowerText.includes("you're doing")) {
    suggestions.push({
      type: 'Giving Feedback',
      alternatives: CRITICISM_STARTERS.slice(0, 3)
    });
  }

  return suggestions;
}

/**
 * Make text more formal
 */
function makeFormal(text) {
  const informalToFormal = {
    "i'm": "I am",
    "you're": "you are",
    "don't": "do not",
    "can't": "cannot",
    "won't": "will not",
    "isn't": "is not",
    "aren't": "are not",
    "wasn't": "was not",
    "weren't": "were not",
    "haven't": "have not",
    "hasn't": "has not",
    "hadn't": "had not",
    "wouldn't": "would not",
    "couldn't": "could not",
    "shouldn't": "should not",
    "gonna": "going to",
    "wanna": "want to",
    "gotta": "have to",
    "yeah": "yes",
    "nope": "no",
    "ok": "acceptable",
    "okay": "acceptable"
  };

  let formal = text;
  Object.entries(informalToFormal).forEach(([informal, formalWord]) => {
    const regex = new RegExp(`\\b${informal}\\b`, 'gi');
    formal = formal.replace(regex, formalWord);
  });

  return formal;
}

/**
 * Make text more casual (friendly)
 */
function makeCasual(text) {
  // Already neutral/casual from replacements
  return text;
}

/**
 * Get safe insult alternatives (playful, non-toxic)
 */
export function getSafeInsults() {
  return [
    { original: "You're an idiot", safe: "You're a unique thinker", playful: "You're a character!" },
    { original: "That's stupid", safe: "That's an interesting approach", playful: "That's... creative!" },
    { original: "You're the worst", safe: "We have different styles", playful: "You're definitely one of a kind!" },
    { original: "Shut up", safe: "Let's take turns speaking", playful: "Pause for dramatic effect!" },
    { original: "I hate you", safe: "I'm frustrated with you", playful: "You're testing my zen!" },
    { original: "You're annoying", safe: "Our communication styles differ", playful: "You're persistent!" },
    { original: "Get lost", safe: "I need some space", playful: "Go explore the world!" },
    { original: "You suck", safe: "There's room for improvement", playful: "Not your finest moment!" },
    { original: "You're pathetic", safe: "I expected more", playful: "You're keeping us humble!" },
    { original: "What an idiot", safe: "That was unexpected", playful: "Plot twist!" }
  ];
}

/**
 * Analyze text for toxic elements and provide report
 */
export function analyzeForRewriting(text) {
  if (!text) return null;

  const result = rewriteToxicText(text);
  const profanityCheck = checkProfanity(text);
  
  // Count severity
  let severity = 'none';
  if (result.toxicWordsFound.length > 5 || profanityCheck) {
    severity = 'high';
  } else if (result.toxicWordsFound.length > 2) {
    severity = 'medium';
  } else if (result.toxicWordsFound.length > 0) {
    severity = 'low';
  }

  return {
    ...result,
    severity,
    profanityDetected: profanityCheck,
    improvementPercent: result.wasChanged 
      ? Math.min(100, result.changes.length * 15 + 30)
      : 0
  };
}

export default {
  rewriteToxicText,
  getSafeInsults,
  analyzeForRewriting
};
