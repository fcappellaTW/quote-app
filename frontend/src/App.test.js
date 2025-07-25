import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test('renders initial state correctly', () => {
  render(<App />);
  expect(
    screen.getByText(/Click the button to get a random quote/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /Get New Quote/i }),
  ).toBeInTheDocument();
});

test('fetches and displays a quote', async () => {
  const mockQuote = {
    text: 'Test Quote',
    author: 'Tester',
  };

  fetch.mockResolvedValueOnce({
    json: async () => mockQuote,
  });

  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /Get New Quote/i }));

  await waitFor(() => {
    const blockquote = screen.getByRole('blockquote');
    expect(blockquote).toHaveTextContent(mockQuote.text);
  });

  await waitFor(() => {
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent(mockQuote.author);
  });

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/quote');
});
