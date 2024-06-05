import { useState, useEffect } from 'react';

const useURLChange = () => {
  const [search, setSearch] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleURLChange = () => {
        setSearch(window.location.search);
      };

      // Set the initial search value
      setSearch(window.location.search);

      // Polling mechanism to detect changes in the URL
      const interval = setInterval(handleURLChange, 100);

      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  return search;
};

export default useURLChange;
