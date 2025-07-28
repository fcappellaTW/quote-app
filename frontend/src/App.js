import React, { useState } from 'react';
import './App.css';
import QuoteDisplay from './components/QuoteDisplay';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <QuoteDisplay />
      </header>
    </div>
  );
}

export default App;
