import React from 'react';
import './App.css';
import QuoteDisplay from './components/QuoteDisplay';

function App() {
  return (
    <div className="App" data-testid="app">
      <header className="App-header" data-testid="app-header">
        <QuoteDisplay />
      </header>
    </div>
  );
}

export default App;
