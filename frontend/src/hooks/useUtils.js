/**
 * Custom Hooks for common utilities
 */

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Debounce hook - delays updating value until after delay
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * Async operation hook with loading, error, and result states
 * @param {Function} asyncFn - Async function to execute
 */
export function useAsync(asyncFn, immediate = false) {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
  })

  const execute = useCallback(async (...args) => {
    setState({ loading: true, error: null, data: null })
    try {
      const result = await asyncFn(...args)
      setState({ loading: false, error: null, data: result })
      return result
    } catch (err) {
      setState({ loading: false, error: err.message || 'An error occurred', data: null })
      throw err
    }
  }, [asyncFn])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  return { ...state, execute }
}

/**
 * Previous value hook - tracks the previous value of a state
 * @param {any} value - Value to track
 */
export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

/**
 * Local storage hook with JSON serialization
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value if not in storage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

/**
 * Keyboard shortcut hook
 * @param {Object} shortcuts - Object mapping key combinations to handlers
 */
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = []
      if (e.ctrlKey || e.metaKey) key.push('ctrl')
      if (e.shiftKey) key.push('shift')
      if (e.altKey) key.push('alt')
      key.push(e.key.toLowerCase())
      
      const combo = key.join('+')
      if (shortcuts[combo]) {
        e.preventDefault()
        shortcuts[combo](e)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

/**
 * Media query hook
 * @param {string} query - CSS media query
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * Intersection observer hook for visibility detection
 * @param {Object} options - IntersectionObserver options
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
      setEntry(entry)
    }, options)

    observer.observe(element)
    return () => observer.disconnect()
  }, [options.threshold, options.root, options.rootMargin])

  return { ref, isIntersecting, entry }
}

/**
 * Focus trap hook for modals/dialogs
 * @param {boolean} isActive - Whether the focus trap is active
 */
export function useFocusTrap(isActive) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [isActive])

  return containerRef
}
