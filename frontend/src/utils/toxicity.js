/**
 * Word Importance Calculator (SHAP-style)
 * Uses perturbation-based analysis to explain toxicity predictions
 */

/**
 * Calculate word importance by masking each word and measuring impact
 * @param {Object} model - Loaded TensorFlow.js toxicity model
 * @param {string} text - Input text to analyze
 * @returns {Promise<Array>} Array of word importance objects
 */
export async function calculateWordImportance(model, text) {
  if (!model || !text.trim()) return [];
  
  const words = text.split(/\s+/);
  if (words.length === 0) return [];
  
  // Get baseline prediction
  const baselinePrediction = await model.classify([text]);
  const baseScores = extractScores(baselinePrediction);
  const baseMaxScore = Math.max(...Object.values(baseScores));
  
  const importance = [];
  
  // Calculate importance for each word
  for (let i = 0; i < words.length; i++) {
    // Create masked version (remove the word)
    const maskedWords = [...words];
    maskedWords[i] = '';
    const maskedText = maskedWords.filter(w => w).join(' ');
    
    if (!maskedText.trim()) {
      importance.push({
        word: words[i],
        score: baseMaxScore,
        index: i,
        category: 'high'
      });
      continue;
    }
    
    // Get prediction without this word
    const maskedPrediction = await model.classify([maskedText]);
    const maskedScores = extractScores(maskedPrediction);
    const maskedMaxScore = Math.max(...Object.values(maskedScores));
    
    // Importance = how much the score drops when word is removed
    const importanceScore = baseMaxScore - maskedMaxScore;
    
    importance.push({
      word: words[i],
      score: importanceScore,
      index: i,
      category: getImportanceCategory(importanceScore)
    });
  }
  
  return importance;
}

/**
 * Extract toxicity scores from model prediction
 */
export function extractScores(predictions) {
  const scores = {};
  predictions.forEach(pred => {
    const probability = pred.results[0]?.probabilities[1] || 0;
    scores[pred.label] = probability;
  });
  return scores;
}

/**
 * Get the maximum toxicity score from predictions
 */
export function getMaxToxicity(predictions) {
  const scores = extractScores(predictions);
  return Math.max(...Object.values(scores));
}

/**
 * Categorize importance level
 */
function getImportanceCategory(score) {
  if (score > 0.3) return 'high';
  if (score > 0.1) return 'medium';
  if (score > 0) return 'low';
  if (score > -0.1) return 'neutral';
  return 'positive';
}

/**
 * Get top N most important words
 */
export function getTopWords(importance, n = 5) {
  return [...importance]
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
    .slice(0, n);
}

/**
 * Format predictions for display
 * Handles both raw TF.js format and pre-transformed format from useToxicity hook
 */
export function formatPredictions(predictions) {
  return predictions.map(pred => {
    // Check if already transformed (from useToxicity hook)
    if (pred.probabilities !== undefined) {
      return {
        label: pred.label,
        displayName: formatLabel(pred.label),
        match: pred.match || false,
        probability: pred.probabilities[1] || 0,
        confidence: Math.max(...pred.probabilities)
      };
    }
    // Raw TF.js format
    return {
      label: pred.label,
      displayName: formatLabel(pred.label),
      match: pred.results?.[0]?.match || false,
      probability: pred.results?.[0]?.probabilities?.[1] || 0,
      confidence: Math.max(...(pred.results?.[0]?.probabilities || [0]))
    };
  });
}

/**
 * Format label for display
 */
export function formatLabel(label) {
  const labels = {
    'identity_attack': 'Identity Attack',
    'insult': 'Insult',
    'obscene': 'Obscene',
    'severe_toxicity': 'Severe Toxicity',
    'sexual_explicit': 'Sexual Explicit',
    'threat': 'Threat',
    'toxicity': 'Toxicity'
  };
  return labels[label] || label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Get color class based on score
 */
export function getScoreColor(score) {
  if (score >= 0.7) return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-100' };
  if (score >= 0.4) return { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-100' };
  if (score >= 0.2) return { bg: 'bg-yellow-500', text: 'text-yellow-700', light: 'bg-yellow-100' };
  return { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-100' };
}

/**
 * Get safety label based on toxicity score
 */
export function getScoreLabel(score) {
  if (score >= 0.9) return { text: 'Toxic', bg: 'bg-red-100', color: 'text-red-700', icon: '🔴' };
  if (score >= 0.7) return { text: 'High Risk', bg: 'bg-orange-100', color: 'text-orange-700', icon: '🟠' };
  if (score >= 0.5) return { text: 'Moderate', bg: 'bg-yellow-100', color: 'text-yellow-700', icon: '🟡' };
  if (score >= 0.1) return { text: 'Low Risk', bg: 'bg-blue-100', color: 'text-blue-700', icon: '🔵' };
  return { text: 'Safe', bg: 'bg-green-100', color: 'text-green-700', icon: '🟢' };
}

/**
 * Get importance color for word highlighting
 */
export function getImportanceColor(score) {
  if (score > 0.3) return 'bg-red-500 text-white';
  if (score > 0.15) return 'bg-red-300 text-red-900';
  if (score > 0.05) return 'bg-orange-200 text-orange-900';
  if (score > 0) return 'bg-yellow-100 text-yellow-900';
  if (score > -0.05) return 'bg-gray-100 text-gray-700';
  return 'bg-green-200 text-green-900';
}
