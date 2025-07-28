import { render, screen, fireEvent } from '@testing-library/react';
import QuoteDisplay from '../QuoteDisplay';

jest.mock('../../hooks/useQuote');

const mockUseQuote = require('../../hooks/useQuote').default;

describe('QuoteDisplay', () => {
  const mockFetchQuote = jest.fn();

  beforeEach(() => {
    mockUseQuote.mockReturnValue({
      quote: {
        text: 'Click the button to get a random quote',
        author: 'Dev',
      },
      isLoading: false,
      error: null,
      fetchQuote: mockFetchQuote,
    });
  });

  test('renders initial state correctly', () => {
    render(<QuoteDisplay />);

    expect(screen.getByText(/A piece of wisdom/i)).toBeDefined();
    expect(
      screen.getByText(/Click the button to get a random quote/i),
    ).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Get New Quote/i }),
    ).toBeDefined();
  });

  test('calls fetchQuote when button is clicked', () => {
    render(<QuoteDisplay />);

    fireEvent.click(screen.getByRole('button', { name: /Get New Quote/i }));

    expect(mockFetchQuote).toHaveBeenCalledTimes(1);
  });

  test('displays loading state', () => {
    mockUseQuote.mockReturnValue({
      quote: { text: 'Test quote', author: 'Test' },
      isLoading: true,
      error: null,
      fetchQuote: mockFetchQuote,
    });

    render(<QuoteDisplay />);

    const button = screen.getByRole('button');
    expect(button.disabled).toBe(true);
  });

  test('displays error message', () => {
    mockUseQuote.mockReturnValue({
      quote: { text: 'Error quote', author: 'Error' },
      isLoading: false,
      error: 'API Error',
      fetchQuote: mockFetchQuote,
    });

    render(<QuoteDisplay />);

    expect(screen.getByText(/API Error/i)).toBeDefined();
  });

  test('displays fetched quote', () => {
    const mockQuote = {
      text: 'Fetched quote',
      author: 'Author',
    };

    mockUseQuote.mockReturnValue({
      quote: mockQuote,
      isLoading: false,
      error: null,
      fetchQuote: mockFetchQuote,
    });

    render(<QuoteDisplay />);

    expect(screen.getByText(`"${mockQuote.text}"`)).toBeDefined();
    expect(screen.getByText(`- ${mockQuote.author}`)).toBeDefined();
  });
});
