import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const DismissibleToast = ({ message, toastId }) => {
  return <span onClick={() => toast.dismiss(toastId)}>{message}</span>;
};

const useQuote = () => {
  const [quote, setQuote] = useState({
    text: 'Click the button to get a random quote',
    author: 'Dev',
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchQuote = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/quote');

      if (!response.ok) {
        if (response.status === 429) {
          toast(
            t => (
              <DismissibleToast
                toastId={t.id}
                message="You are requesting quotes too fast. Please wait a moment."
              />
            ),
            { type: 'error' },
          );
        } else {
          toast(
            t => (
              <DismissibleToast
                toastId={t.id}
                message={`An error occurred: ${response.statusText} (Status: ${response.status})`}
              />
            ),
            { type: 'error' },
          );
        }
        return;
      }

      const data = await response.json();
      setQuote(data);
    } catch (error) {
      toast(t => <DismissibleToast toastId={t.id} message={error.message} />, {
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { quote, fetchQuote, isLoading };
};

export default useQuote;
