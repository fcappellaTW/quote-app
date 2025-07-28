import React from 'react';
import './App.css';
import QuoteDisplay from './components/QuoteDisplay';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggleButton from './components/ThemeToggleButton';

function App() {
  return (
    <ThemeProvider>
      <div className="App" data-testid="app">
        <ThemeToggleButton />
        <header className="App-header" data-testid="app-header">
          <QuoteDisplay />
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
