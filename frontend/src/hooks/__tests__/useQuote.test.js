import { render, screen, renderHook, act } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import useQuote from '../useQuote';

global.fetch = jest.fn();

describe('useQuote', () => {
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

  it('should fetch a quote successfully', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        text: 'Test quote',
        author: 'Test author',
      }),
    });

    const { result } = renderHook(() => useQuote());

    await act(async () => result.current.fetchQuote());

    expect(result.current.quote).toEqual({
      text: 'Test quote',
      author: 'Test author',
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    fetch.mockRejectedValue(networkError);

    const { result } = renderHook(() => useQuote());

    render(<Toaster />);

    await act(async () => result.current.fetchQuote());

    const toastErrorElement = await screen.findByText(networkError.message);

    expect(result.current.isLoading).toBe(false);
    expect(toastErrorElement).toBeDefined();
  });

  it('should set loading state correctly', async () => {
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

    const { result } = renderHook(() => useQuote());

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      result.current.fetchQuote();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isLoading).toBe(false);
  });
});
