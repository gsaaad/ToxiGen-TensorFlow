import { getImportanceColor, getTopWords } from "../utils/toxicity";

/**
 * SHAP-style word importance visualization
 */
export function WordImportance({ importance, analyzing }) {
  if (analyzing) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">🔍</span>
          Analyzing Word Importance
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-500 text-sm">
              Calculating word contributions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!importance || importance.length === 0) {
    return null;
  }

  const topWords = getTopWords(importance, 5);
  const hasSignificantWords = topWords.some((w) => w.score > 0.05);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-xl">🔍</span>
          Word Importance Analysis
          <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">
            SHAP-style
          </span>
        </h3>
        <p className="text-purple-100 text-sm mt-1">
          See which words contribute most to the toxicity score
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Highlighted Text */}
        <div>
          <label className="text-sm font-medium text-gray-500 mb-2 block">
            Text with Highlighted Words
          </label>
          <div className="flex flex-wrap gap-1.5 p-4 bg-gray-50 rounded-xl border border-gray-200">
            {importance.map((item, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-all hover:scale-105 cursor-default ${getImportanceColor(item.score)}`}
                title={`Impact: ${(item.score * 100).toFixed(1)}%`}
              >
                {item.word}
              </span>
            ))}
          </div>
        </div>

        {/* Top Contributing Words */}
        {hasSignificantWords && (
          <div>
            <label className="text-sm font-medium text-gray-500 mb-3 block">
              Top Contributing Words
            </label>
            <div className="space-y-2">
              {topWords
                .filter((w) => w.score > 0)
                .map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-gray-800 w-24 truncate">
                      "{item.word}"
                    </span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.score > 0.3
                            ? "bg-red-500"
                            : item.score > 0.15
                              ? "bg-orange-500"
                              : "bg-yellow-500"
                        }`}
                        style={{ width: `${Math.min(item.score * 100, 100)}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-bold w-16 text-right ${
                        item.score > 0.3
                          ? "text-red-600"
                          : item.score > 0.15
                            ? "text-orange-600"
                            : "text-yellow-600"
                      }`}
                    >
                      +{(item.score * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="pt-4 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-500 mb-2 block">
            Color Legend
          </label>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-red-500"></span>
              <span className="text-gray-600">High Impact</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-orange-300"></span>
              <span className="text-gray-600">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></span>
              <span className="text-gray-600">Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></span>
              <span className="text-gray-600">Neutral</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-green-200"></span>
              <span className="text-gray-600">Reduces Toxicity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordImportance;
