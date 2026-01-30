import { useState, useEffect, useRef, useCallback } from 'react';

const THRESHOLD = 0.5;
const LABELS = [
  'toxicity',
  'severe_toxicity', 
  'identity_attack',
  'insult',
  'threat',
  'obscene',
  'sexual_explicit'
];

/**
 * Custom hook for TensorFlow.js toxicity model
 */
export function useToxicity() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const modelRef = useRef(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if toxicity model is available globally
      if (typeof window.toxicity !== 'undefined') {
        modelRef.current = await window.toxicity.load(THRESHOLD, LABELS);
        setReady(true);
        console.log('✅ Toxicity model loaded successfully');
      } else {
        throw new Error('TensorFlow.js toxicity model not found');
      }
    } catch (err) {
      console.error('❌ Error loading toxicity model:', err);
      setError(err.message);
      setReady(false);
    } finally {
      setLoading(false);
    }
  };

  const analyze = useCallback(async (text) => {
    if (!modelRef.current || !text?.trim()) {
      return null;
    }

    try {
      const predictions = await modelRef.current.classify([text]);
      return predictions.map(pred => ({
        label: pred.label,
        match: pred.results[0]?.match || false,
        probabilities: pred.results[0]?.probabilities || [0, 0]
      }));
    } catch (err) {
      console.error('Error analyzing text:', err);
      throw err;
    }
  }, []);

  const getModel = useCallback(() => modelRef.current, []);

  return {
    analyze,
    getModel,
    loading,
    error,
    ready,
    reload: loadModel
  };
}

export default useToxicity;
