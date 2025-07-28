import React from 'react';
import useQuote from '../hooks/useQuote';

const QuoteDisplay = () => {
  const { quote, fetchQuote } = useQuote();

  return (
    <div className="quote-display">
      <h1>A piece of wisdom</h1>
      <blockquote>
        "{quote.text}"<footer> - {quote.author}</footer>
      </blockquote>
      <button onClick={fetchQuote}>Get New Quote</button>
    </div>
  );
};

export default QuoteDisplay;
