import React from 'react';
import useQuote from '../hooks/useQuote';
import QuoteDisclaimer from './QuoteDisclaimer';

const QuoteDisplay = () => {
  const { quote, fetchQuote, isLoading } = useQuote();

  return (
    <>
      <div className="quote-display">
        <h1>A piece of wisdom</h1>
        <blockquote>
          "{quote.text}"<footer> - {quote.author}</footer>
        </blockquote>
        <button onClick={fetchQuote} disabled={isLoading}>
          Get New Quote
        </button>
      </div>
      <QuoteDisclaimer isVisible={quote.is_ai_generated} />
    </>
  );
};

export default QuoteDisplay;
