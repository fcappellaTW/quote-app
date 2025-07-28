import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div data-testid="test-component">
      <span>Actual theme: {theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  let consoleErrorSpy;
  let localStorageMock;

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    window.localStorage.removeItem('theme');

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should throw an error if used outside of ThemeProvider', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('should render children', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('test-component')).toBeDefined();
  });

  it('should apply light theme by default', () => {
    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>,
    );

    expect(document.body).toHaveClass('light');
    expect(document.body).not.toHaveClass('dark');
  });

  it('should load the theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>,
    );

    expect(document.body).toHaveClass('dark');
    expect(document.body).not.toHaveClass('light');
  });

  it('should apply the system theme if nothing on localStorage', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });

    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>,
    );

    expect(document.body).toHaveClass('dark');
    expect(document.body).not.toHaveClass('light');
  });

  it('should handle localStorage error on toggle theme', () => {
    const originalLocalStorage = window.localStorage;

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    Object.defineProperty(window, 'localStorage', {
      value: undefined,
    });

    const button = screen.getByRole('button', { name: 'Toggle Theme' });

    expect(() => {
      fireEvent.click(button);
    }).toThrow('Error saving theme to localStorage');

    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
    });
  });

  it('should toggle theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByText('Actual theme: light')).toBeDefined();
    expect(document.body).toHaveClass('light');

    const button = screen.getByRole('button', { name: 'Toggle Theme' });
    fireEvent.click(button);

    expect(screen.getByText('Actual theme: dark')).toBeDefined();
    expect(document.body).toHaveClass('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
});
