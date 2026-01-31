/**
 * Compare Page
 * Compare two texts side-by-side for toxicity and NLP analysis
 */

import { useCallback, useMemo, useState } from "react";
import { ToxicityMeter } from "../components/ToxicityMeter";
import { useToxicity } from "../hooks/useToxicity";
import {
  analyzeSentiment,
  calculateReadability,
  compareTexts,
  getTextStatistics,
} from "../utils/nlp";
import { formatPredictions } from "../utils/toxicity";

function CompareCard({
  title,
  color,
  text,
  setText,
  results,
  analyzing,
  onAnalyze,
  disabled,
}) {
  const stats = useMemo(() => (text ? getTextStatistics(text) : null), [text]);
  const sentiment = useMemo(
    () => (text ? analyzeSentiment(text) : null),
    [text],
  );
  const readability = useMemo(
    () => (text ? calculateReadability(text) : null),
    [text],
  );

  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      light: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      light: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
    },
  };

  const c = colorClasses[color];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className={`px-6 py-4 bg-gradient-to-r ${c.gradient} text-white`}>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>

      <div className="p-6 space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to compare..."
          rows={4}
          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:${c.border} focus:ring-4 focus:ring-${color}-100 resize-none transition-all`}
        />

        <button
          onClick={onAnalyze}
          disabled={!text?.trim() || disabled || analyzing}
          className={`w-full px-6 py-2.5 bg-gradient-to-r ${c.gradient} text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2`}
        >
          {analyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <span>🔍</span>
              Analyze
            </>
          )}
        </button>

        {/* Quick Stats */}
        {stats && stats.words > 0 && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className={`p-2 ${c.light} rounded-lg`}>
              <div className="text-lg font-bold text-gray-800">
                {stats.words}
              </div>
              <div className="text-xs text-gray-500">Words</div>
            </div>
            <div className={`p-2 ${c.light} rounded-lg`}>
              <div className="text-lg font-bold text-gray-800">
                {sentiment?.emoji}
              </div>
              <div className="text-xs text-gray-500">{sentiment?.label}</div>
            </div>
            <div className={`p-2 ${c.light} rounded-lg`}>
              <div className="text-lg font-bold text-gray-800">
                {readability?.gradeLevel?.split(" ")[0]}
              </div>
              <div className="text-xs text-gray-500">Level</div>
            </div>
          </div>
        )}

        {/* Toxicity Results */}
        {results && (
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700">
              Toxicity Results
            </h4>
            {results
              .sort((a, b) => b.probability - a.probability)
              .slice(0, 4)
              .map((result, idx) => (
                <ToxicityMeter
                  key={idx}
                  label={result.label}
                  probability={result.probability}
                  match={result.match}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Compare() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [resultsA, setResultsA] = useState(null);
  const [resultsB, setResultsB] = useState(null);
  const [analyzingA, setAnalyzingA] = useState(false);
  const [analyzingB, setAnalyzingB] = useState(false);

  const { analyze, ready, loading: modelLoading } = useToxicity();

  // Calculate similarity
  const similarity = useMemo(() => {
    if (!textA?.trim() || !textB?.trim()) return null;
    return compareTexts(textA, textB);
  }, [textA, textB]);

  // Calculate max toxicity for each
  const maxToxicityA = useMemo(() => {
    if (!resultsA) return 0;
    return Math.max(...resultsA.map((r) => r.probability));
  }, [resultsA]);

  const maxToxicityB = useMemo(() => {
    if (!resultsB) return 0;
    return Math.max(...resultsB.map((r) => r.probability));
  }, [resultsB]);

  const analyzeA = useCallback(async () => {
    if (!textA.trim() || !ready) return;
    setAnalyzingA(true);
    try {
      const predictions = await analyze(textA);
      if (predictions) setResultsA(formatPredictions(predictions));
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setAnalyzingA(false);
    }
  }, [textA, ready, analyze]);

  const analyzeB = useCallback(async () => {
    if (!textB.trim() || !ready) return;
    setAnalyzingB(true);
    try {
      const predictions = await analyze(textB);
      if (predictions) setResultsB(formatPredictions(predictions));
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setAnalyzingB(false);
    }
  }, [textB, ready, analyze]);

  const analyzeBoth = useCallback(async () => {
    await Promise.all([analyzeA(), analyzeB()]);
  }, [analyzeA, analyzeB]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl">⚖️</span>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Text Comparison
          </h1>
        </div>
        <p className="text-gray-600">
          Compare two texts side-by-side for toxicity and NLP analysis
        </p>
      </div>

      {/* Model Status */}
      {modelLoading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Loading toxicity model...
          </div>
        </div>
      )}

      {/* Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <CompareCard
          title="Text A"
          color="blue"
          text={textA}
          setText={setTextA}
          results={resultsA}
          analyzing={analyzingA}
          onAnalyze={analyzeA}
          disabled={!ready || modelLoading}
        />
        <CompareCard
          title="Text B"
          color="purple"
          text={textB}
          setText={setTextB}
          results={resultsB}
          analyzing={analyzingB}
          onAnalyze={analyzeB}
          disabled={!ready || modelLoading}
        />
      </div>

      {/* Compare Both Button */}
      {textA.trim() && textB.trim() && (
        <div className="text-center">
          <button
            onClick={analyzeBoth}
            disabled={!ready || analyzingA || analyzingB}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            ⚖️ Analyze Both Texts
          </button>
        </div>
      )}

      {/* Comparison Results */}
      {(resultsA || resultsB || similarity) && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📊</span>
            Comparison Results
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Text A Summary */}
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <div className="text-sm text-blue-600 mb-1">
                Text A Max Toxicity
              </div>
              <div className="text-3xl font-bold text-blue-700">
                {(maxToxicityA * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {maxToxicityA > 0.5 ? "⚠️ Toxic" : "✅ Safe"}
              </div>
            </div>

            {/* Similarity */}
            {similarity && (
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl text-center">
                <div className="text-sm text-gray-600 mb-1">Similarity</div>
                <div className="text-3xl font-bold text-gray-800">
                  {similarity.similarity}%
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {similarity.label}
                </div>
              </div>
            )}

            {/* Text B Summary */}
            <div className="p-4 bg-purple-50 rounded-xl text-center">
              <div className="text-sm text-purple-600 mb-1">
                Text B Max Toxicity
              </div>
              <div className="text-3xl font-bold text-purple-700">
                {(maxToxicityB * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {maxToxicityB > 0.5 ? "⚠️ Toxic" : "✅ Safe"}
              </div>
            </div>
          </div>

          {/* Winner/Summary */}
          {resultsA && resultsB && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-center">
              {maxToxicityA > maxToxicityB ? (
                <p className="text-gray-700">
                  <span className="font-semibold text-purple-700">Text B</span>{" "}
                  is
                  <span className="font-semibold text-green-600">
                    {" "}
                    {((maxToxicityA - maxToxicityB) * 100).toFixed(1)}% less
                    toxic
                  </span>{" "}
                  than Text A
                </p>
              ) : maxToxicityB > maxToxicityA ? (
                <p className="text-gray-700">
                  <span className="font-semibold text-blue-700">Text A</span> is
                  <span className="font-semibold text-green-600">
                    {" "}
                    {((maxToxicityB - maxToxicityA) * 100).toFixed(1)}% less
                    toxic
                  </span>{" "}
                  than Text B
                </p>
              ) : (
                <p className="text-gray-700">
                  Both texts have{" "}
                  <span className="font-semibold">similar toxicity levels</span>
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sample Pairs */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>💡</span>
          Try these comparison pairs:
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setTextA("You're such an idiot, can't you do anything right?");
              setTextB(
                "I think there might be some room for improvement here.",
              );
              setResultsA(null);
              setResultsB(null);
            }}
            className="p-4 bg-white rounded-xl text-left hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="text-sm font-medium text-gray-800 mb-2">
              Toxic vs Constructive
            </div>
            <div className="text-xs text-gray-500">
              Compare aggressive feedback with constructive criticism
            </div>
          </button>

          <button
            onClick={() => {
              setTextA(
                "This product is absolutely terrible, worst thing I've ever bought!",
              );
              setTextB(
                "This product didn't meet my expectations. Here's why...",
              );
              setResultsA(null);
              setResultsB(null);
            }}
            className="p-4 bg-white rounded-xl text-left hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="text-sm font-medium text-gray-800 mb-2">
              Negative Review Styles
            </div>
            <div className="text-xs text-gray-500">
              Compare emotional vs factual negative feedback
            </div>
          </button>

          <button
            onClick={() => {
              setTextA("I hate everything about this, it's disgusting!");
              setTextB(
                "I have several concerns about this that I'd like to discuss.",
              );
              setResultsA(null);
              setResultsB(null);
            }}
            className="p-4 bg-white rounded-xl text-left hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="text-sm font-medium text-gray-800 mb-2">
              Emotional vs Professional
            </div>
            <div className="text-xs text-gray-500">
              See how phrasing affects toxicity scores
            </div>
          </button>

          <button
            onClick={() => {
              setTextA(
                "Your work is amazing! You're so talented and creative.",
              );
              setTextB("Your work shows promise. Keep developing your skills.");
              setResultsA(null);
              setResultsB(null);
            }}
            className="p-4 bg-white rounded-xl text-left hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="text-sm font-medium text-gray-800 mb-2">
              Positive Feedback Styles
            </div>
            <div className="text-xs text-gray-500">
              Compare enthusiastic vs measured positive feedback
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Compare;
