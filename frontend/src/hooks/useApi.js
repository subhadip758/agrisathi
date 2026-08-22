import { useState, useCallback } from 'react';

/**
 * Custom hook for making API calls with loading and error states
 * @returns {Object} API call utilities
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Execute an API call
   * @param {Function} apiFunction - The API function to execute
   * @param {Object} params - Parameters to pass to the API function
   */
  const execute = useCallback(async (apiFunction, params) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(params);
      
      setData(result);
      setLoading(false);
      
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
  };
};