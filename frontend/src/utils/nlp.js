/**
 * NLP Analysis Utilities
 * Comprehensive text analysis functions
 */

import nlp from "compromise";
import { franc } from "franc-min";
import keywordExtractor from "keyword-extractor";
import Sentiment from "sentiment";
import stringSimilarity from "string-similarity";

const sentimentAnalyzer = new Sentiment();

// ============================================
// 1. TEXT STATISTICS
// ============================================

/**
 * Calculate comprehensive text statistics
 */
export function getTextStatistics(text) {
  if (!text || !text.trim()) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      avgWordLength: 0,
      avgWordsPerSentence: 0,
      uniqueWords: 0,
      uniqueWordPercentage: 0,
      syllables: 0,
      avgSyllablesPerWord: 0,
    };
  }

  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const uniqueWords = new Set(
    words.map((w) => w.toLowerCase().replace(/[^a-z]/g, "")),
  );

  const totalWordLength = words.reduce(
    (sum, w) => sum + w.replace(/[^a-zA-Z]/g, "").length,
    0,
  );
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words: words.length,
    sentences: sentences.length,
    paragraphs: Math.max(paragraphs.length, 1),
    avgWordLength: words.length
      ? (totalWordLength / words.length).toFixed(1)
      : 0,
    avgWordsPerSentence: sentences.length
      ? (words.length / sentences.length).toFixed(1)
      : 0,
    uniqueWords: uniqueWords.size,
    uniqueWordPercentage: words.length
      ? Math.round((uniqueWords.size / words.length) * 100)
      : 0,
    syllables,
    avgSyllablesPerWord: words.length
      ? (syllables / words.length).toFixed(2)
      : 0,
  };
}

/**
 * Count syllables in a word (approximation)
 */
function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");

  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// ============================================
// 2. SENTIMENT ANALYSIS
// ============================================

/**
 * Analyze sentiment of text
 */
export function analyzeSentiment(text) {
  if (!text || !text.trim()) {
    return {
      score: 0,
      comparative: 0,
      positive: [],
      negative: [],
      label: "Neutral",
      emoji: "😐",
      positivePercent: 33,
      negativePercent: 33,
      neutralPercent: 34,
    };
  }

  const result = sentimentAnalyzer.analyze(text);

  // Calculate percentages
  const totalWords = text.split(/\s+/).length;
  const positiveCount = result.positive.length;
  const negativeCount = result.negative.length;
  const neutralCount = totalWords - positiveCount - negativeCount;

  const positivePercent = Math.round((positiveCount / totalWords) * 100) || 0;
  const negativePercent = Math.round((negativeCount / totalWords) * 100) || 0;
  const neutralPercent = 100 - positivePercent - negativePercent;

  // Determine label and emoji
  let label, emoji;
  if (result.comparative >= 0.5) {
    label = "Very Positive";
    emoji = "😄";
  } else if (result.comparative >= 0.1) {
    label = "Positive";
    emoji = "🙂";
  } else if (result.comparative >= -0.1) {
    label = "Neutral";
    emoji = "😐";
  } else if (result.comparative >= -0.5) {
    label = "Negative";
    emoji = "😠";
  } else {
    label = "Very Negative";
    emoji = "😡";
  }

  return {
    score: result.score,
    comparative: result.comparative,
    positive: result.positive.slice(0, 10),
    negative: result.negative.slice(0, 10),
    label,
    emoji,
    positivePercent,
    negativePercent,
    neutralPercent,
  };
}

// ============================================
// 3. READABILITY SCORES
// ============================================

/**
 * Calculate readability metrics
 */
export function calculateReadability(text) {
  const stats = getTextStatistics(text);

  if (stats.words < 1 || stats.sentences < 1) {
    return {
      fleschKincaid: 0,
      fleschReadingEase: 0,
      gunningFog: 0,
      smog: 0,
      gradeLevel: "N/A",
      difficulty: "N/A",
      difficultyColor: "gray",
    };
  }

  const words = stats.words;
  const sentences = stats.sentences;
  const syllables = stats.syllables;

  // Count complex words (3+ syllables)
  const textWords = text.split(/\s+/);
  const complexWords = textWords.filter((w) => countSyllables(w) >= 3).length;

  // Flesch-Kincaid Grade Level
  const fleschKincaid =
    0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;

  // Flesch Reading Ease
  const fleschReadingEase =
    206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);

  // Gunning Fog Index
  const gunningFog = 0.4 * (words / sentences + 100 * (complexWords / words));

  // SMOG Index
  const smog = 1.043 * Math.sqrt(complexWords * (30 / sentences)) + 3.1291;

  // Determine grade level and difficulty
  const avgGrade = (fleschKincaid + gunningFog + smog) / 3;
  let gradeLevel, difficulty, difficultyColor;

  if (avgGrade <= 6) {
    gradeLevel = "Elementary";
    difficulty = "Very Easy";
    difficultyColor = "green";
  } else if (avgGrade <= 9) {
    gradeLevel = "Middle School";
    difficulty = "Easy";
    difficultyColor = "lime";
  } else if (avgGrade <= 12) {
    gradeLevel = "High School";
    difficulty = "Moderate";
    difficultyColor = "yellow";
  } else if (avgGrade <= 16) {
    gradeLevel = "College";
    difficulty = "Difficult";
    difficultyColor = "orange";
  } else {
    gradeLevel = "Graduate";
    difficulty = "Very Difficult";
    difficultyColor = "red";
  }

  return {
    fleschKincaid: Math.max(0, fleschKincaid).toFixed(1),
    fleschReadingEase: Math.min(100, Math.max(0, fleschReadingEase)).toFixed(1),
    gunningFog: Math.max(0, gunningFog).toFixed(1),
    smog: Math.max(0, smog).toFixed(1),
    gradeLevel,
    difficulty,
    difficultyColor,
  };
}

// ============================================
// 4. KEYWORD EXTRACTION
// ============================================

/**
 * Extract keywords from text
 */
export function extractKeywords(text, maxKeywords = 10) {
  if (!text || text.trim().length < 10) {
    return [];
  }

  try {
    const keywords = keywordExtractor.extract(text, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    });

    // Calculate importance scores based on frequency
    const wordFreq = {};
    const words = text.toLowerCase().split(/\s+/);
    words.forEach((w) => {
      const clean = w.replace(/[^a-z]/g, "");
      if (clean.length > 2) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    });

    const maxFreq = Math.max(...Object.values(wordFreq), 1);

    return keywords
      .slice(0, maxKeywords)
      .map((keyword) => ({
        word: keyword,
        score: (wordFreq[keyword.toLowerCase()] || 1) / maxFreq,
        frequency: wordFreq[keyword.toLowerCase()] || 1,
      }))
      .sort((a, b) => b.score - a.score);
  } catch (e) {
    console.error("Keyword extraction error:", e);
    return [];
  }
}

// ============================================
// 5. LANGUAGE DETECTION
// ============================================

const LANGUAGE_NAMES = {
  eng: { name: "English", flag: "🇺🇸" },
  spa: { name: "Spanish", flag: "🇪🇸" },
  fra: { name: "French", flag: "🇫🇷" },
  deu: { name: "German", flag: "🇩🇪" },
  ita: { name: "Italian", flag: "🇮🇹" },
  por: { name: "Portuguese", flag: "🇵🇹" },
  rus: { name: "Russian", flag: "🇷🇺" },
  jpn: { name: "Japanese", flag: "🇯🇵" },
  zho: { name: "Chinese", flag: "🇨🇳" },
  kor: { name: "Korean", flag: "🇰🇷" },
  ara: { name: "Arabic", flag: "🇸🇦" },
  hin: { name: "Hindi", flag: "🇮🇳" },
  nld: { name: "Dutch", flag: "🇳🇱" },
  pol: { name: "Polish", flag: "🇵🇱" },
  tur: { name: "Turkish", flag: "🇹🇷" },
  und: { name: "Unknown", flag: "🏳️" },
};

/**
 * Detect language of text
 */
export function detectLanguage(text) {
  if (!text || text.trim().length < 10) {
    return {
      code: "und",
      name: "Unknown",
      flag: "🏳️",
      confidence: 0,
    };
  }

  try {
    const detected = franc(text);
    const langInfo = LANGUAGE_NAMES[detected] || LANGUAGE_NAMES.und;

    // Estimate confidence based on text length
    const confidence = Math.min(95, 50 + text.length / 10);

    return {
      code: detected,
      name: langInfo.name,
      flag: langInfo.flag,
      confidence: Math.round(confidence),
    };
  } catch (e) {
    return {
      code: "und",
      name: "Unknown",
      flag: "🏳️",
      confidence: 0,
    };
  }
}

// ============================================
// 6. PART OF SPEECH TAGGING
// ============================================

const POS_COLORS = {
  Noun: { bg: "bg-blue-100", text: "text-blue-700", label: "NOUN" },
  Verb: { bg: "bg-green-100", text: "text-green-700", label: "VERB" },
  Adjective: { bg: "bg-yellow-100", text: "text-yellow-700", label: "ADJ" },
  Adverb: { bg: "bg-purple-100", text: "text-purple-700", label: "ADV" },
  Pronoun: { bg: "bg-pink-100", text: "text-pink-700", label: "PRON" },
  Preposition: { bg: "bg-gray-100", text: "text-gray-600", label: "PREP" },
  Conjunction: { bg: "bg-gray-100", text: "text-gray-600", label: "CONJ" },
  Determiner: { bg: "bg-gray-100", text: "text-gray-500", label: "DET" },
  Other: { bg: "bg-gray-50", text: "text-gray-500", label: "OTHER" },
};

/**
 * Perform POS tagging on text
 */
export function getPOSTags(text) {
  if (!text || !text.trim()) {
    return { tags: [], distribution: {} };
  }

  try {
    const doc = nlp(text);
    const terms = doc.terms().json();

    const tags = terms.map((term) => {
      let pos = "Other";
      const termTags = term.tags || [];

      if (
        termTags.includes("Noun") ||
        termTags.includes("Singular") ||
        termTags.includes("Plural")
      )
        pos = "Noun";
      else if (
        termTags.includes("Verb") ||
        termTags.includes("PastTense") ||
        termTags.includes("Gerund")
      )
        pos = "Verb";
      else if (termTags.includes("Adjective")) pos = "Adjective";
      else if (termTags.includes("Adverb")) pos = "Adverb";
      else if (termTags.includes("Pronoun")) pos = "Pronoun";
      else if (termTags.includes("Preposition")) pos = "Preposition";
      else if (termTags.includes("Conjunction")) pos = "Conjunction";
      else if (termTags.includes("Determiner")) pos = "Determiner";

      return {
        word: term.text,
        pos,
        ...POS_COLORS[pos],
      };
    });

    // Calculate distribution
    const distribution = {};
    tags.forEach((tag) => {
      distribution[tag.pos] = (distribution[tag.pos] || 0) + 1;
    });

    const total = tags.length || 1;
    Object.keys(distribution).forEach((key) => {
      distribution[key] = {
        count: distribution[key],
        percent: Math.round((distribution[key] / total) * 100),
      };
    });

    return { tags, distribution };
  } catch (e) {
    console.error("POS tagging error:", e);
    return { tags: [], distribution: {} };
  }
}

// ============================================
// 7. NAMED ENTITY RECOGNITION
// ============================================

/**
 * Extract named entities from text
 */
export function extractEntities(text) {
  if (!text || !text.trim()) {
    return [];
  }

  try {
    const doc = nlp(text);
    const entities = [];

    // People
    doc.people().forEach((p) => {
      entities.push({
        text: p.text(),
        type: "PERSON",
        icon: "👤",
        color: "bg-blue-100 text-blue-700",
      });
    });

    // Places
    doc.places().forEach((p) => {
      entities.push({
        text: p.text(),
        type: "LOCATION",
        icon: "📍",
        color: "bg-green-100 text-green-700",
      });
    });

    // Organizations
    doc.organizations().forEach((o) => {
      entities.push({
        text: o.text(),
        type: "ORG",
        icon: "🏢",
        color: "bg-purple-100 text-purple-700",
      });
    });

    // Numbers/Values (using match instead of money() which requires plugin)
    doc.match("#Value+").forEach((v) => {
      const txt = v.text();
      if (txt.includes("$") || txt.includes("€") || txt.includes("£")) {
        entities.push({
          text: txt,
          type: "MONEY",
          icon: "💰",
          color: "bg-yellow-100 text-yellow-700",
        });
      }
    });

    // Dates (using match patterns instead of dates() which requires plugin)
    doc.match("(#Month #Value|#Value #Month|#Year)").forEach((d) => {
      entities.push({
        text: d.text(),
        type: "DATE",
        icon: "📅",
        color: "bg-orange-100 text-orange-700",
      });
    });

    // Remove duplicates
    const seen = new Set();
    return entities.filter((e) => {
      const key = `${e.text}-${e.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch (e) {
    console.error("NER error:", e);
    return [];
  }
}

// ============================================
// 8. EMOTION ANALYSIS
// ============================================

// Emotion lexicon (simplified)
const EMOTION_LEXICON = {
  joy: [
    "happy",
    "joy",
    "love",
    "wonderful",
    "great",
    "amazing",
    "excellent",
    "fantastic",
    "delighted",
    "pleased",
    "glad",
    "cheerful",
    "excited",
    "thrilled",
  ],
  sadness: [
    "sad",
    "unhappy",
    "depressed",
    "miserable",
    "sorry",
    "grief",
    "lonely",
    "disappointed",
    "heartbroken",
    "devastated",
    "gloomy",
    "melancholy",
  ],
  anger: [
    "angry",
    "mad",
    "furious",
    "hate",
    "annoyed",
    "frustrated",
    "outraged",
    "hostile",
    "bitter",
    "enraged",
    "irritated",
    "livid",
  ],
  fear: [
    "afraid",
    "scared",
    "terrified",
    "anxious",
    "worried",
    "nervous",
    "panic",
    "dread",
    "frightened",
    "horrified",
    "alarmed",
  ],
  surprise: [
    "surprised",
    "amazed",
    "astonished",
    "shocked",
    "stunned",
    "unexpected",
    "startled",
    "bewildered",
  ],
  disgust: [
    "disgusted",
    "gross",
    "revolting",
    "sick",
    "awful",
    "terrible",
    "horrible",
    "nasty",
    "repulsive",
    "vile",
  ],
  trust: [
    "trust",
    "believe",
    "faith",
    "confident",
    "reliable",
    "honest",
    "loyal",
    "dependable",
    "secure",
  ],
  anticipation: [
    "expect",
    "hope",
    "anticipate",
    "await",
    "eager",
    "excited",
    "looking forward",
    "planning",
  ],
};

const EMOTION_COLORS = {
  joy: { bg: "bg-yellow-100", text: "text-yellow-700", emoji: "😊" },
  sadness: { bg: "bg-blue-100", text: "text-blue-700", emoji: "😢" },
  anger: { bg: "bg-red-100", text: "text-red-700", emoji: "😡" },
  fear: { bg: "bg-purple-100", text: "text-purple-700", emoji: "😨" },
  surprise: { bg: "bg-pink-100", text: "text-pink-700", emoji: "😲" },
  disgust: { bg: "bg-green-100", text: "text-green-700", emoji: "🤢" },
  trust: { bg: "bg-teal-100", text: "text-teal-700", emoji: "🤝" },
  anticipation: { bg: "bg-orange-100", text: "text-orange-700", emoji: "🤔" },
};

/**
 * Analyze emotions in text
 */
export function analyzeEmotions(text) {
  if (!text || !text.trim()) {
    return { emotions: [], primary: null, secondary: null };
  }

  const words = text.toLowerCase().split(/\s+/);
  const emotionScores = {};

  // Count emotion words
  Object.entries(EMOTION_LEXICON).forEach(([emotion, lexicon]) => {
    let count = 0;
    words.forEach((word) => {
      const cleanWord = word.replace(/[^a-z]/g, "");
      if (
        lexicon.some(
          (lex) => cleanWord.includes(lex) || lex.includes(cleanWord),
        )
      ) {
        count++;
      }
    });
    emotionScores[emotion] = count;
  });

  // Calculate percentages
  const total = Object.values(emotionScores).reduce((a, b) => a + b, 0) || 1;

  const emotions = Object.entries(emotionScores)
    .map(([emotion, count]) => ({
      emotion,
      count,
      percent: Math.round((count / total) * 100),
      ...EMOTION_COLORS[emotion],
    }))
    .sort((a, b) => b.count - a.count);

  return {
    emotions,
    primary: emotions[0]?.count > 0 ? emotions[0] : null,
    secondary: emotions[1]?.count > 0 ? emotions[1] : null,
  };
}

// ============================================
// 9. WRITING STYLE ANALYSIS
// ============================================

/**
 * Analyze writing style
 */
export function analyzeWritingStyle(text) {
  if (!text || !text.trim()) {
    return {
      formality: 50,
      formalityLabel: "Neutral",
      confidence: 50,
      confidenceLabel: "Moderate",
      tone: "Neutral",
      voice: { active: 50, passive: 50 },
      perspective: "Third Person",
    };
  }

  const doc = nlp(text);
  const words = text.toLowerCase().split(/\s+/);

  // Formality indicators
  const informalWords = [
    "gonna",
    "wanna",
    "gotta",
    "yeah",
    "nope",
    "hey",
    "ok",
    "okay",
    "lol",
    "omg",
    "btw",
    "idk",
  ];
  const formalWords = [
    "therefore",
    "however",
    "furthermore",
    "consequently",
    "nevertheless",
    "regarding",
    "concerning",
  ];
  const contractions = text.match(/\b\w+'\w+\b/g) || [];

  let formalityScore = 50;
  words.forEach((w) => {
    if (informalWords.includes(w)) formalityScore -= 5;
    if (formalWords.includes(w)) formalityScore += 5;
  });
  formalityScore -= contractions.length * 2;
  formalityScore = Math.max(0, Math.min(100, formalityScore));

  // Confidence indicators
  const hedgeWords = [
    "maybe",
    "perhaps",
    "possibly",
    "might",
    "could",
    "seem",
    "appear",
    "think",
    "believe",
    "guess",
  ];
  const assertiveWords = [
    "definitely",
    "certainly",
    "absolutely",
    "clearly",
    "obviously",
    "must",
    "will",
    "always",
    "never",
  ];

  let confidenceScore = 50;
  words.forEach((w) => {
    if (hedgeWords.includes(w)) confidenceScore -= 5;
    if (assertiveWords.includes(w)) confidenceScore += 5;
  });
  confidenceScore = Math.max(0, Math.min(100, confidenceScore));

  // Perspective detection
  const firstPerson = (text.match(/\b(I|me|my|mine|we|us|our)\b/gi) || [])
    .length;
  const secondPerson = (text.match(/\b(you|your|yours)\b/gi) || []).length;
  const thirdPerson = (
    text.match(/\b(he|she|it|they|him|her|them|his|their)\b/gi) || []
  ).length;

  let perspective = "Third Person";
  if (firstPerson > secondPerson && firstPerson > thirdPerson)
    perspective = "First Person";
  else if (secondPerson > firstPerson && secondPerson > thirdPerson)
    perspective = "Second Person";

  // Voice (active vs passive)
  const passiveCount = doc.sentences().if("#Auxiliary #PastTense").length;
  const totalSentences = doc.sentences().length || 1;
  const passivePercent = Math.round((passiveCount / totalSentences) * 100);

  // Tone
  const sentiment = analyzeSentiment(text);
  let tone = "Neutral";
  if (sentiment.comparative < -0.3) tone = "Negative";
  else if (sentiment.comparative > 0.3) tone = "Positive";
  if (confidenceScore > 70) tone = `Assertive ${tone}`;
  else if (confidenceScore < 30) tone = `Tentative ${tone}`;

  return {
    formality: formalityScore,
    formalityLabel:
      formalityScore >= 70
        ? "Formal"
        : formalityScore >= 40
          ? "Neutral"
          : "Informal",
    confidence: confidenceScore,
    confidenceLabel:
      confidenceScore >= 70
        ? "Assertive"
        : confidenceScore >= 40
          ? "Moderate"
          : "Tentative",
    tone,
    voice: { active: 100 - passivePercent, passive: passivePercent },
    perspective,
  };
}

// ============================================
// 10. TEXT SIMILARITY
// ============================================

/**
 * Compare two texts
 */
export function compareTexts(text1, text2) {
  if (!text1 || !text2) {
    return { similarity: 0, label: "N/A" };
  }

  const similarity = stringSimilarity.compareTwoStrings(text1, text2);

  let label;
  if (similarity >= 0.9) label = "Almost Identical";
  else if (similarity >= 0.7) label = "Very Similar";
  else if (similarity >= 0.5) label = "Somewhat Similar";
  else if (similarity >= 0.3) label = "Different";
  else label = "Very Different";

  return {
    similarity: Math.round(similarity * 100),
    label,
  };
}

// ============================================
// 11. WORD FREQUENCY
// ============================================

/**
 * Get word frequency for word cloud
 */
export function getWordFrequency(text, maxWords = 50) {
  if (!text || !text.trim()) return [];

  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "shall",
    "can",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "what",
    "which",
    "who",
    "when",
    "where",
    "why",
    "how",
    "all",
    "each",
    "every",
    "both",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "just",
    "as",
  ]);

  const words = text.toLowerCase().split(/\s+/);
  const freq = {};

  words.forEach((word) => {
    const clean = word.replace(/[^a-z]/g, "");
    if (clean.length > 2 && !stopWords.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  });

  return Object.entries(freq)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, maxWords);
}

// ============================================
// EXPORT ALL
// ============================================

export default {
  getTextStatistics,
  analyzeSentiment,
  calculateReadability,
  extractKeywords,
  detectLanguage,
  getPOSTags,
  extractEntities,
  analyzeEmotions,
  analyzeWritingStyle,
  compareTexts,
  getWordFrequency,
};
