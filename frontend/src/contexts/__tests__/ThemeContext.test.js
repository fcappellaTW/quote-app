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
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
      })),
    });

    localStorage.removeItem('theme');
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
    localStorage.setItem('theme', 'dark');

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

  it('should toggle theme', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

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
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');

    setItemSpy.mockRestore();
  });
});
