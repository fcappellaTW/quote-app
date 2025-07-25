import React, { useState } from 'react';
import './App.css';

function App() {
  const [quote, setQuote] = useState({
    text: 'Click the button to get a random quote',
    author: 'Dev',
  });

  const fetchQuote = async () => {
    try {
      const apiURL = process.env.PYTHON_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiURL}/api/quote`);
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote({ text: 'Could not connect to the API.', author: 'Error' });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quote of the Day</h1>
        <blockquote>
          "{quote.text}"<footer> - {quote.author}</footer>
        </blockquote>
        <button onClick={fetchQuote}>Get New Quote</button>
      </header>
    </div>
  );
}

export default App;
