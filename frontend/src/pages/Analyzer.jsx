import { useState, useCallback } from 'react';
import { useToxicity } from '../hooks/useToxicity';
import { useWordImportance } from '../hooks/useWordImportance';
import { ToxicityMeter } from '../components/ToxicityMeter';
import { WordImportance } from '../components/WordImportance';
import { NLPAnalysis } from '../components/NLPAnalysis';
import { Alert, Badge, Card, CardBody, LoadingSpinner } from '../components/UI';
import { formatPredictions } from '../utils/toxicity';

function Analyzer() {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  
  const { analyze, getModel, loading: modelLoading, error: modelError, ready } = useToxicity();
  const { importance, analyzing: analyzingImportance, analyze: analyzeImportance, clear: clearImportance } = useWordImportance();

  const analyzeText = useCallback(async () => {
    if (!text.trim() || !ready) return;
    
    setAnalyzing(true);
    setResults(null);
    setShowExplain(false);
    clearImportance();
    
    try {
      const predictions = await analyze(text);
      if (predictions) {
        setResults(formatPredictions(predictions));
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  }, [text, ready, analyze, clearImportance]);

  const handleExplain = useCallback(async () => {
    const model = getModel();
    if (!model || !text.trim()) return;
    
    setShowExplain(true);
    await analyzeImportance(model, text);
  }, [getModel, text, analyzeImportance]);

  const handleSampleClick = (sample) => {
    setText(sample);
    setResults(null);
    setShowExplain(false);
    clearImportance();
  };

  const handleClear = () => {
    setText('');
    setResults(null);
    setShowExplain(false);
    clearImportance();
  };

  // Check if any category is flagged as toxic
  const hasToxicity = results?.some(r => r.match);
  const toxicCount = results?.filter(r => r.match).length || 0;

  const sampleTexts = [
    { text: "I really enjoyed reading your article. Great work!", emoji: "😊" },
    { text: "You're such a worthless idiot who can't do anything right.", emoji: "😠" },
    { text: "I disagree with your opinion but respect your perspective.", emoji: "🤝" },
    { text: "The weather today is quite pleasant for a walk.", emoji: "☀️" },
    { text: "People like you should be eliminated from society.", emoji: "⚠️" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          🔬 Text Toxicity Analyzer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Analyze any text for toxicity across 7 categories using TensorFlow.js — 
          all processing happens locally in your browser.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <Badge variant="success">🔒 Privacy-First</Badge>
          <Badge variant="primary">⚡ Real-Time</Badge>
          <Badge variant="default">🧠 AI-Powered</Badge>
        </div>
      </div>

      {/* Model Status */}
      {modelLoading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardBody className="flex items-center gap-4">
            <LoadingSpinner size="sm" />
            <div>
              <p className="font-semibold text-blue-800">Loading TensorFlow.js Model</p>
              <p className="text-sm text-blue-600">This may take a few seconds on first load...</p>
            </div>
          </CardBody>
        </Card>
      )}

      {modelError && (
        <Alert 
          type="error" 
          title="Model Error" 
          message={modelError}
        />
      )}

      {ready && !modelLoading && (
        <Alert 
          type="success" 
          title="Model Ready" 
          message="TensorFlow.js toxicity model loaded successfully. All analysis runs locally in your browser."
        />
      )}

      {/* Input Section */}
      <Card hover>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Enter Text to Analyze
            </label>
            <span className="text-xs text-gray-400">
              {text.length} characters
            </span>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste any text here to analyze its toxicity..."
            rows={5}
            disabled={modelLoading || !ready}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-800 placeholder-gray-400"
          />
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={analyzeText}
              disabled={!text.trim() || analyzing || !ready}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 flex items-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Analyze Text
                </>
              )}
            </button>
            
            {results && (
              <button
                onClick={handleExplain}
                disabled={analyzingImportance}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 flex items-center gap-2"
              >
                {analyzingImportance ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Explaining...
                  </>
                ) : (
                  <>
                    <span>💡</span>
                    Explain Results
                  </>
                )}
              </button>
            )}
            
            {text && (
              <button
                onClick={handleClear}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Sample Texts */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>📝</span>
          Try these samples:
        </h3>
        <div className="flex flex-wrap gap-2">
          {sampleTexts.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSampleClick(sample.text)}
              disabled={!ready}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              <span>{sample.emoji}</span>
              <span className="max-w-[200px] truncate">{sample.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <Card className="overflow-hidden">
          {/* Results Header */}
          <div className={`px-6 py-4 ${hasToxicity ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{hasToxicity ? '⚠️' : '✅'}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {hasToxicity ? 'Toxicity Detected' : 'No Toxicity Detected'}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {hasToxicity 
                      ? `${toxicCount} categor${toxicCount > 1 ? 'ies' : 'y'} flagged as toxic`
                      : 'Text appears to be non-toxic across all categories'
                    }
                  </p>
                </div>
              </div>
              {hasToxicity && (
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="text-white font-bold text-2xl">{toxicCount}/7</span>
                </div>
              )}
            </div>
          </div>

          {/* Category Results */}
          <CardBody className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Category Breakdown
            </h3>
            <div className="grid gap-4">
              {results
                .sort((a, b) => b.probability - a.probability)
                .map((result, idx) => (
                  <ToxicityMeter
                    key={idx}
                    label={result.label}
                    probability={result.probability}
                    match={result.match}
                  />
                ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Word Importance Section */}
      {showExplain && (
        <WordImportance 
          importance={importance} 
          analyzing={analyzingImportance} 
        />
      )}

      {/* NLP Analysis Section */}
      {text.trim().length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <h2 className="text-xl font-bold text-gray-800">Advanced NLP Analysis</h2>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              10 Analyses
            </span>
          </div>
          <NLPAnalysis text={text} />
        </div>
      )}

      {/* Info Section */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
        <CardBody>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-2xl flex-shrink-0">
              ℹ️
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">How It Works</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Uses TensorFlow.js toxicity model running entirely in your browser</li>
                <li>• Analyzes text across 7 categories: toxicity, insult, threat, identity attack, obscene, severe toxicity, and sexual explicit</li>
                <li>• "Explain Results" shows which words contribute most to the toxicity score (SHAP-style analysis)</li>
                <li>• Your text never leaves your device — complete privacy</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Analyzer;
