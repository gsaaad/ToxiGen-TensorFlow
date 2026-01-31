/**
 * Text Rewriter Component
 * Transform toxic text into neutral, constructive alternatives
 */

import { useCallback, useState } from "react";
import { analyzeForRewriting, getSafeInsults } from "../utils/rewriter";

// ============================================
// SAFE ALTERNATIVES PANEL
// ============================================

function SafeAlternativesPanel() {
  const alternatives = getSafeInsults();

  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">💡</span>
        <h3 className="text-lg font-semibold text-gray-800">
          Safe Alternatives Cheatsheet
        </h3>
      </div>

      <div className="space-y-3">
        {alternatives.map((alt, i) => (
          <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium line-through">
                {alt.original}
              </span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700">{alt.safe}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">😊</span>
                <span className="text-gray-600 italic">{alt.playful}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// CHANGES BREAKDOWN
// ============================================

function ChangesBreakdown({ changes }) {
  if (changes.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <span className="text-2xl">✨</span>
        <p className="mt-2 text-sm">No toxic elements detected!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <span>🔄</span> Changes Made ({changes.length})
      </h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {changes.map((change, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm"
          >
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded line-through">
              {change.original}
            </span>
            <span className="text-gray-400">→</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
              {change.replacement}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// SUGGESTIONS PANEL
// ============================================

function SuggestionsPanel({ suggestions }) {
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <span>💬</span> Alternative Phrasings
      </h4>
      {suggestions.map((suggestion, i) => (
        <div key={i} className="bg-blue-50 rounded-lg p-3">
          <div className="text-xs text-blue-600 font-medium mb-2">
            {suggestion.type}
          </div>
          <div className="space-y-1">
            {suggestion.alternatives.map((alt, j) => (
              <div
                key={j}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <span className="text-blue-400">•</span>
                <span>"{alt}"</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// SEVERITY INDICATOR
// ============================================

function SeverityIndicator({ severity, improvementPercent }) {
  const severityConfig = {
    none: {
      color: "green",
      label: "Clean",
      emoji: "✨",
      bg: "bg-green-100 text-green-700",
    },
    low: {
      color: "yellow",
      label: "Mildly Toxic",
      emoji: "😐",
      bg: "bg-yellow-100 text-yellow-700",
    },
    medium: {
      color: "orange",
      label: "Moderately Toxic",
      emoji: "😠",
      bg: "bg-orange-100 text-orange-700",
    },
    high: {
      color: "red",
      label: "Highly Toxic",
      emoji: "😡",
      bg: "bg-red-100 text-red-700",
    },
  };

  const config = severityConfig[severity] || severityConfig.none;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{config.emoji}</span>
        <div>
          <div
            className={`font-semibold ${config.bg} px-2 py-0.5 rounded inline-block`}
          >
            {config.label}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Original text toxicity level
          </div>
        </div>
      </div>
      {improvementPercent > 0 && (
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            +{improvementPercent}%
          </div>
          <div className="text-xs text-gray-500">Improvement</div>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function TextRewriter() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [formality, setFormality] = useState("neutral");
  const [copied, setCopied] = useState(false);

  const handleRewrite = useCallback(() => {
    if (!inputText.trim()) return;

    const analysis = analyzeForRewriting(inputText);
    setResult(analysis);
  }, [inputText]);

  const handleCopy = useCallback(() => {
    if (result?.rewritten) {
      navigator.clipboard.writeText(result.rewritten);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const handleClear = useCallback(() => {
    setInputText("");
    setResult(null);
  }, []);

  const sampleTexts = [
    {
      text: "You're such an idiot, why can't you understand anything?",
      emoji: "😠",
    },
    { text: "Shut up! Nobody asked for your opinion.", emoji: "🤬" },
    { text: "What the hell is wrong with you? This is pathetic!", emoji: "😡" },
    {
      text: "I hate this stupid idea, it's the worst thing ever.",
      emoji: "👎",
    },
    {
      text: "You're so annoying, just go away and leave me alone!",
      emoji: "😤",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔄</span>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Toxic Text Rewriter
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            Transform toxic language into constructive, respectful alternatives
          </p>
        </div>
        <button
          onClick={() => setShowCheatsheet(!showCheatsheet)}
          className="px-4 py-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 rounded-xl font-medium hover:from-green-200 hover:to-teal-200 transition-colors"
        >
          {showCheatsheet ? "Hide" : "Show"} Cheatsheet
        </button>
      </div>

      {/* Cheatsheet */}
      {showCheatsheet && <SafeAlternativesPanel />}

      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">
            Enter Toxic Text
          </label>
          <select
            value={formality}
            onChange={(e) => setFormality(e.target.value)}
            className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-50"
          >
            <option value="neutral">Neutral tone</option>
            <option value="formal">Formal tone</option>
            <option value="casual">Casual tone</option>
          </select>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type toxic text here to transform it into something more constructive..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 resize-none transition-all text-gray-800 placeholder-gray-400"
        />

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button
            onClick={handleRewrite}
            disabled={!inputText.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-200 flex items-center gap-2"
          >
            <span>✨</span>
            Rewrite Text
          </button>

          {inputText && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sample Texts */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-2">Try these examples:</div>
          <div className="flex flex-wrap gap-2">
            {sampleTexts.map((sample, i) => (
              <button
                key={i}
                onClick={() => setInputText(sample.text)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-700 transition-colors flex items-center gap-1"
              >
                <span>{sample.emoji}</span>
                <span className="max-w-[150px] truncate">{sample.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Severity Header */}
          <div className="p-6 border-b border-gray-100">
            <SeverityIndicator
              severity={result.severity}
              improvementPercent={result.improvementPercent}
            />
          </div>

          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Original */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <h3 className="font-semibold text-gray-700">Original</h3>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {result.original}
                </p>
              </div>

              {result.toxicWordsFound.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">
                    Toxic elements detected:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.toxicWordsFound.map((word, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rewritten */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <h3 className="font-semibold text-gray-700">Rewritten</h3>
                </div>
                <button
                  onClick={handleCopy}
                  className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <span>✓</span>
                      Copied!
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {result.rewritten}
                </p>
              </div>

              {!result.wasChanged && (
                <div className="mt-3 flex items-center gap-2 text-green-600 text-sm">
                  <span>✓</span>
                  <span>Text appears to be non-toxic!</span>
                </div>
              )}
            </div>
          </div>

          {/* Changes & Suggestions */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              <ChangesBreakdown changes={result.changes} />
              <SuggestionsPanel suggestions={result.suggestions} />
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>💡</span>
          Tips for Constructive Communication
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>Use "I" statements instead of "You" accusations</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>Focus on behaviors, not personal attacks</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>Express frustration without insults</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>Offer solutions instead of just criticism</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>Take a pause before responding in anger</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>Acknowledge the other person's perspective</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextRewriter;
