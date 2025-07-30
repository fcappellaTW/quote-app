import React from 'react';
import './App.css';
import QuoteDisplay from './components/QuoteDisplay';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggleButton from './components/ThemeToggleButton';
import { Toaster } from 'react-hot-toast';
import { toastOptions } from './config/toastConfig';

function App() {
  return (
    <ThemeProvider>
      <div className="App" data-testid="app">
        <ThemeToggleButton />
        <header className="App-header" data-testid="app-header">
          <QuoteDisplay />
          <Toaster position="top-left" toastOptions={toastOptions} />
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
