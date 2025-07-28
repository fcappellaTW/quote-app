import { useState, useCallback } from 'react';

const useQuote = () => {
  const [quote, setQuote] = useState({
    text: 'Click the button to get a random quote',
    author: 'Dev',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuote = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiURL = process.env.PYTHON_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiURL}/api/quote`);
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote({ text: 'Could not connect to the API.', author: 'Error' });
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { quote, fetchQuote, isLoading, error };
};

export default useQuote;
