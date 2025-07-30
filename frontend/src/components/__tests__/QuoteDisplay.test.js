import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuoteDisplay from '../QuoteDisplay';
import { Toaster } from 'react-hot-toast';

global.fetch = jest.fn();

describe('QuoteDisplay', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });

    jest.clearAllMocks();
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

  test('calls fetchQuote when button is clicked', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        text: 'Test quote',
        author: 'Test author',
      }),
    });

    render(<QuoteDisplay />);

    const button = screen.getByRole('button', { name: /Get New Quote/i });

    await act(async () => {
      button.click();
    });

    expect(fetch).toHaveBeenCalledWith('/api/v1/quote');
  });

  test('displays loading state', async () => {
    fetch.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ text: 'Test', author: 'Test' }),
              }),
            100,
          ),
        ),
    );

    render(<QuoteDisplay />);

    const button = screen.getByRole('button', { name: /Get New Quote/i });

    await act(async () => {
      button.click();
    });

    expect(button.disabled).toBe(true);
  });

  test('displays error message', async () => {
    const networkError = new Error('Network error');
    fetch.mockRejectedValue(networkError);

    render(
      <>
        <Toaster position="top-left" /> <QuoteDisplay />
      </>,
    );

    const button = screen.getByRole('button', { name: /Get New Quote/i });

    await act(async () => {
      button.click();
    });

    const toastErrorElement = await screen.findByText(networkError.message);

    expect(toastErrorElement).toBeDefined();
  });

  test('displays fetched quote', async () => {
    const mockQuote = {
      text: 'Fetched quote',
      author: 'Author',
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockQuote,
    });

    render(<QuoteDisplay />);

    const button = screen.getByRole('button', { name: /Get New Quote/i });

    await act(async () => {
      button.click();
    });

    expect(screen.getByText(`"${mockQuote.text}"`)).toBeDefined();
    expect(screen.getByText(`- ${mockQuote.author}`)).toBeDefined();
  });
});
