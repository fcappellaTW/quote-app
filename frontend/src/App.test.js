import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/QuoteDisplay', () => {
  return function MockQuoteDisplay() {
    return <div data-testid="quote-display">Quote Display Component</div>;
  };
});

describe('App', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('quote-display')).toBeDefined();
  });

  test('renders with correct structure', () => {
    render(<App />);
    expect(screen.getByTestId('app')).toBeDefined();
    expect(screen.getByTestId('app-header')).toBeDefined();
  });
});
