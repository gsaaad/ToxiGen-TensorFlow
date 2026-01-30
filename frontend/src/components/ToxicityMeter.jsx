import { getScoreColor, getScoreLabel, formatLabel } from '../utils/toxicity';

/**
 * Visual toxicity meter component
 */
export function ToxicityMeter({ label, probability, match }) {
  const percentage = (probability * 100).toFixed(1);
  const colors = getScoreColor(probability);
  const safetyLabel = getScoreLabel(probability);
  
  return (
    <div className="group relative">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {formatLabel(label)}
          </span>
          {match && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full animate-pulse">
              TOXIC
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${colors.text}`}>
            {percentage}%
          </span>
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${safetyLabel.bg} ${safetyLabel.color}`}>
            {safetyLabel.icon} {safetyLabel.text}
          </span>
        </div>
      </div>
      
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`absolute inset-y-0 left-0 ${colors.bg} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.max(percentage, 2)}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        {match ? 'Flagged as toxic' : `${safetyLabel.text} - Below threshold`}
      </div>
    </div>
  );
}

export default ToxicityMeter;
