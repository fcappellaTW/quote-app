import { render, screen } from '@testing-library/react';
import QuoteDisclaimer from '../QuoteDisclaimer';

describe('QuoteDisclaimer', () => {
  it('should render the disclaimer when isVisible is true', () => {
    render(<QuoteDisclaimer isVisible={true} />);
    const footerElement = screen.getByTestId('quote-disclaimer');
    expect(footerElement).toHaveClass('quote-disclaimer');
  });

  it('should not render the disclaimer when isVisible is false', () => {
    render(<QuoteDisclaimer isVisible={false} />);
    const disclaimer = screen.getByTestId('quote-disclaimer');
    expect(disclaimer).toHaveClass('is-hidden');
  });
});
