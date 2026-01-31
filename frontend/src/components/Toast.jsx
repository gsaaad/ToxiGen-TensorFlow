/**
 * Toast Notification System
 * Provides feedback for user actions (success, error, warning, info)
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

// Toast Context
const ToastContext = createContext(null)

// Toast types configuration
const TOAST_TYPES = {
  success: {
    icon: '✅',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    progressColor: 'bg-green-500',
  },
  error: {
    icon: '❌',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    progressColor: 'bg-red-500',
  },
  warning: {
    icon: '⚠️',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    progressColor: 'bg-yellow-500',
  },
  info: {
    icon: 'ℹ️',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    progressColor: 'bg-blue-500',
  },
}

// Individual Toast Component
function Toast({ id, type, title, message, duration, onClose }) {
  const config = TOAST_TYPES[type] || TOAST_TYPES.info
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100))
          return newProgress <= 0 ? 0 : newProgress
        })
      }, 100)

      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => onClose(id), 200)
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        border rounded-xl shadow-lg overflow-hidden
        transform transition-all duration-200 ease-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
        max-w-sm w-full
      `}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Icon */}
        <span className="text-xl flex-shrink-0" aria-hidden="true">
          {config.icon}
        </span>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-sm">{title}</p>
          )}
          <p className="text-sm opacity-90">{message}</p>
        </div>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-current"
          aria-label="Dismiss notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress Bar */}
      {duration > 0 && (
        <div className="h-1 bg-black/5">
          <div
            className={`h-full ${config.progressColor} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

// Toast Container Component
function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-3"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}

// Toast Provider Component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, type, title, message, duration }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods
  const success = useCallback((message, title) => addToast({ type: 'success', title, message }), [addToast])
  const error = useCallback((message, title) => addToast({ type: 'error', title, message, duration: 7000 }), [addToast])
  const warning = useCallback((message, title) => addToast({ type: 'warning', title, message }), [addToast])
  const info = useCallback((message, title) => addToast({ type: 'info', title, message }), [addToast])

  const value = {
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default ToastProvider
