/**
 * NLP Analysis Component
 * Comprehensive text analysis with multiple NLP features
 */

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  analyzeEmotions,
  analyzeSentiment,
  analyzeWritingStyle,
  calculateReadability,
  detectLanguage,
  extractEntities,
  extractKeywords,
  getPOSTags,
  getTextStatistics,
  getWordFrequency,
} from "../utils/nlp";

// ============================================
// LOADING SKELETON COMPONENT
// ============================================

function LoadingSkeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} aria-hidden="true" />
  );
}

function AnalysisLoadingState() {
  return (
    <div className="space-y-4 p-6" role="status" aria-label="Loading analysis">
      <div className="flex items-center gap-3">
        <LoadingSkeleton className="w-10 h-10 rounded-lg" />
        <LoadingSkeleton className="w-40 h-6" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <LoadingSkeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-2">
                <LoadingSkeleton className="w-16 h-6" />
                <LoadingSkeleton className="w-12 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <LoadingSkeleton className="w-full h-20 rounded-xl" />
      <span className="sr-only">Analyzing text, please wait...</span>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatBox({ label, value, icon, color = "blue" }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    pink: "from-pink-500 to-pink-600",
    teal: "from-teal-500 to-teal-600",
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white text-lg`}
        >
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({
  value,
  max = 100,
  color = "blue",
  label,
  showValue = true,
}) {
  const percent = Math.min((value / max) * 100, 100);
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    gray: "bg-gray-500",
  };

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{label}</span>
          {showValue && (
            <span className="font-medium text-gray-800">{value}%</span>
          )}
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// ============================================
// TEXT STATISTICS PANEL
// ============================================

function TextStatisticsPanel({ stats }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📊</span>
        <h3 className="text-lg font-semibold text-gray-800">Text Statistics</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatBox label="Words" value={stats.words} icon="📝" color="blue" />
        <StatBox
          label="Characters"
          value={stats.characters}
          icon="🔤"
          color="green"
        />
        <StatBox
          label="Sentences"
          value={stats.sentences}
          icon="📄"
          color="purple"
        />
        <StatBox
          label="Paragraphs"
          value={stats.paragraphs}
          icon="📑"
          color="orange"
        />
        <StatBox
          label="Unique Words"
          value={stats.uniqueWords}
          icon="✨"
          color="pink"
        />
        <StatBox
          label="Avg Word Length"
          value={stats.avgWordLength}
          icon="📏"
          color="teal"
        />
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Vocabulary Richness</span>
          <span className="text-sm font-semibold text-purple-700">
            {stats.uniqueWordPercentage}% unique
          </span>
        </div>
        <div className="mt-2 h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${stats.uniqueWordPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// SENTIMENT ANALYSIS PANEL
// ============================================

function SentimentPanel({ sentiment }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">😊</span>
        <h3 className="text-lg font-semibold text-gray-800">
          Sentiment Analysis
        </h3>
      </div>

      <div className="flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <div className="text-center">
          <div className="text-6xl mb-2">{sentiment.emoji}</div>
          <div className="text-xl font-bold text-gray-800">
            {sentiment.label}
          </div>
          <div className="text-sm text-gray-500">
            Score: {sentiment.score} | Comparative:{" "}
            {sentiment.comparative.toFixed(3)}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <ProgressBar
          value={sentiment.positivePercent}
          color="green"
          label="Positive"
        />
        <ProgressBar
          value={sentiment.neutralPercent}
          color="gray"
          label="Neutral"
        />
        <ProgressBar
          value={sentiment.negativePercent}
          color="red"
          label="Negative"
        />
      </div>

      {sentiment.positive.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-2">
            Positive words found:
          </div>
          <div className="flex flex-wrap gap-1">
            {sentiment.positive.map((word, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {sentiment.negative.length > 0 && (
        <div className="mt-3">
          <div className="text-sm text-gray-500 mb-2">
            Negative words found:
          </div>
          <div className="flex flex-wrap gap-1">
            {sentiment.negative.map((word, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// READABILITY PANEL
// ============================================

function ReadabilityPanel({ readability }) {
  const difficultyColors = {
    green: "from-green-400 to-green-500",
    lime: "from-lime-400 to-lime-500",
    yellow: "from-yellow-400 to-yellow-500",
    orange: "from-orange-400 to-orange-500",
    red: "from-red-400 to-red-500",
    gray: "from-gray-400 to-gray-500",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📖</span>
        <h3 className="text-lg font-semibold text-gray-800">
          Readability Metrics
        </h3>
      </div>

      <div
        className={`p-6 rounded-xl bg-gradient-to-br ${difficultyColors[readability.difficultyColor] || difficultyColors.gray} text-white text-center`}
      >
        <div className="text-lg opacity-90">Reading Level</div>
        <div className="text-3xl font-bold mt-1">{readability.gradeLevel}</div>
        <div className="text-sm opacity-80 mt-1">{readability.difficulty}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-xs text-gray-500">Flesch-Kincaid Grade</div>
          <div className="text-2xl font-bold text-gray-800">
            {readability.fleschKincaid}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-xs text-gray-500">Reading Ease</div>
          <div className="text-2xl font-bold text-gray-800">
            {readability.fleschReadingEase}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-xs text-gray-500">Gunning Fog</div>
          <div className="text-2xl font-bold text-gray-800">
            {readability.gunningFog}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-xs text-gray-500">SMOG Index</div>
          <div className="text-2xl font-bold text-gray-800">
            {readability.smog}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// KEYWORDS PANEL
// ============================================

function KeywordsPanel({ keywords }) {
  if (keywords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="text-4xl">🔑</span>
        <p className="mt-2">Enter more text to extract keywords</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🔑</span>
        <h3 className="text-lg font-semibold text-gray-800">Key Terms</h3>
      </div>

      <div className="space-y-2">
        {keywords.map((kw, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 w-24 truncate">
              {kw.word}
            </span>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${kw.score * 100}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {(kw.score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-400 w-8">×{kw.frequency}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {keywords.slice(0, 5).map((kw, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
          >
            #{kw.word}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================
// LANGUAGE DETECTION PANEL
// ============================================

function LanguagePanel({ language }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🌍</span>
        <h3 className="text-lg font-semibold text-gray-800">
          Language Detection
        </h3>
      </div>

      <div className="flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl">
        <div className="text-center">
          <div className="text-5xl mb-2">{language.flag}</div>
          <div className="text-xl font-bold text-gray-800">{language.name}</div>
          <div className="text-sm text-gray-500">Code: {language.code}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Detection Confidence</span>
          <span className="font-semibold text-gray-800">
            {language.confidence}%
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
            style={{ width: `${language.confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// POS TAGGING PANEL
// ============================================

function POSPanel({ pos }) {
  if (pos.tags.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="text-4xl">🔤</span>
        <p className="mt-2">Enter text to see POS tags</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🔤</span>
        <h3 className="text-lg font-semibold text-gray-800">Part of Speech</h3>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex flex-wrap gap-1">
          {pos.tags.map((tag, i) => (
            <div key={i} className="flex flex-col items-center">
              <span
                className={`px-2 py-1 rounded ${tag.bg} ${tag.text} text-sm font-medium`}
              >
                {tag.word}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">
                {tag.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(pos.distribution).map(([posType, data]) => (
          <div
            key={posType}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <span className="text-sm text-gray-600">{posType}</span>
            <span className="text-sm font-semibold text-gray-800">
              {data.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// NER PANEL
// ============================================

function NERPanel({ entities }) {
  if (entities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="text-4xl">🏷️</span>
        <p className="mt-2">No named entities detected</p>
        <p className="text-xs mt-1">
          Try adding names, places, or organizations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🏷️</span>
        <h3 className="text-lg font-semibold text-gray-800">Named Entities</h3>
      </div>

      <div className="space-y-2">
        {entities.map((entity, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
          >
            <span className="text-2xl">{entity.icon}</span>
            <div className="flex-1">
              <div className="font-medium text-gray-800">{entity.text}</div>
              <div className="text-xs text-gray-500">{entity.type}</div>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${entity.color}`}
            >
              {entity.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EMOTIONS PANEL
// ============================================

function EmotionsPanel({ emotions }) {
  if (!emotions.primary) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="text-4xl">🎭</span>
        <p className="mt-2">No strong emotions detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🎭</span>
        <h3 className="text-lg font-semibold text-gray-800">
          Emotion Analysis
        </h3>
      </div>

      {emotions.primary && (
        <div className={`p-6 rounded-xl ${emotions.primary.bg} text-center`}>
          <div className="text-5xl mb-2">{emotions.primary.emoji}</div>
          <div
            className={`text-xl font-bold capitalize ${emotions.primary.text}`}
          >
            {emotions.primary.emotion}
          </div>
          <div className="text-sm opacity-70">
            Primary Emotion ({emotions.primary.percent}%)
          </div>
        </div>
      )}

      <div className="space-y-2">
        {emotions.emotions
          .filter((e) => e.count > 0)
          .map((emotion, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg w-8">{emotion.emoji}</span>
              <span className="text-sm text-gray-600 w-24 capitalize">
                {emotion.emotion}
              </span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${emotion.bg.replace("100", "400")} rounded-full`}
                  style={{ width: `${emotion.percent}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-12 text-right">
                {emotion.percent}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

// ============================================
// WRITING STYLE PANEL
// ============================================

function WritingStylePanel({ style }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">✍️</span>
        <h3 className="text-lg font-semibold text-gray-800">Writing Style</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <div className="text-3xl font-bold text-gray-800">
            {style.formalityLabel}
          </div>
          <div className="text-xs text-gray-500 mt-1">Formality</div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${style.formality}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl text-center">
          <div className="text-3xl font-bold text-gray-800">
            {style.confidenceLabel}
          </div>
          <div className="text-xs text-gray-500 mt-1">Confidence</div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${style.confidence}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl text-center">
          <div className="text-sm font-semibold text-gray-800">
            {style.tone}
          </div>
          <div className="text-xs text-gray-500">Tone</div>
        </div>

        <div className="p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl text-center">
          <div className="text-sm font-semibold text-gray-800">
            {style.perspective}
          </div>
          <div className="text-xs text-gray-500">Perspective</div>
        </div>

        <div className="p-3 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl text-center">
          <div className="text-sm font-semibold text-gray-800">
            {style.voice.active}% Active
          </div>
          <div className="text-xs text-gray-500">Voice</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// WORD CLOUD PANEL
// ============================================

function WordCloudPanel({ words }) {
  if (words.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="text-4xl">☁️</span>
        <p className="mt-2">Enter more text to see word cloud</p>
      </div>
    );
  }

  const maxValue = Math.max(...words.map((w) => w.value));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">☁️</span>
        <h3 className="text-lg font-semibold text-gray-800">Word Cloud</h3>
      </div>

      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl min-h-[200px] flex flex-wrap items-center justify-center gap-2">
        {words.slice(0, 30).map((word, i) => {
          const size = 0.8 + (word.value / maxValue) * 1.5;
          const colors = [
            "text-blue-600",
            "text-purple-600",
            "text-green-600",
            "text-orange-600",
            "text-pink-600",
          ];
          return (
            <span
              key={i}
              className={`${colors[i % colors.length]} font-medium transition-transform hover:scale-110 cursor-default`}
              style={{ fontSize: `${size}rem` }}
              title={`${word.text}: ${word.value} occurrences`}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function NLPAnalysis({ text }) {
  const [activeTab, setActiveTab] = useState("stats");
  const [isPending, startTransition] = useTransition();
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Compute analyses with loading state
  useEffect(() => {
    if (!text || !text.trim()) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    
    // Use startTransition for non-urgent updates
    startTransition(() => {
      const result = {
        stats: getTextStatistics(text),
        sentiment: analyzeSentiment(text),
        readability: calculateReadability(text),
        keywords: extractKeywords(text),
        language: detectLanguage(text),
        pos: getPOSTags(text),
        entities: extractEntities(text),
        emotions: analyzeEmotions(text),
        style: analyzeWritingStyle(text),
        wordFreq: getWordFrequency(text),
      };
      setAnalysis(result);
      setIsAnalyzing(false);
    });
  }, [text]);

  if (!text || !text.trim()) {
    return (
      <div className="text-center py-12 text-gray-500" role="status" aria-live="polite">
        <span className="text-6xl" aria-hidden="true">📝</span>
        <p className="mt-4 text-lg">Enter text to see NLP analysis</p>
      </div>
    );
  }

  if (isAnalyzing || isPending || !analysis) {
    return <AnalysisLoadingState />;
  }

  const tabs = [
    { id: "stats", label: "Statistics", icon: "📊" },
    { id: "sentiment", label: "Sentiment", icon: "😊" },
    { id: "readability", label: "Readability", icon: "📖" },
    { id: "keywords", label: "Keywords", icon: "🔑" },
    { id: "language", label: "Language", icon: "🌍" },
    { id: "pos", label: "POS Tags", icon: "🔤" },
    { id: "ner", label: "Entities", icon: "🏷️" },
    { id: "emotions", label: "Emotions", icon: "🎭" },
    { id: "style", label: "Style", icon: "✍️" },
    { id: "wordcloud", label: "Word Cloud", icon: "☁️" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Tab Navigation */}
      <nav 
        className="flex overflow-x-auto border-b border-gray-200 bg-gray-50"
        role="tablist"
        aria-label="NLP Analysis tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => {
              const currentIndex = tabs.findIndex(t => t.id === activeTab);
              if (e.key === 'ArrowRight') {
                const nextIndex = (currentIndex + 1) % tabs.length;
                setActiveTab(tabs[nextIndex].id);
              } else if (e.key === 'ArrowLeft') {
                const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                setActiveTab(tabs[prevIndex].id);
              }
            }}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden sr-only">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div 
        className="p-6"
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
      >
        {activeTab === "stats" && (
          <TextStatisticsPanel stats={analysis.stats} />
        )}
        {activeTab === "sentiment" && (
          <SentimentPanel sentiment={analysis.sentiment} />
        )}
        {activeTab === "readability" && (
          <ReadabilityPanel readability={analysis.readability} />
        )}
        {activeTab === "keywords" && (
          <KeywordsPanel keywords={analysis.keywords} />
        )}
        {activeTab === "language" && (
          <LanguagePanel language={analysis.language} />
        )}
        {activeTab === "pos" && <POSPanel pos={analysis.pos} />}
        {activeTab === "ner" && <NERPanel entities={analysis.entities} />}
        {activeTab === "emotions" && (
          <EmotionsPanel emotions={analysis.emotions} />
        )}
        {activeTab === "style" && <WritingStylePanel style={analysis.style} />}
        {activeTab === "wordcloud" && (
          <WordCloudPanel words={analysis.wordFreq} />
        )}
      </div>
    </div>
  );
}

export default NLPAnalysis;
