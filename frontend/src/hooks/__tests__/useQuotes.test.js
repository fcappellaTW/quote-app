import { renderHook, act } from '@testing-library/react';

import useQuote from '../useQuote';

global.fetch = jest.fn();

describe('useQuote', () => {
  beforeEach(() => {
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
    expect(result.current.error).toBe(null);
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    fetch.mockRejectedValue(networkError);

    const { result } = renderHook(() => useQuote());

    await act(async () => result.current.fetchQuote());

    expect(result.current.quote).toEqual({
      text: 'Could not connect to the API.',
      author: 'Error',
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(networkError);
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
