import { useState, useCallback } from 'react';
import { calculateWordImportance } from '../utils/toxicity';

/**
 * Custom hook for SHAP-style word importance analysis
 */
export function useWordImportance() {
  const [importance, setImportance] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (model, text) => {
    if (!model || !text?.trim()) {
      setImportance([]);
      return [];
    }

    try {
      setAnalyzing(true);
      setError(null);
      
      const results = await calculateWordImportance(model, text);
      setImportance(results);
      return results;
    } catch (err) {
      console.error('Error calculating word importance:', err);
      setError(err.message);
      return [];
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const clear = useCallback(() => {
    setImportance([]);
    setError(null);
  }, []);

  return {
    importance,
    analyzing,
    error,
    analyze,
    clear
  };
}

export default useWordImportance;
