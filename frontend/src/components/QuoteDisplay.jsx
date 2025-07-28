import React from 'react';
import useQuote from '../hooks/useQuote';

const QuoteDisplay = () => {
  const { quote, fetchQuote, isLoading, error } = useQuote();

  return (
    <div className="quote-display">
      <h1>A piece of wisdom</h1>
      <blockquote>
        "{quote.text}"<footer> - {quote.author}</footer>
      </blockquote>
      {error && <p>{error}</p>}
      <button onClick={fetchQuote} disabled={isLoading}>
        Get New Quote
      </button>
    </div>
  );
};

export default QuoteDisplay;
