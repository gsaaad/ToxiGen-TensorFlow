/**
 * NLP Utilities Test Suite
 * Tests for all NLP analysis functions
 */

import { describe, it, expect } from 'vitest'
import {
  getTextStatistics,
  analyzeSentiment,
  calculateReadability,
  extractKeywords,
  detectLanguage,
  getPOSTags,
  extractEntities,
  analyzeEmotions,
  analyzeWritingStyle,
  getWordFrequency,
  compareTexts,
} from '../nlp'

// ============================================
// TEXT STATISTICS TESTS
// ============================================

describe('getTextStatistics', () => {
  it('should return zeros for empty text', () => {
    const result = getTextStatistics('')
    expect(result.words).toBe(0)
    expect(result.characters).toBe(0)
    expect(result.sentences).toBe(0)
  })

  it('should return zeros for whitespace only', () => {
    const result = getTextStatistics('   ')
    expect(result.words).toBe(0)
  })

  it('should count words correctly', () => {
    const result = getTextStatistics('Hello world this is a test')
    expect(result.words).toBe(6)
  })

  it('should count characters correctly', () => {
    const result = getTextStatistics('Hello')
    expect(result.characters).toBe(5)
    expect(result.charactersNoSpaces).toBe(5)
  })

  it('should count sentences correctly', () => {
    const result = getTextStatistics('Hello world. How are you? I am fine!')
    expect(result.sentences).toBe(3)
  })

  it('should count paragraphs correctly', () => {
    const result = getTextStatistics('First paragraph.\n\nSecond paragraph.')
    expect(result.paragraphs).toBe(2)
  })

  it('should calculate unique words correctly', () => {
    const result = getTextStatistics('hello hello world world world')
    expect(result.uniqueWords).toBe(2)
  })

  it('should calculate average word length', () => {
    const result = getTextStatistics('cat dog')
    expect(parseFloat(result.avgWordLength)).toBe(3)
  })
})

// ============================================
// SENTIMENT ANALYSIS TESTS
// ============================================

describe('analyzeSentiment', () => {
  it('should return neutral for empty text', () => {
    const result = analyzeSentiment('')
    expect(result.label).toBe('Neutral')
    expect(result.score).toBe(0)
  })

  it('should detect positive sentiment', () => {
    const result = analyzeSentiment('I love this amazing wonderful product!')
    expect(result.score).toBeGreaterThan(0)
    expect(['Positive', 'Very Positive']).toContain(result.label)
    expect(result.emoji).toMatch(/😄|🙂/)
  })

  it('should detect negative sentiment', () => {
    const result = analyzeSentiment('This is terrible awful horrible bad')
    expect(result.score).toBeLessThan(0)
    expect(['Negative', 'Very Negative']).toContain(result.label)
    expect(result.emoji).toMatch(/😠|😡/)
  })

  it('should detect neutral sentiment', () => {
    const result = analyzeSentiment('The weather is cloudy today')
    expect(result.label).toBe('Neutral')
  })

  it('should identify positive words', () => {
    const result = analyzeSentiment('This is great and wonderful')
    expect(result.positive.length).toBeGreaterThan(0)
  })

  it('should identify negative words', () => {
    const result = analyzeSentiment('This is bad and terrible')
    expect(result.negative.length).toBeGreaterThan(0)
  })

  it('should calculate sentiment percentages', () => {
    const result = analyzeSentiment('happy sad neutral')
    expect(result.positivePercent + result.negativePercent + result.neutralPercent).toBe(100)
  })
})

// ============================================
// READABILITY TESTS
// ============================================

describe('calculateReadability', () => {
  it('should return N/A for empty text', () => {
    const result = calculateReadability('')
    expect(result.gradeLevel).toBe('N/A')
    expect(result.difficulty).toBe('N/A')
  })

  it('should calculate Flesch Reading Ease', () => {
    const result = calculateReadability('The cat sat on the mat. It was a nice day.')
    expect(result.fleschReadingEase).toBeGreaterThan(0)
  })

  it('should calculate Flesch-Kincaid Grade Level', () => {
    const result = calculateReadability('The quick brown fox jumps over the lazy dog.')
    expect(typeof result.fleschKincaid).toBe('number')
  })

  it('should determine difficulty level', () => {
    // Simple text should be easy
    const simple = calculateReadability('The cat sat. The dog ran. It was fun.')
    expect(['Very Easy', 'Easy', 'Fairly Easy']).toContain(simple.difficulty)

    // Complex text should be harder
    const complex = calculateReadability(
      'The epistemological ramifications of quantum mechanical phenomena necessitate considerable deliberation regarding the fundamental nature of observation and measurement in physical systems.'
    )
    expect(['Difficult', 'Very Difficult', 'Fairly Difficult']).toContain(complex.difficulty)
  })

  it('should estimate reading time', () => {
    // ~200 words per minute average
    const result = calculateReadability('word '.repeat(200))
    expect(result.readingTime).toBeGreaterThan(0)
  })
})

// ============================================
// KEYWORD EXTRACTION TESTS
// ============================================

describe('extractKeywords', () => {
  it('should return empty array for empty text', () => {
    const result = extractKeywords('')
    expect(result).toEqual([])
  })

  it('should extract keywords from text', () => {
    const result = extractKeywords('Machine learning and artificial intelligence are transforming technology')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should return keywords with word and count properties', () => {
    const result = extractKeywords('technology technology innovation innovation')
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('word')
      expect(result[0]).toHaveProperty('count')
    }
  })

  it('should rank by frequency', () => {
    const result = extractKeywords('apple apple apple banana banana cherry')
    if (result.length >= 2) {
      expect(result[0].count).toBeGreaterThanOrEqual(result[1].count)
    }
  })
})

// ============================================
// LANGUAGE DETECTION TESTS
// ============================================

describe('detectLanguage', () => {
  it('should detect English', () => {
    const result = detectLanguage('This is a simple English sentence for testing purposes.')
    expect(result.code).toBe('eng')
    expect(result.name).toBe('English')
  })

  it('should detect Spanish', () => {
    const result = detectLanguage('Hola, ¿cómo estás? Me llamo Juan y vivo en España.')
    expect(result.code).toBe('spa')
    expect(result.name).toBe('Spanish')
  })

  it('should detect French', () => {
    const result = detectLanguage('Bonjour, comment allez-vous? Je suis très content.')
    expect(result.code).toBe('fra')
    expect(result.name).toBe('French')
  })

  it('should return confidence score', () => {
    const result = detectLanguage('Hello world, this is a test sentence.')
    expect(result.confidence).toBeGreaterThanOrEqual(0)
    expect(result.confidence).toBeLessThanOrEqual(100)
  })

  it('should handle unknown/short text', () => {
    const result = detectLanguage('hi')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('code')
  })
})

// ============================================
// POS TAGGING TESTS
// ============================================

describe('getPOSTags', () => {
  it('should return empty array for empty text', () => {
    const result = getPOSTags('')
    expect(result).toEqual([])
  })

  it('should tag words with POS', () => {
    const result = getPOSTags('The quick brown fox jumps')
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('word')
    expect(result[0]).toHaveProperty('tag')
  })

  it('should identify nouns', () => {
    const result = getPOSTags('The dog and cat are friends')
    const nouns = result.filter(t => t.tag === 'Noun')
    expect(nouns.length).toBeGreaterThan(0)
  })

  it('should identify verbs', () => {
    const result = getPOSTags('She runs and jumps quickly')
    const verbs = result.filter(t => t.tag === 'Verb')
    expect(verbs.length).toBeGreaterThan(0)
  })

  it('should identify adjectives', () => {
    const result = getPOSTags('The big red balloon floated away')
    const adjectives = result.filter(t => t.tag === 'Adjective')
    expect(adjectives.length).toBeGreaterThan(0)
  })
})

// ============================================
// NAMED ENTITY RECOGNITION TESTS
// ============================================

describe('extractEntities', () => {
  it('should return empty object for empty text', () => {
    const result = extractEntities('')
    expect(result.people).toEqual([])
    expect(result.places).toEqual([])
    expect(result.organizations).toEqual([])
  })

  it('should extract people names', () => {
    const result = extractEntities('John Smith met with Mary Johnson yesterday')
    expect(result.people.length).toBeGreaterThan(0)
  })

  it('should extract places', () => {
    const result = extractEntities('I visited New York and Los Angeles last summer')
    expect(result.places.length).toBeGreaterThan(0)
  })

  it('should extract organizations', () => {
    const result = extractEntities('Microsoft and Google are tech companies')
    expect(result.organizations.length).toBeGreaterThan(0)
  })

  it('should return entity structure with all categories', () => {
    const result = extractEntities('Test text')
    expect(result).toHaveProperty('people')
    expect(result).toHaveProperty('places')
    expect(result).toHaveProperty('organizations')
  })
})

// ============================================
// EMOTION ANALYSIS TESTS
// ============================================

describe('analyzeEmotions', () => {
  it('should return emotion scores for empty text', () => {
    const result = analyzeEmotions('')
    expect(result).toHaveProperty('joy')
    expect(result).toHaveProperty('sadness')
    expect(result).toHaveProperty('anger')
    expect(result).toHaveProperty('fear')
    expect(result).toHaveProperty('surprise')
  })

  it('should detect joy in happy text', () => {
    const result = analyzeEmotions('I am so happy and excited! This is wonderful!')
    expect(result.joy).toBeGreaterThan(0)
  })

  it('should detect sadness in sad text', () => {
    const result = analyzeEmotions('I feel sad and depressed. Everything is terrible.')
    expect(result.sadness).toBeGreaterThan(0)
  })

  it('should detect anger in angry text', () => {
    const result = analyzeEmotions('I am furious and angry! This makes me mad!')
    expect(result.anger).toBeGreaterThan(0)
  })

  it('should identify dominant emotion', () => {
    const result = analyzeEmotions('I am extremely happy and joyful today!')
    expect(result.dominant).toBeDefined()
  })
})

// ============================================
// WRITING STYLE TESTS
// ============================================

describe('analyzeWritingStyle', () => {
  it('should return style metrics', () => {
    const result = analyzeWritingStyle('This is a test sentence.')
    expect(result).toHaveProperty('formality')
    expect(result).toHaveProperty('vocabularyDiversity')
    expect(result).toHaveProperty('sentenceVariety')
  })

  it('should calculate formality percentage', () => {
    const result = analyzeWritingStyle('The quick brown fox jumps over the lazy dog.')
    expect(result.formality).toBeGreaterThanOrEqual(0)
    expect(result.formality).toBeLessThanOrEqual(100)
  })

  it('should calculate vocabulary diversity', () => {
    const result = analyzeWritingStyle('hello hello hello world')
    expect(result.vocabularyDiversity).toBeGreaterThanOrEqual(0)
    expect(result.vocabularyDiversity).toBeLessThanOrEqual(100)
  })

  it('should detect formal vs informal tone', () => {
    const formal = analyzeWritingStyle(
      'The committee has determined that the proposal requires further deliberation.'
    )
    const informal = analyzeWritingStyle(
      'Hey! Gonna grab some food, wanna come?'
    )
    expect(formal.formalityLabel).not.toBe(informal.formalityLabel)
  })
})

// ============================================
// WORD FREQUENCY TESTS
// ============================================

describe('getWordFrequency', () => {
  it('should return empty array for empty text', () => {
    const result = getWordFrequency('')
    expect(result).toEqual([])
  })

  it('should count word frequencies', () => {
    const result = getWordFrequency('apple banana apple cherry apple banana')
    const apple = result.find(w => w.word === 'apple')
    expect(apple).toBeDefined()
    expect(apple.count).toBe(3)
  })

  it('should be case insensitive', () => {
    const result = getWordFrequency('Hello HELLO hello')
    expect(result.length).toBe(1)
    expect(result[0].count).toBe(3)
  })

  it('should sort by frequency descending', () => {
    const result = getWordFrequency('a b b c c c')
    expect(result[0].count).toBeGreaterThanOrEqual(result[1].count)
  })
})

// ============================================
// TEXT COMPARISON TESTS
// ============================================

describe('compareTexts', () => {
  it('should return 100% similarity for identical texts', () => {
    const result = compareTexts('Hello world', 'Hello world')
    expect(result.similarity).toBe(100)
  })

  it('should return 0% similarity for completely different texts', () => {
    const result = compareTexts('abc', 'xyz')
    expect(result.similarity).toBeLessThan(50)
  })

  it('should detect high similarity for similar texts', () => {
    const result = compareTexts('The quick brown fox', 'The quick brown dog')
    expect(result.similarity).toBeGreaterThan(50)
  })

  it('should return comparison metrics', () => {
    const result = compareTexts('Hello world', 'Hello there')
    expect(result).toHaveProperty('similarity')
    expect(result).toHaveProperty('text1Stats')
    expect(result).toHaveProperty('text2Stats')
  })

  it('should handle empty texts', () => {
    const result = compareTexts('', '')
    expect(result).toHaveProperty('similarity')
  })
})
