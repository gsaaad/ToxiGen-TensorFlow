/**
 * Statistics card component for dataset insights
 */
export function StatCard({ title, value, subtitle, icon, color = 'blue', trend }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{trend > 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white text-xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/**
 * Category breakdown bar component
 */
export function CategoryBar({ name, count, percentage, color }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{count.toLocaleString()}</span>
          <span className="text-sm font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Pie chart visualization (CSS-based)
 */
export function PieChart({ toxic, nonToxic }) {
  const toxicAngle = (toxic / 100) * 360;
  
  return (
    <div className="relative w-48 h-48 mx-auto">
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `conic-gradient(
            #ef4444 0deg ${toxicAngle}deg,
            #22c55e ${toxicAngle}deg 360deg
          )`
        }}
      />
      <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{toxic}%</p>
          <p className="text-xs text-gray-500">Toxic</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Mini bar chart for quick stats
 */
export function MiniBarChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:from-blue-600 hover:to-blue-500"
          style={{ height: `${(item.value / maxValue) * 100}%` }}
          title={`${item.label}: ${item.value}`}
        />
      ))}
    </div>
  );
}

export default StatCard;
