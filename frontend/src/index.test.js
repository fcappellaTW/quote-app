import React from 'react';
import ReactDOM from 'react-dom/client';

jest.mock('./App', () => {
  return function MockApp() {
    return <div data-testid="mock-app">Mock App Component</div>;
  };
});

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(),
}));

jest.mock('./index.css', () => {});

const MockApp = require('./App');

describe('index.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get the root element and render the App inside StrictMode', () => {
    const mockRootElement = document.createElement('div');
    jest.spyOn(document, 'getElementById').mockReturnValue(mockRootElement);

    const mockRoot = {
      render: jest.fn(),
    };

    ReactDOM.createRoot.mockReturnValue(mockRoot);

    jest.isolateModules(() => {
      require('./index');
    });

    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(mockRootElement);

    expect(mockRoot.render).toHaveBeenCalled();

    const renderedContent = mockRoot.render.mock.calls[0][0];

    expect(renderedContent.type).toBe(React.StrictMode);

    expect(renderedContent.props.children.type).toBe(MockApp);
  });
});
