import { useEffect, useRef, useState } from "react";

function Analyzer() {
  const [text, setText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);
  const modelRef = useRef(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setModelLoading(true);
      setModelError(null);

      // Check if toxicity model is available globally (loaded via CDN)
      if (typeof window.toxicity !== "undefined") {
        const threshold = 0.5;
        modelRef.current = await window.toxicity.load(threshold);
        console.log("Toxicity model loaded successfully");
      } else {
        throw new Error("Toxicity model not found. Please refresh the page.");
      }
    } catch (err) {
      console.error("Error loading model:", err);
      setModelError(err.message);
    } finally {
      setModelLoading(false);
    }
  };

  const analyzeText = async () => {
    if (!text.trim() || !modelRef.current) return;

    setLoading(true);
    setResults(null);

    try {
      const predictions = await modelRef.current.classify([text]);

      const formattedResults = predictions.map((prediction) => ({
        label: prediction.label,
        match: prediction.results[0].match,
        probabilities: {
          toxic: (prediction.results[0].probabilities[1] * 100).toFixed(1),
          nonToxic: (prediction.results[0].probabilities[0] * 100).toFixed(1),
        },
      }));

      setResults(formattedResults);
    } catch (err) {
      console.error("Error analyzing text:", err);
      setModelError("Error analyzing text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 70) return "text-red-600 bg-red-100";
    if (numScore >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getProgressColor = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 70) return "bg-red-500";
    if (numScore >= 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getLabelDisplayName = (label) => {
    const names = {
      identity_attack: "Identity Attack",
      insult: "Insult",
      obscene: "Obscene",
      severe_toxicity: "Severe Toxicity",
      sexual_explicit: "Sexual Explicit",
      threat: "Threat",
      toxicity: "General Toxicity",
    };
    return names[label] || label;
  };

  const sampleTexts = [
    "I really enjoyed reading your article. Great work!",
    "This movie was absolutely terrible and a waste of time.",
    "I disagree with your opinion but respect your perspective.",
    "The weather today is quite pleasant for a walk.",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Text Toxicity Analyzer
        </h1>
        <p className="text-gray-600">
          Enter any text to analyze its toxicity score across multiple
          categories.
        </p>
      </div>

      {/* Model Status */}
      {modelLoading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="animate-spin mr-3 h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span>
              Loading TensorFlow.js toxicity model... This may take a moment.
            </span>
          </div>
        </div>
      )}

      {modelError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">⚠️ {modelError}</p>
          <button
            onClick={loadModel}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try loading again
          </button>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Text to Analyze
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={modelLoading}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">{text.length} characters</div>
          <button
            onClick={analyzeText}
            disabled={!text.trim() || loading || modelLoading || !!modelError}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Analyzing...
              </>
            ) : (
              "Analyze Text"
            )}
          </button>
        </div>
      </div>

      {/* Sample Texts */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Try sample texts:
        </h3>
        <div className="flex flex-wrap gap-2">
          {sampleTexts.map((sample, index) => (
            <button
              key={index}
              onClick={() => setText(sample)}
              disabled={modelLoading}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {sample.slice(0, 40)}...
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Analysis Results
          </h2>

          {/* Overall Summary */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {results.filter((r) => r.match === true).length > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <p className="font-semibold text-red-800">
                      Toxicity Detected
                    </p>
                    <p className="text-sm text-red-600">
                      {results.filter((r) => r.match === true).length}{" "}
                      categories flagged
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <p className="font-semibold text-green-800">
                      No Toxicity Detected
                    </p>
                    <p className="text-sm text-green-600">
                      Text appears to be non-toxic
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Scores */}
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">
                      {getLabelDisplayName(result.label)}
                    </span>
                    {result.match && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                        Flagged
                      </span>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.probabilities.toxic)}`}
                  >
                    {result.probabilities.toxic}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getProgressColor(result.probabilities.toxic)}`}
                    style={{ width: `${result.probabilities.toxic}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Analyzer;
