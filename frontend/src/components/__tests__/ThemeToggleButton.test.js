import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggleButton from '../ThemeToggleButton';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('ThemeToggleButton', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });

    localStorage.removeItem('theme');
  });

  it('should render the button', () => {
    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render light theme by default', () => {
    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🌙');
    expect(document.body).toHaveClass('light');
  });

  it('should toggle theme when clicked', () => {
    render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🌙');

    fireEvent.click(button);
    expect(button).toHaveTextContent('☀️');

    fireEvent.click(button);
    expect(button).toHaveTextContent('🌙');
  });
});
