/**
 * Loading spinner component
 */
export function LoadingSpinner({ size = 'md', text }) {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
}

/**
 * Empty state component
 */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {action}
    </div>
  );
}

/**
 * Alert/notification component
 */
export function Alert({ type = 'info', title, message, onClose }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className={`${styles[type]} border rounded-xl p-4 flex items-start gap-3`}>
      <span className="text-lg">{icons[type]}</span>
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="opacity-50 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Badge component
 */
export function Badge({ children, variant = 'default', size = 'md' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span className={`${variants[variant]} ${sizes[size]} font-medium rounded-full inline-flex items-center`}>
      {children}
    </span>
  );
}

/**
 * Card component
 */
export function Card({ children, className = '', hover = false }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${hover ? 'hover:shadow-xl transition-shadow' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
